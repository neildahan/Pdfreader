import Anthropic from '@anthropic-ai/sdk';
import type { BetaMessageParam, BetaTextBlock } from '@anthropic-ai/sdk/resources/beta/messages/messages';

// Bring-your-own-key AI. Two modes:
// - "browser": the user's Anthropic key is kept in this browser and requests go straight to Anthropic.
// - "endpoint": requests go to the customer's own server, which adds the key (see server/ai-proxy.mjs).

export type AiSettings = {
  mode: 'browser' | 'endpoint';
  apiKey: string;
  endpoint: string;
  model: string;
};

export const MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5 (best)' },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (faster, cheaper)' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (fastest)' },
];

const KEY = 'margin:ai';
const DEFAULTS: AiSettings = { mode: 'browser', apiKey: '', endpoint: import.meta.env.VITE_AI_ENDPOINT?.trim() || '', model: 'claude-opus-5-5' };

export function loadAiSettings(): AiSettings {
  try {
    const raw = localStorage.getItem(KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<AiSettings>) : {};
    const s = { ...DEFAULTS, ...saved };
    // A deployment-provided endpoint is the default when the viewer hasn't chosen otherwise.
    if (!raw && DEFAULTS.endpoint) s.mode = 'endpoint';
    return s;
  } catch {
    return DEFAULTS;
  }
}

export function saveAiSettings(s: AiSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Blocked storage: settings last for this page view only.
  }
}

