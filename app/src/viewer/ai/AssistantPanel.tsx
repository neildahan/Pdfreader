import { Fragment, memo, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, Highlighter, KeyRound, Loader2, LocateFixed, Server, Settings2, Sparkles, Square, Trash2 } from 'lucide-react';
import { askDocument, explainError, findPassages, isConfigured, MODELS, saveAiSettings, type AiSettings, type AnswerPart, type Citation, type DocText, type Finding } from './ai';
import type { Rect } from '../types';

type Msg =
  | { id: number; role: 'user'; text: string; mode: 'ask' | 'find' }
  | { id: number; role: 'assistant'; text: string; parts?: AnswerPart[]; findings?: Checked[]; error?: string; pending?: boolean; note?: string };

/** A finding plus where its quote was found on the page (empty when the quote isn't in the text). */
type Checked = Finding & { rects: Rect[] };

type Props = {
  settings: AiSettings;
  onSettings: (s: AiSettings) => void;
  getDocText: () => Promise<DocText>;
  locate: (page: number, quote: string) => Promise<Rect[]>;
  onJump: (page: number, rects: Rect[]) => void;
  onHighlight: (page: number, rects: Rect[], quote: string, note: string) => void;
  /** A question handed over from elsewhere in the viewer (e.g. "Ask AI" on a highlight). */
  seed: { text: string; n: number } | null;
};

const QUICK: { label: string; mode: 'ask' | 'find'; text: string }[] = [
  { label: 'Summarize', mode: 'ask', text: 'Summarize this document in 5 bullet points: parties, purpose, key terms, money, and term.' },
  { label: 'Dates & deadlines', mode: 'find', text: 'every date, deadline, notice period or time limit' },
  { label: 'Money & payment terms', mode: 'find', text: 'payment terms, fees, interest, credits and caps' },
  { label: 'Risks for us', mode: 'ask', text: 'What are the biggest risks or one-sided terms in this document, and where are they?' },
];

// Minimal formatting for model output: paragraphs, "- " bullets and **bold**.
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((t, i) => (t.startsWith('**') && t.endsWith('**') ? <strong key={i}>{t.slice(2, -2)}</strong> : <Fragment key={i}>{t}</Fragment>));
}

function Rich({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split('\n');
        if (lines.every((l) => /^\s*([-*•]|\d+\.)\s/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s/, ''))}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{inline(b.replace(/^#+\s*/, ''))}</p>;
      })}
    </>
  );
}

function CitationChip({ c, props }: { c: Citation; props: Props }) {
  const [busy, setBusy] = useState(false);
  const go = async (highlight: boolean) => {
    setBusy(true);
    const rects = await props.locate(c.page, c.quote);
    setBusy(false);
    if (highlight && rects.length) props.onHighlight(c.page, rects, c.quote, 'Cited by the AI assistant');
    else props.onJump(c.page, rects);
  };
  return (
    <span className="mg-cite" title={`“${c.quote}”`}>
      <button className="mg-cite-page" onClick={() => go(false)} disabled={busy}>
        p. {c.page + 1}
      </button>
      <button className="mg-cite-hl" onClick={() => go(true)} disabled={busy} aria-label="Highlight this passage" title="Highlight this passage">
        <Highlighter size={11} />
      </button>
    </span>
  );
}

