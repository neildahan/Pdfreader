import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Circle,
  Download,
  FileJson,
  FileUp,
  FolderOpen,
  Highlighter,
  Loader2,
  Maximize2,
  MessageSquare,
  Minus,
  MousePointer2,
  MoveUpRight,
  PanelLeft,
  PenLine,
  Plus,
  Redo2,
  RotateCcw,
  Search,
  Signature,
  Square,
  StickyNote,
  Strikethrough,
  Type,
  Underline,
  Undo2,
  Upload,
  X,
} from 'lucide-react';
import { loadDocument, type LoadedDocument } from './pdfLoader';
import { annReducer, loadSaved, save } from './store';
import { bbox } from './geometry';
import { PageView } from './PageView';
import { Thumbnails } from './Thumbnails';
import { CommentsPanel } from './CommentsPanel';
import { SignaturePad } from './SignaturePad';
import { TextIndex, type SearchHit } from './search';
import { download, exportPdf } from './exportPdf';
import type { ToolStyle } from './AnnotationLayer';
import { PALETTE, type Annotation, type Point, type Tool } from './types';
import './viewer.css';

const CSS_UNITS = 96 / 72;
const MIN_SCALE = 0.25 * CSS_UNITS;
const MAX_SCALE = 5 * CSS_UNITS;