export const isConfigured = (s: AiSettings) => (s.mode === 'browser' ? s.apiKey.trim().startsWith('sk-') : /^https?:\/\//.test(s.endpoint.trim()));

function client(s: AiSettings) {
  return new Anthropic(
    s.mode === 'browser'
      ? { apiKey: s.apiKey.trim(), dangerouslyAllowBrowser: true }
      : // The proxy holds the real key; the SDK still sends a placeholder header.
        { apiKey: 'proxy', baseURL: s.endpoint.trim().replace(/\/+$/, ''), dangerouslyAllowBrowser: true },
  );
}

/** Per-page text, in the same form the viewer's search index uses, so quotes can be located on the page. */
export type DocText = { name: string; pages: string[] };

const MAX_CHARS = 600_000;

type Corpus = { text: string; offsets: number[]; truncatedAt: number | null };

function corpus(doc: DocText): Corpus {
  let text = '';
  const offsets: number[] = [];
  let truncatedAt: number | null = null;
  doc.pages.forEach((p, i) => {
    if (truncatedAt !== null) return;
    const header = `${i ? '\n\n' : ''}[Page ${i + 1}]\n`;
    if (text.length + header.length + p.length > MAX_CHARS) {
      truncatedAt = i;
      return;
    }
    text += header;
    offsets[i] = text.length;
    text += p.trim() ? p : '(no text on this page)';
  });
  return { text, offsets, truncatedAt };
}

export type Citation = { page: number; quote: string };
export type AnswerPart = { text: string; citations: Citation[] };

export type AskResult = { parts: AnswerPart[]; truncatedAt: number | null };

const SYSTEM = `You are a document assistant inside a PDF viewer. Answer questions about the attached document accurately and concisely.
Ground every factual statement in the document and cite it. If the document doesn't contain the answer, say so plainly.
Write in short paragraphs or tight bullet lists. Refer to pages as "page N". Never invent clauses, numbers or dates.`;

function pageFor(offsets: number[], index: number): number {
  let page = 0;
  offsets.forEach((o, i) => {
    if (o !== undefined && o <= index) page = i;
  });
  return page;
}

function refusalText(stop: string | null | undefined) {
  return stop === 'refusal' ? 'The model declined to answer this request.' : null;
}

/**
 * Streams an answer about the document. `onText` receives the growing plain text;
 * the resolved value has the final answer split into parts with exact citations.
 */
export async function askDocument(opts: {
  settings: AiSettings;
  doc: DocText;
  history: { role: 'user' | 'assistant'; text: string }[];
  question: string;
  onText: (text: string) => void;
  signal: AbortSignal;
}): Promise<AskResult> {
  const { text, offsets, truncatedAt } = corpus(opts.doc);
  const messages: BetaMessageParam[] = [];
  // The document sits in the first user turn with a cache breakpoint, so follow-up
  // questions reuse the cached prefix instead of paying for the document again.
  const first = opts.history.length ? opts.history[0] : { role: 'user' as const, text: opts.question };
  messages.push({
    role: 'user',
    content: [
      {
        type: 'document',
        source: { type: 'text', media_type: 'text/plain', data: text },
        title: opts.doc.name,
        citations: { enabled: true },
        cache_control: { type: 'ephemeral' },
      },
      { type: 'text', text: first.text },
    ],
  });
  for (const m of opts.history.slice(1)) messages.push({ role: m.role, content: m.text });
  if (opts.history.length) messages.push({ role: 'user', content: opts.question });

  const stream = client(opts.settings).beta.messages.stream(
    {
      model: opts.settings.model,
      max_tokens: 16000,
      system: SYSTEM,
      messages,
      ...(opts.settings.model === 'claude-haiku-4-5' ? {} : { output_config: { effort: 'medium' as const } }),
      // Server-side fallback: if a safety classifier declines, the API retries on a suitable model.
      ...(opts.settings.model === 'claude-haiku-4-5' ? {} : { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const }),
    },
    { signal: opts.signal },
  );

  let live = '';
  stream.on('text', (t) => {
    live += t;
    opts.onText(live);
  });
  const message = await stream.finalMessage();
  const refused = refusalText(message.stop_reason);
  if (refused) return { parts: [{ text: refused, citations: [] }], truncatedAt };

  const parts: AnswerPart[] = [];
  for (const block of message.content) {
    if (block.type !== 'text') continue;
    const b = block as BetaTextBlock;
    const citations: Citation[] = [];
    for (const c of b.citations ?? []) {
      if (c.type !== 'char_location') continue;
      const quote = c.cited_text.replace(/^\[Page \d+\]\s*/, '').trim();
      if (quote) citations.push({ page: pageFor(offsets, c.start_char_index), quote });
    }
    parts.push({ text: b.text, citations });
  }
  return { parts, truncatedAt };
}

export type Finding = { label: string; page: number; quote: string; note: string };

/** Finds passages matching a request (e.g. "termination clauses") as structured JSON. */
export async function findPassages(opts: { settings: AiSettings; doc: DocText; request: string; signal: AbortSignal }): Promise<{ findings: Finding[]; truncatedAt: number | null }> {
  const { text, truncatedAt } = corpus(opts.doc);
  const schema = {
    type: 'object',
    properties: {
      findings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string', description: 'Short name, e.g. "Late payment interest"' },
            page: { type: 'integer', description: '1-based page number from the [Page N] markers' },
            quote: { type: 'string', description: 'An exact, verbatim sentence or phrase copied from that page (max ~40 words)' },
            note: { type: 'string', description: 'One sentence on why it matters' },
          },
          required: ['label', 'page', 'quote', 'note'],
          additionalProperties: false,
        },
      },
    },
    required: ['findings'],
    additionalProperties: false,
  };
  const stream = client(opts.settings).beta.messages.stream(
    {
      model: opts.settings.model,
      max_tokens: 16000,
      system: 'You locate passages in documents. Quotes must be copied verbatim from the document text, character for character.',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'document', source: { type: 'text', media_type: 'text/plain', data: text }, title: opts.doc.name, cache_control: { type: 'ephemeral' } },
            { type: 'text', text: `Find the passages in this document that match: ${opts.request}\nReturn at most 12, in document order. Return an empty list if there are none.` },
          ],
        },
      ],
      output_config: { format: { type: 'json_schema', schema }, ...(opts.settings.model === 'claude-haiku-4-5' ? {} : { effort: 'medium' as const }) },
      ...(opts.settings.model === 'claude-haiku-4-5' ? {} : { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const }),
    },
    { signal: opts.signal },
  );
  const message = await stream.finalMessage();
  if (message.stop_reason === 'refusal') throw new Error('The model declined this request.');
  const raw = message.content.find((b) => b.type === 'text') as BetaTextBlock | undefined;
  const parsed = JSON.parse(raw?.text || '{"findings":[]}') as { findings: Finding[] };
  return { findings: parsed.findings.map((f) => ({ ...f, page: Math.max(0, f.page - 1) })), truncatedAt };
}

/** Turns SDK errors into a sentence a person can act on. */
export function explainError(e: unknown, s: AiSettings): string {
  if (e instanceof Anthropic.AuthenticationError) return s.mode === 'browser' ? 'Anthropic rejected the API key. Check it in AI settings.' : 'Your server rejected the request (authentication).';
  if (e instanceof Anthropic.PermissionDeniedError) return 'This API key is not allowed to use the selected model.';
  if (e instanceof Anthropic.NotFoundError) return s.mode === 'endpoint' ? 'Your endpoint returned 404. It should forward POST /v1/messages to Anthropic.' : 'The selected model was not found for this key.';
  if (e instanceof Anthropic.RateLimitError) return 'Rate limited by the API. Wait a moment and try again.';
  if (e instanceof Anthropic.APIConnectionError) return s.mode === 'endpoint' ? 'Could not reach your endpoint. Check the URL and that it allows requests from this site (CORS).' : 'Could not reach Anthropic. Check your connection.';
  if (e instanceof Anthropic.APIError) return `The API returned an error (${e.status ?? 'unknown'}): ${e.message}`;
  if (e instanceof Error && e.name === 'AbortError') return 'Stopped.';
  return e instanceof Error ? e.message : 'Something went wrong.';
}