/** Answer text with its citations folded into one paragraph flow. */
function Answer({ parts, props }: { parts: AnswerPart[]; props: Props }) {
  // Join parts into paragraphs; citations attach right after the sentence they support.
  const paragraphs: { text: string; cites: Citation[] }[][] = [[]];
  for (const p of parts) {
    const pieces = p.text.split(/\n{2,}/);
    pieces.forEach((piece, i) => {
      if (i > 0) paragraphs.push([]);
      paragraphs[paragraphs.length - 1].push({ text: piece, cites: i === pieces.length - 1 ? p.citations : [] });
    });
  }
  return (
    <>
      {paragraphs
        .filter((para) => para.some((x) => x.text.trim() || x.cites.length))
        .map((para, i) => {
          const joined = para.map((x) => x.text).join('');
          const isList = joined.split('\n').filter(Boolean).every((l) => /^\s*([-*•]|\d+\.)\s/.test(l));
          if (isList) {
            const cites = para.flatMap((x) => x.cites);
            return (
              <div key={i}>
                <Rich text={joined} />
                {cites.length > 0 && <div className="mg-cites">{dedupe(cites).map((c, j) => <CitationChip key={j} c={c} props={props} />)}</div>}
              </div>
            );
          }
          return (
            <p key={i}>
              {para.map((x, j) => (
                <Fragment key={j}>
                  {inline(x.text.replace(/^#+\s*/, ''))}
                  {dedupe(x.cites).map((c, k) => (
                    <CitationChip key={k} c={c} props={props} />
                  ))}
                </Fragment>
              ))}
            </p>
          );
        })}
    </>
  );
}

const dedupe = (cs: Citation[]) => cs.filter((c, i) => cs.findIndex((d) => d.page === c.page && d.quote === c.quote) === i);

function Findings({ findings, props }: { findings: Checked[]; props: Props }) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const highlight = (i: number) => {
    const f = findings[i];
    if (!f.rects.length) return;
    props.onHighlight(f.page, f.rects, f.quote, `${f.label}: ${f.note}`);
    setDone((d) => new Set(d).add(i));
  };
  if (!findings.length) return <p>Nothing matching was found in this document.</p>;
  return (
    <div className="mg-findings">
      <div className="mg-findings-head">
        <span>
          {findings.length} passage{findings.length > 1 ? 's' : ''}
        </span>
        <button className="mg-link-btn" onClick={() => findings.forEach((_, i) => !done.has(i) && highlight(i))}>
          <Highlighter size={13} /> Highlight all
        </button>
      </div>
      {findings.map((f, i) => (
        <div key={i} className="mg-finding">
          <div className="mg-finding-top">
            <strong>{f.label}</strong>
            <span className="mg-card-page">p. {f.page + 1}</span>
          </div>
          <blockquote className="mg-quote">{f.quote}</blockquote>
          <p className="mg-finding-note">{f.note}</p>
          <div className="mg-finding-actions">
            <button className="mg-link-btn" onClick={() => props.onJump(f.page, f.rects)}>
              <LocateFixed size={13} /> {f.rects.length ? 'Show' : `Go to page ${f.page + 1}`}
            </button>
            {f.rects.length ? (
              <button className="mg-link-btn" disabled={done.has(i)} onClick={() => highlight(i)}>
                <Highlighter size={13} /> {done.has(i) ? 'Highlighted' : 'Highlight'}
              </button>
            ) : (
              <span className="mg-unverified">Exact quote not found on the page. Check it yourself.</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsCard({ settings, onSave, onCancel }: { settings: AiSettings; onSave: (s: AiSettings) => void; onCancel?: () => void }) {
  const [s, setS] = useState(settings);
  const valid = isConfigured(s);
  return (
    <div className="mg-ai-settings">
      <h4>Connect your AI</h4>
      <p className="mg-ai-muted">Use your own key. Your documents go only to the AI provider you choose, and you pay them directly.</p>
      <label className={`mg-ai-option ${s.mode === 'browser' ? 'is-on' : ''}`}>
        <input type="radio" name="mg-ai-mode" checked={s.mode === 'browser'} onChange={() => setS({ ...s, mode: 'browser' })} />
        <KeyRound size={16} />
        <div>
          <strong>My Anthropic API key</strong>
          <span>Stored only in this browser. Requests go straight from your browser to Anthropic.</span>
        </div>
      </label>
      {s.mode === 'browser' && (
        <input
          className="mg-input"
          type="password"
          autoComplete="off"
          placeholder="sk-ant-…"
          value={s.apiKey}
          onChange={(e) => setS({ ...s, apiKey: e.target.value })}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="Anthropic API key"
        />
      )}
      <label className={`mg-ai-option ${s.mode === 'endpoint' ? 'is-on' : ''}`}>
        <input type="radio" name="mg-ai-mode" checked={s.mode === 'endpoint'} onChange={() => setS({ ...s, mode: 'endpoint' })} />
        <Server size={16} />
        <div>
          <strong>My server endpoint</strong>
          <span>Your backend holds the key and forwards requests. Recommended for production.</span>
        </div>
      </label>
      {s.mode === 'endpoint' && (
        <input
          className="mg-input"
          placeholder="https://your-app.com/api/margin-ai"
          value={s.endpoint}
          onChange={(e) => setS({ ...s, endpoint: e.target.value })}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="AI endpoint URL"
        />
      )}
      <label className="mg-ai-field">
        Model
        <select className="mg-input" value={s.model} onChange={(e) => setS({ ...s, model: e.target.value })}>
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </label>
      <div className="mg-ai-settings-foot">
        {settings.apiKey && s.mode === 'browser' && (
          <button className="mg-btn ghost sm" onClick={() => onSave({ ...s, apiKey: '' })}>
            Forget key
          </button>
        )}
        <div style={{ flex: 1 }} />
        {onCancel && (
          <button className="mg-btn ghost sm" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="mg-btn primary sm" disabled={!valid} onClick={() => onSave(s)}>
          Save
        </button>
      </div>
    </div>
  );
}

export const AssistantPanel = memo(function AssistantPanel(props: Props) {
  const { settings } = props;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'ask' | 'find'>('ask');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(1);
  const configured = isConfigured(settings);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
  }, [msgs]);

  useEffect(() => {
    if (!props.seed) return;
    setMode('ask');
    setInput(props.seed.text);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [props.seed]);

  const save = (s: AiSettings) => {
    saveAiSettings(s);
    props.onSettings(s);
    setEditing(false);
  };

  async function send(text: string, m: 'ask' | 'find') {
    const q = text.trim();
    if (!q || busy || !configured) return;
    setInput('');
    const userMsg: Msg = { id: nextId.current++, role: 'user', text: q, mode: m };
    const replyId = nextId.current++;
    // History for follow-ups: completed question/answer pairs from Ask mode only.
    const history: { role: 'user' | 'assistant'; text: string }[] = [];
    msgs.forEach((x, i) => {
      const reply = msgs[i + 1];
      if (x.role === 'user' && x.mode === 'ask' && reply?.role === 'assistant' && reply.parts && !reply.error) {
        history.push({ role: 'user', text: x.text }, { role: 'assistant', text: reply.text });
      }
    });
    setMsgs((cur) => [...cur, userMsg, { id: replyId, role: 'assistant', text: '', pending: true }]);
    setBusy(true);
    const ctrl = new AbortController();
    abort.current = ctrl;
    const patch = (p: Partial<Extract<Msg, { role: 'assistant' }>>) => setMsgs((cur) => cur.map((x) => (x.id === replyId ? ({ ...x, ...p } as Msg) : x)));
    try {
      const doc = await props.getDocText();
      if (!doc.pages.some((p) => p.trim())) throw new Error('This PDF has no selectable text (it may be a scan), so the assistant can’t read it.');
      const truncNote = (n: number | null) => (n === null ? undefined : `The document is long; only pages 1–${n} were sent.`);
      if (m === 'find') {
        const { findings, truncatedAt } = await findPassages({ settings, doc, request: q, signal: ctrl.signal });
        // Verify every quote against the real page text before offering to highlight it.
        const checked = await Promise.all(findings.map(async (f) => ({ ...f, rects: f.page < doc.pages.length ? await props.locate(f.page, f.quote) : [] })));
        patch({ pending: false, text: `Found ${checked.length}`, findings: checked, note: truncNote(truncatedAt) });
      } else {
        const res = await askDocument({ settings, doc, history, question: q, onText: (t) => patch({ text: t }), signal: ctrl.signal });
        patch({ pending: false, text: res.parts.map((p) => p.text).join(''), parts: res.parts, note: truncNote(res.truncatedAt) });
      }
    } catch (e) {
      patch({ pending: false, error: explainError(e, settings) });
    } finally {
      setBusy(false);
      abort.current = null;
    }
  }

  if (!configured || editing) {
    return (
      <div className="mg-ai">
        <div className="mg-ai-scroll">
          <SettingsCard settings={settings} onSave={save} onCancel={configured ? () => setEditing(false) : undefined} />
        </div>
      </div>
    );
  }

  const model = MODELS.find((m) => m.id === settings.model)?.label.split(' (')[0] ?? settings.model;

  return (
    <div className="mg-ai">
      <div className="mg-ai-bar">
        <span className="mg-ai-model">
          <Sparkles size={13} /> {model} · {settings.mode === 'browser' ? 'your key' : 'your server'}
        </span>
        <div className="mg-ai-bar-actions">
          {msgs.length > 0 && (
            <button className="mg-icon-btn sm" title="Clear conversation" onClick={() => setMsgs([])} disabled={busy}>
              <Trash2 size={14} />
            </button>
          )}
          <button className="mg-icon-btn sm" title="AI settings" onClick={() => setEditing(true)}>
            <Settings2 size={14} />
          </button>
        </div>
      </div>
      <div className="mg-ai-scroll" ref={list}>
        {msgs.length === 0 && (
          <div className="mg-ai-empty">
            <div className="mg-ai-empty-icon">
              <Sparkles size={20} />
            </div>
            <p>Ask anything about this document. Answers cite the exact passage, and you can turn any citation into a highlight.</p>
            <div className="mg-ai-quick">
              {QUICK.map((q) => (
                <button key={q.label} className="mg-chip-btn" onClick={() => send(q.text, q.mode)}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="mg-ai-user">
              {m.mode === 'find' && <span className="mg-ai-tag">Find</span>}
              {m.text}
            </div>
          ) : (
            <div key={m.id} className="mg-ai-reply">
              {m.error ? (
                <p className="mg-ai-error">{m.error}</p>
              ) : m.findings ? (
                <Findings findings={m.findings} props={props} />
              ) : m.parts ? (
                <Answer parts={m.parts} props={props} />
              ) : m.text ? (
                <Rich text={m.text} />
              ) : (
                <p className="mg-ai-thinking">
                  <Loader2 size={14} className="spin" /> {m.pending ? 'Reading the document…' : ''}
                </p>
              )}
              {m.note && <p className="mg-ai-muted">{m.note}</p>}
            </div>
          ),
        )}
      </div>
      <div className="mg-ai-compose">
        <div className="mg-ai-modes" role="tablist">
          <button role="tab" aria-selected={mode === 'ask'} className={mode === 'ask' ? 'is-active' : ''} onClick={() => setMode('ask')}>
            Ask
          </button>
          <button role="tab" aria-selected={mode === 'find'} className={mode === 'find' ? 'is-active' : ''} onClick={() => setMode('find')}>
            Find & highlight
          </button>
        </div>
        <div className="mg-ai-input">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            placeholder={mode === 'ask' ? 'Ask about this document…' : 'What should I find? e.g. termination clauses'}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input, mode);
              }
            }}
          />
          {busy ? (
            <button className="mg-ai-send" onClick={() => abort.current?.abort()} title="Stop" aria-label="Stop">
              <Square size={14} />
            </button>
          ) : (
            <button className="mg-ai-send" onClick={() => send(input, mode)} disabled={!input.trim()} title="Send" aria-label="Send">
              <ArrowUp size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