const TOOLS: { id: Tool; icon: typeof Highlighter; label: string; key: string }[][] = [
  [{ id: 'select', icon: MousePointer2, label: 'Select', key: 'V' }],
  [
    { id: 'highlight', icon: Highlighter, label: 'Highlight text', key: 'H' },
    { id: 'underline', icon: Underline, label: 'Underline text', key: 'U' },
    { id: 'strikeout', icon: Strikethrough, label: 'Strike through text', key: 'K' },
  ],
  [
    { id: 'ink', icon: PenLine, label: 'Pen', key: 'P' },
    { id: 'rect', icon: Square, label: 'Rectangle', key: 'R' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse', key: 'O' },
    { id: 'arrow', icon: MoveUpRight, label: 'Arrow', key: 'A' },
  ],
  [
    { id: 'text', icon: Type, label: 'Text box', key: 'T' },
    { id: 'note', icon: StickyNote, label: 'Sticky note', key: 'N' },
    { id: 'signature', icon: Signature, label: 'Signature', key: 'G' },
  ],
];
const KEYMAP = Object.fromEntries(TOOLS.flat().map((t) => [t.key.toLowerCase(), t.id])) as Record<string, Tool>;

const DEFAULT_STYLES: Record<Tool, ToolStyle> = {
  select: { color: '#FFD43B', strokeWidth: 2, opacity: 1, fontSize: 13 },
  highlight: { color: '#FFD43B', strokeWidth: 2, opacity: 0.45, fontSize: 13 },
  underline: { color: '#4DABF7', strokeWidth: 2, opacity: 1, fontSize: 13 },
  strikeout: { color: '#FF8787', strokeWidth: 2, opacity: 1, fontSize: 13 },
  ink: { color: '#FF8787', strokeWidth: 2.5, opacity: 1, fontSize: 13 },
  rect: { color: '#FF8787', strokeWidth: 2, opacity: 1, fontSize: 13 },
  ellipse: { color: '#FF8787', strokeWidth: 2, opacity: 1, fontSize: 13 },
  arrow: { color: '#FF8787', strokeWidth: 2, opacity: 1, fontSize: 13 },
  text: { color: '#212529', strokeWidth: 2, opacity: 1, fontSize: 13 },
  note: { color: '#FFD43B', strokeWidth: 2, opacity: 1, fontSize: 13 },
  signature: { color: '#1C3FAA', strokeWidth: 2, opacity: 1, fontSize: 13 },
};
const TOOL_PALETTE = [...PALETTE.slice(0, 6), '#1C3FAA', '#212529'];
const STROKES = [1.5, 2.5, 4, 7];
const FONT_SIZES = [10, 13, 16, 22];

export type ViewerProps = {
  /** URL of the PDF to open first. */
  src: string;
  /** Embedded mode: fewer panels, used inside the marketing page. */
  compact?: boolean;
  /** Pre-filled reviewer name. */
  author?: string;
};

type Toast = { id: number; text: string };

function readAuthor(fallback: string) {
  try {
    return localStorage.getItem('margin:author') || fallback;
  } catch {
    return fallback;
  }
}

export function Viewer({ src, compact = false, author: authorProp = 'You' }: ViewerProps) {
  const [doc, setDoc] = useState<LoadedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ann, dispatch] = useReducer(annReducer, { annotations: [], past: [], future: [] });
  const [tool, setToolState] = useState<Tool>('select');
  const [styles, setStyles] = useState(DEFAULT_STYLES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [focusCommentId, setFocusCommentId] = useState<string | null>(null);
  const [scale, setScale] = useState(CSS_UNITS);
  const [fit, setFit] = useState(true);
  const [current, setCurrent] = useState(0);
  const [showThumbs, setShowThumbs] = useState(!compact);
  const [showComments, setShowComments] = useState(() => window.innerWidth > 900);
  const [author, setAuthorState] = useState(() => readAuthor(authorProp));
  const [signature, setSignature] = useState<Point[][] | null>(null);
  const [sigOpen, setSigOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [hitIndex, setHitIndex] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [busy, setBusy] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const jsonRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const indexRef = useRef<TextIndex | null>(null);
  const anchor = useRef<{ ratio: number; left: number } | null>(null);

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const setAuthor = (n: string) => {
    setAuthorState(n);
    try {
      localStorage.setItem('margin:author', n);
    } catch {
      /* ignore */
    }
  };

  const open = useCallback(
    async (data: ArrayBuffer, name: string) => {
      setLoading(true);
      setError(null);
      try {
        const loaded = await loadDocument(data, name);
        indexRef.current = new TextIndex(loaded.pdf);
        const saved = loadSaved(loaded.fingerprint);
        dispatch({ type: 'set', annotations: saved ?? loaded.imported });
        setDoc((old) => {
          old?.pdf.loadingTask.destroy();
          return loaded;
        });
        setSelectedId(null);
        setEditingId(null);
        setHits([]);
        setQuery('');
        setCurrent(0);
        setFit(true);
        scrollRef.current?.scrollTo({ top: 0 });
        if (!saved && loaded.imported.length) toast(`Imported ${loaded.imported.length} existing annotation${loaded.imported.length > 1 ? 's' : ''}`);
      } catch (e) {
        setError(e instanceof Error && e.name === 'PasswordException' ? 'This PDF is password protected.' : 'Could not open this file. Is it a valid PDF?');
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (!cancelled) open(buf, src.split('/').pop() || 'document.pdf');
      })
      .catch(() => setError('Could not load the sample document.'));
    return () => {
      cancelled = true;
    };
  }, [src, open]);

  // Autosave per document.
  useEffect(() => {
    if (!doc) return;
    const t = setTimeout(() => save(doc.fingerprint, ann.annotations), 300);
    return () => clearTimeout(t);
  }, [ann.annotations, doc]);

  // Fit to width on load and on resize while in fit mode.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !doc) return;
    const apply = () => {
      if (!fit) return;
      const maxW = Math.max(...doc.pages.map((p) => p.width));
      const avail = el.clientWidth - (compact ? 32 : 64);
      setScale(Math.max(MIN_SCALE, Math.min(compact ? 1.6 : 1.5 * CSS_UNITS, avail / maxW)));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [doc, fit, compact, showThumbs, showComments]);

  const zoomTo = useCallback((next: number) => {
    const el = scrollRef.current;
    if (el) anchor.current = { ratio: (el.scrollTop + el.clientHeight / 2) / el.scrollHeight, left: el.scrollLeft };
    setFit(false);
    setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, next)));
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || !anchor.current) return;
    el.scrollTop = anchor.current.ratio * el.scrollHeight - el.clientHeight / 2;
    anchor.current = null;
  }, [scale]);

  // Ctrl/⌘ + wheel zoom.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoomTo(scale * Math.exp(-e.deltaY * 0.0025));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [scale, zoomTo]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const mid = el.scrollTop + el.clientHeight / 3;
    const pages = el.querySelectorAll<HTMLElement>('.mg-page');
    let idx = 0;
    pages.forEach((p, i) => {
      if (p.offsetTop <= mid) idx = i;
    });
    setCurrent(idx);
  }, []);

  const goToPage = useCallback((i: number, offset = 0, smooth = true) => {
    const el = scrollRef.current;
    const page = el?.querySelector<HTMLElement>(`.mg-page[data-page="${i}"]`);
    if (!el || !page) return;
    el.scrollTo({ top: page.offsetTop - 16 + offset, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  const setTool = useCallback(
    (t: Tool) => {
      setEditingId(null);
      if (t === 'signature' && !signature) setSigOpen(true);
      setToolState(t);
      if (t !== 'select') setSelectedId(null);
    },
    [signature],
  );

  const onCreated = useCallback(
    (a: Annotation) => {
      dispatch({ type: 'add', annotation: a });
      if (!['ink', 'highlight', 'underline', 'strikeout'].includes(a.type) || ('signature' in a && a.signature)) {
        setToolState('select');
        setSelectedId(a.id);
      }
      if (a.type === 'note') {
        setShowComments(true);
        setFocusCommentId(a.id);
      }
    },
    [],
  );

  const onSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    setFocusCommentId(null);
  }, []);

  const selectFromPanel = useCallback(
    (id: string) => {
      const a = ann.annotations.find((x) => x.id === id);
      if (!a) return;
      setToolState('select');
      setSelectedId(id);
      goToPage(a.page, Math.max(0, bbox(a).y * scale - 120));
    },
    [ann.annotations, goToPage, scale],
  );

  const openComment = useCallback((id: string) => {
    setShowComments(true);
    setFocusCommentId(id);
  }, []);

  // Search
  useEffect(() => {
    if (!doc || !indexRef.current) return;
    const q = query;
    const t = setTimeout(async () => {
      const res = await indexRef.current!.search(q, doc.pages.length);
      setHits(res);
      setHitIndex(0);
      if (res.length) goToPage(res[0].page, Math.max(0, res[0].rects[0]?.y * scale - 160 || 0));
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, doc]);

  const stepHit = (d: number) => {
    if (!hits.length) return;
    const i = (hitIndex + d + hits.length) % hits.length;
    setHitIndex(i);
    goToPage(hits[i].page, Math.max(0, (hits[i].rects[0]?.y ?? 0) * scale - 160));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable]')) return;
      const mod = e.metaKey || e.ctrlKey;
      if (compact && !scrollRef.current?.closest('.mg-viewer')?.matches(':hover, :focus-within')) return;
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? 'redo' : 'undo' });
      } else if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        dispatch({ type: 'redo' });
      } else if (mod && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.select(), 0);
      } else if (mod && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomTo(scale * 1.2);
      } else if (mod && e.key === '-') {
        e.preventDefault();
        zoomTo(scale / 1.2);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        dispatch({ type: 'remove', id: selectedId });
        setSelectedId(null);
      } else if (e.key === 'Escape') {
        setSelectedId(null);
        setToolState('select');
        setExportOpen(false);
      } else if (e.key === 'Enter' && selectedId) {
        const a = ann.annotations.find((x) => x.id === selectedId);
        if (a?.type === 'text') setEditingId(a.id);
        else if (a) openComment(a.id);
      } else if (!mod && !e.altKey && KEYMAP[e.key.toLowerCase()]) {
        setTool(KEYMAP[e.key.toLowerCase()]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [compact, scale, selectedId, setTool, zoomTo, ann.annotations, openComment]);

  const byPage = useMemo(() => {
    const m: Annotation[][] = doc ? doc.pages.map(() => []) : [];
    for (const a of ann.annotations) m[a.page]?.push(a);
    return m;
  }, [ann.annotations, doc]);
  const counts = useMemo(() => byPage.map((l) => l.length), [byPage]);
  const hitsByPage = useMemo(() => {
    const m = new Map<number, SearchHit['rects']>();
    hits.forEach((h, i) => {
      if (i === hitIndex) return;
      m.set(h.page, [...(m.get(h.page) ?? []), ...h.rects]);
    });
    return m;
  }, [hits, hitIndex]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      toast('Please choose a PDF file');
      return;
    }
    await open(await file.arrayBuffer(), file.name);
  };

  const doExport = async (mode: 'annotations' | 'flatten' | 'json') => {
    setExportOpen(false);
    if (!doc) return;
    const base = doc.name.replace(/\.pdf$/i, '');
    if (mode === 'json') {
      download(JSON.stringify({ format: 'margin-annotations', version: 1, document: doc.name, annotations: ann.annotations }, null, 2), `${base}.annotations.json`, 'application/json');
      return;
    }
    setBusy(true);
    try {
      const out = await exportPdf(doc.bytes, doc.pdf, ann.annotations, mode);
      download(out, `${base}${mode === 'flatten' ? '.flattened' : '.annotated'}.pdf`, 'application/pdf');
      toast(mode === 'flatten' ? 'Flattened PDF downloaded' : 'PDF downloaded — annotations stay editable in Acrobat');
    } catch (e) {
      console.error(e);
      toast('Export failed for this file');
    } finally {
      setBusy(false);
    }
  };

  const importJson = async (file: File | undefined) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const list = (Array.isArray(data) ? data : data.annotations) as Annotation[];
      if (!Array.isArray(list)) throw new Error();
      const valid = list.filter((a) => a && a.id && typeof a.page === 'number' && doc && a.page < doc.pages.length);
      dispatch({ type: 'set', annotations: [...ann.annotations.filter((a) => !valid.some((v) => v.id === a.id)), ...valid], history: true });
      toast(`Imported ${valid.length} annotation${valid.length === 1 ? '' : 's'}`);
    } catch {
      toast('That file is not a Margin annotations export');
    }
  };

  const resetDoc = () => {
    if (!doc) return;
    dispatch({ type: 'set', annotations: doc.imported, history: true });
    setSelectedId(null);
    toast('Annotations reset — undo to bring them back');
  };

  const style = styles[tool];
  const setStyle = (patch: Partial<ToolStyle>) => {
    setStyles((s) => ({ ...s, [tool]: { ...s[tool], ...patch } }));
    const sel = ann.annotations.find((a) => a.id === selectedId);
    if (sel && patch.color) dispatch({ type: 'update', id: sel.id, patch: { color: patch.color } });
  };
  const showStroke = ['ink', 'rect', 'ellipse', 'arrow'].includes(tool);
  const showFont = tool === 'text';
  const showColors = tool !== 'select';
  const percent = Math.round((scale / CSS_UNITS) * 100);

  return (
    <div
      className={`mg-viewer ${compact ? 'is-compact' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onFile(e.dataTransfer.files[0]);
      }}
    >
      <header className="mg-toolbar">
        <div className="mg-toolbar-left">
          {!compact && (
            <button className={`mg-icon-btn mg-thumbs-toggle ${showThumbs ? 'is-on' : ''}`} title="Pages" onClick={() => setShowThumbs((v) => !v)}>
              <PanelLeft size={18} />
            </button>
          )}
          <button className="mg-file" title="Open a PDF" onClick={() => fileRef.current?.click()}>
            <FolderOpen size={16} />
            <span className="mg-file-name">{doc?.name ?? 'Open PDF'}</span>
          </button>
          <input ref={fileRef} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        </div>

        <div className="mg-tools" role="toolbar" aria-label="Annotation tools">
          {TOOLS.map((group, gi) => (
            <div className="mg-tool-group" key={gi}>
              {group.map((t) => (
                <button
                  key={t.id}
                  className={`mg-tool ${tool === t.id ? 'is-active' : ''}`}
                  onClick={() => (t.id === 'signature' && tool === 'signature' ? setSigOpen(true) : setTool(t.id))}
                  aria-pressed={tool === t.id}
                  data-tip={`${t.label} (${t.key})`}
                >
                  <t.icon size={18} />
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="mg-toolbar-right">
          <button className="mg-icon-btn" title="Undo (⌘Z)" disabled={!ann.past.length} onClick={() => dispatch({ type: 'undo' })}>
            <Undo2 size={18} />
          </button>
          <button className="mg-icon-btn" title="Redo (⇧⌘Z)" disabled={!ann.future.length} onClick={() => dispatch({ type: 'redo' })}>
            <Redo2 size={18} />
          </button>
          <span className="mg-divider" />
          <button
            className={`mg-icon-btn ${searchOpen ? 'is-on' : ''}`}
            title="Search (⌘F)"
            onClick={() => {
              setSearchOpen((v) => !v);
              setTimeout(() => searchRef.current?.focus(), 0);
            }}
          >
            <Search size={18} />
          </button>
          <div className="mg-zoom">
            <button className="mg-icon-btn sm" title="Zoom out" onClick={() => zoomTo(scale / 1.2)}>
              <Minus size={15} />
            </button>
            <button className="mg-zoom-value" title="Fit width" onClick={() => setFit(true)}>
              {fit ? <Maximize2 size={13} /> : null}
              {percent}%
            </button>
            <button className="mg-icon-btn sm" title="Zoom in" onClick={() => zoomTo(scale * 1.2)}>
              <Plus size={15} />
            </button>
          </div>
          <div className="mg-menu-wrap">
            <button className="mg-btn primary sm" onClick={() => setExportOpen((v) => !v)} disabled={!doc || busy}>
              {busy ? <Loader2 size={15} className="spin" /> : <Download size={15} />}
              <span className="hide-sm">Export</span>
              <ChevronDown size={14} />
            </button>
            {exportOpen && (
              <>
                <div className="mg-menu-backdrop" onClick={() => setExportOpen(false)} />
                <div className="mg-menu">
                  <button onClick={() => doExport('annotations')}>
                    <Download size={16} />
                    <div>
                      <strong>PDF with annotations</strong>
                      <span>Editable in Acrobat, Preview, Chrome</span>
                    </div>
                  </button>
                  <button onClick={() => doExport('flatten')}>
                    <Download size={16} />
                    <div>
                      <strong>Flattened PDF</strong>
                      <span>Markup burned into the pages</span>
                    </div>
                  </button>
                  <button onClick={() => doExport('json')}>
                    <FileJson size={16} />
                    <div>
                      <strong>Annotations as JSON</strong>
                      <span>Store in your own database</span>
                    </div>
                  </button>
                  <hr />
                  <button
                    onClick={() => {
                      setExportOpen(false);
                      jsonRef.current?.click();
                    }}
                  >
                    <FileUp size={16} />
                    <div>
                      <strong>Import JSON…</strong>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setExportOpen(false);
                      resetDoc();
                    }}
                  >
                    <RotateCcw size={16} />
                    <div>
                      <strong>Clear my annotations</strong>
                    </div>
                  </button>
                </div>
              </>
            )}
            <input ref={jsonRef} type="file" accept="application/json,.json" hidden onChange={(e) => importJson(e.target.files?.[0])} />
          </div>
          <button className={`mg-icon-btn ${showComments ? 'is-on' : ''}`} title="Comments" onClick={() => setShowComments((v) => !v)}>
            <MessageSquare size={18} />
            {ann.annotations.length > 0 && <span className="mg-dot">{ann.annotations.length}</span>}
          </button>
        </div>
      </header>

      {(showColors || searchOpen) && (
        <div className="mg-subbar">
          {showColors && (
            <div className="mg-props">
              {TOOL_PALETTE.map((c) => (
                <button key={c} className={`mg-swatch ${style.color === c ? 'is-active' : ''}`} style={{ background: c }} onClick={() => setStyle({ color: c })} aria-label={`Color ${c}`} />
              ))}
              {showStroke && (
                <>
                  <span className="mg-divider" />
                  {STROKES.map((w) => (
                    <button key={w} className={`mg-stroke ${style.strokeWidth === w ? 'is-active' : ''}`} onClick={() => setStyle({ strokeWidth: w })} aria-label={`Stroke ${w}`}>
                      <span style={{ width: 4 + w * 2, height: 4 + w * 2, background: style.color }} />
                    </button>
                  ))}
                </>
              )}
              {showFont && (
                <>
                  <span className="mg-divider" />
                  {FONT_SIZES.map((s) => (
                    <button key={s} className={`mg-chip ${style.fontSize === s ? 'is-active' : ''}`} onClick={() => setStyle({ fontSize: s })}>
                      {s}
                    </button>
                  ))}
                </>
              )}
              <span className="mg-hint">{HINTS[tool]}</span>
            </div>
          )}
          {searchOpen && (
            <div className="mg-search">
              <Search size={15} className="mg-muted" />
              <input
                ref={searchRef}
                autoFocus
                className="mg-input bare"
                placeholder="Search document"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') stepHit(e.shiftKey ? -1 : 1);
                  if (e.key === 'Escape') {
                    setSearchOpen(false);
                    setQuery('');
                  }
                }}
              />
              <span className="mg-search-count">{query ? (hits.length ? `${hitIndex + 1} / ${hits.length}` : 'No results') : ''}</span>
              <button className="mg-icon-btn sm" onClick={() => stepHit(-1)} disabled={!hits.length} title="Previous">
                <ChevronUp size={15} />
              </button>
              <button className="mg-icon-btn sm" onClick={() => stepHit(1)} disabled={!hits.length} title="Next">
                <ChevronDown size={15} />
              </button>
              <button
                className="mg-icon-btn sm"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery('');
                }}
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mg-body">
        {showThumbs && doc && !compact && (
          <aside className="mg-sidebar left">
            <Thumbnails pdf={doc.pdf} pages={doc.pages} current={current} counts={counts} onGo={goToPage} />
          </aside>
        )}

        <div ref={scrollRef} className={`mg-scroll tool-${tool}`} onScroll={onScroll}>
          {loading && !doc && (
            <div className="mg-state">
              <Loader2 className="spin" size={28} />
              <p>Opening document…</p>
            </div>
          )}
          {error && (
            <div className="mg-state">
              <p>{error}</p>
              <button className="mg-btn" onClick={() => fileRef.current?.click()}>
                Choose another file
              </button>
            </div>
          )}
          {doc && (
            <div className="mg-pages">
              {doc.pages.map((size, i) => (
                <PageView
                  key={`${doc.fingerprint}-${i}`}
                  pdf={doc.pdf}
                  index={i}
                  size={size}
                  scale={scale}
                  root={scrollRef}
                  annotations={byPage[i]}
                  tool={tool}
                  style={style}
                  author={author}
                  selectedId={selectedId}
                  editingId={editingId}
                  signature={signature}
                  searchRects={hitsByPage.get(i) ?? EMPTY}
                  activeSearchRects={hits[hitIndex]?.page === i ? hits[hitIndex].rects : EMPTY}
                  dispatch={dispatch}
                  onSelect={onSelect}
                  onCreated={onCreated}
                  onEditText={setEditingId}
                  onOpenComment={openComment}
                />
              ))}
            </div>
          )}
          {doc && (
            <div className="mg-pager">
              {current + 1} / {doc.pages.length}
            </div>
          )}
        </div>

        {showComments && (
          <aside className="mg-sidebar right">
            <CommentsPanel
              annotations={ann.annotations}
              selectedId={selectedId}
              focusId={focusCommentId}
              author={author}
              onAuthor={setAuthor}
              dispatch={dispatch}
              onSelect={selectFromPanel}
              onClose={() => setShowComments(false)}
            />
          </aside>
        )}
      </div>

      {dragOver && (
        <div className="mg-drop">
          <Upload size={32} />
          <p>Drop a PDF to open it</p>
        </div>
      )}
      {sigOpen && (
        <SignaturePad
          onCancel={() => {
            setSigOpen(false);
            if (!signature) setToolState('select');
          }}
          onUse={(paths) => {
            setSignature(paths);
            setSigOpen(false);
            setToolState('signature');
          }}
        />
      )}
      <div className="mg-toasts">
        {toasts.map((t) => (
          <div key={t.id} className="mg-toast">
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

const EMPTY: never[] = [];

const HINTS: Record<Tool, string> = {
  select: '',
  highlight: 'Select text to highlight it',
  underline: 'Select text to underline it',
  strikeout: 'Select text to strike it through',
  ink: 'Draw freely on the page',
  rect: 'Drag to draw a rectangle',
  ellipse: 'Drag to draw an ellipse',
  arrow: 'Drag to draw an arrow',
  text: 'Click to add a text box',
  note: 'Click to pin a note',
  signature: 'Click to place your signature',
};
