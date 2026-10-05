import { memo, useEffect, useRef, useState } from 'react';
import { Check, CornerDownRight, Highlighter, MessageSquare, MousePointerClick, PenLine, RotateCcw, Square, Circle, MoveUpRight, Type, Underline, Strikethrough, StickyNote, Signature, Trash2, X } from 'lucide-react';
import type { AnnAction } from './store';
import { TOOL_LABELS, type Annotation } from './types';
import { uid } from './geometry';

const ICONS = {
  highlight: Highlighter,
  underline: Underline,
  strikeout: Strikethrough,
  ink: PenLine,
  rect: Square,
  ellipse: Circle,
  arrow: MoveUpRight,
  text: Type,
  note: StickyNote,
};

export function timeAgo(ms: number) {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 45) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function Avatar({ name }: { name: string }) {
  const initials = name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase() || '?';
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) | 0;
  const hue = Math.abs(hash) % 360;
  return (
    <span className="mg-avatar" style={{ background: `hsl(${hue} 60% 92%)`, color: `hsl(${hue} 55% 32%)` }}>
      {initials}
    </span>
  );
}

function AutoTextarea({ value, onChange, placeholder, autoFocus, onSubmit }: { value: string; onChange: (v: string) => void; placeholder: string; autoFocus?: boolean; onSubmit?: () => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      className="mg-input mg-autotext"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
          e.preventDefault();
          onSubmit();
        }
      }}
    />
  );
}

function Card({ a, selected, focus, author, dispatch, onSelect }: { a: Annotation; selected: boolean; focus: boolean; author: string; dispatch: (x: AnnAction) => void; onSelect: (id: string) => void }) {
  const Icon = a.type === 'ink' && a.signature ? Signature : ICONS[a.type];
  const [draft, setDraft] = useState(a.comment);
  const [reply, setReply] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setDraft(a.comment), [a.comment]);
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selected]);

  const saveComment = () => {
    if (draft !== a.comment) dispatch({ type: 'update', id: a.id, patch: { comment: draft } });
  };
  const sendReply = () => {
    if (!reply.trim()) return;
    dispatch({ type: 'update', id: a.id, patch: { replies: [...a.replies, { id: uid(), author, text: reply.trim(), createdAt: Date.now() }] } });
    setReply('');
  };

  const label = a.type === 'ink' && a.signature ? 'Signature' : TOOL_LABELS[a.type];
  return (
    <div ref={ref} className={`mg-card ${selected ? 'is-selected' : ''} ${a.resolved ? 'is-resolved' : ''}`} onClick={() => onSelect(a.id)}>
      <div className="mg-card-head">
        <span className="mg-card-icon" style={{ background: a.color }}>
          <Icon size={13} />
        </span>
        <span className="mg-card-type">{label}</span>
        <span className="mg-card-page">p. {a.page + 1}</span>
        <div className="mg-card-actions">
          <button
            className="mg-icon-btn sm"
            title={a.resolved ? 'Reopen' : 'Resolve'}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'update', id: a.id, patch: { resolved: !a.resolved } });
            }}
          >
            {a.resolved ? <RotateCcw size={14} /> : <Check size={14} />}
          </button>
          <button
            className="mg-icon-btn sm danger"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'remove', id: a.id });
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {'text' in a && a.text && a.type !== 'text' && <blockquote className="mg-quote">{a.text}</blockquote>}
      {a.type === 'text' && <blockquote className="mg-quote plain">{a.text || 'Empty text box'}</blockquote>}
      <div className="mg-thread">
        <div className="mg-msg">
          <Avatar name={a.author} />
          <div className="mg-msg-body">
            <div className="mg-msg-meta">
              <strong>{a.author}</strong> <span>{timeAgo(a.createdAt)}</span>
            </div>
            {selected || focus ? (
              <div onBlur={saveComment}>
                <AutoTextarea value={draft} onChange={setDraft} placeholder="Add a comment…" autoFocus={focus} onSubmit={saveComment} />
              </div>
            ) : (
              <p className={a.comment ? '' : 'mg-muted'}>{a.comment || 'No comment yet'}</p>
            )}
          </div>
        </div>
        {a.replies.map((r) => (
          <div key={r.id} className="mg-msg reply">
            <Avatar name={r.author} />
            <div className="mg-msg-body">
              <div className="mg-msg-meta">
                <strong>{r.author}</strong> <span>{timeAgo(r.createdAt)}</span>
              </div>
              <p>{r.text}</p>
            </div>
          </div>
        ))}
        {selected && (
          <div className="mg-reply-box" onClick={(e) => e.stopPropagation()}>
            <CornerDownRight size={14} className="mg-muted" />
            <AutoTextarea value={reply} onChange={setReply} placeholder="Reply… (Enter to send)" onSubmit={sendReply} />
          </div>
        )}
      </div>
    </div>
  );
}

type Filter = 'all' | 'open' | 'resolved';

export const CommentsPanel = memo(function CommentsPanel({
  annotations,
  selectedId,
  focusId,
  author,
  onAuthor,
  dispatch,
  onSelect,
  onClose,
}: {
  annotations: Annotation[];
  selectedId: string | null;
  focusId: string | null;
  author: string;
  onAuthor: (n: string) => void;
  dispatch: (a: AnnAction) => void;
  onSelect: (id: string) => void;
  onClose?: () => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const sorted = [...annotations].sort((a, b) => a.page - b.page || a.createdAt - b.createdAt);
  const shown = sorted.filter((a) => (filter === 'all' ? true : filter === 'open' ? !a.resolved : a.resolved));
  const open = annotations.filter((a) => !a.resolved).length;

  return (
    <div className="mg-comments">
      <div className="mg-comments-head">
        <div className="mg-comments-title">
          <MessageSquare size={16} /> Comments <span className="mg-count">{annotations.length}</span>
        </div>
        <label className="mg-author">
          <Avatar name={author} />
          <input className="mg-input bare" value={author} onChange={(e) => onAuthor(e.target.value)} onKeyDown={(e) => e.stopPropagation()} aria-label="Your name" />
        </label>
        {onClose && (
          <button className="mg-icon-btn sm mg-close-panel" onClick={onClose} aria-label="Close comments">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="mg-segmented">
        {(['all', 'open', 'resolved'] as Filter[]).map((f) => (
          <button key={f} className={filter === f ? 'is-active' : ''} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'open' ? `Open ${open}` : `Resolved ${annotations.length - open}`}
          </button>
        ))}
      </div>
      <div className="mg-card-list">
        {shown.length === 0 && (
          <div className="mg-empty">
            <MousePointerClick size={28} />
            <p>{annotations.length ? 'Nothing here.' : 'Select a tool above and mark up the document. Every annotation gets a comment thread.'}</p>
          </div>
        )}
        {shown.map((a) => (
          <Card key={a.id} a={a} selected={a.id === selectedId} focus={a.id === focusId} author={author} dispatch={dispatch} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
});
