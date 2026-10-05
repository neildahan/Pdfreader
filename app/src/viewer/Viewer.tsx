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
  Radio,
  Redo2,
  RotateCcw,
  Search,
  Share2,
  Signature,
  Sparkles,
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
import { bbox, mergeLineRects, uid } from './geometry';
import { decodeShare, demoLink, encodeShare, randomId, type SharePayload } from './share';
import { ShareDialog } from './ShareDialog';
import { AssistantPanel } from './ai/AssistantPanel';
import { loadAiSettings, type AiSettings } from './ai/ai';
import { COLLAB_SERVER, useCollab, type Cursor } from './collab/useCollab';
import { Avatar } from './CommentsPanel';
import { PageView } from './PageView';
import { Thumbnails } from './Thumbnails';
import { CommentsPanel } from './CommentsPanel';
import { SignaturePad } from './SignaturePad';
import { TextIndex, type SearchHit } from './search';
import { download, exportPdf } from './exportPdf';
import type { ToolStyle } from './AnnotationLayer';
import { isShared, PALETTE, type Annotation, type Point, type Rect, type Tool } from './types';
import type { ShareScope } from './ShareDialog';
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
  /** Token from a share link (#/demo/s/<token>): annotations to merge in once the matching PDF is open. */
  share?: string;
  /** Live session to join (#/demo/live/<room>). */
  room?: string;
  /** Collaboration server for that session, when the link names one. */
  collabServer?: string;
};

type Toast = { id: number; text: string };

function readAuthor(fallback: string) {
  try {
    return localStorage.getItem('margin:author') || fallback;
  } catch {
    return fallback;
  }
}

function readCollabServer() {
  try {
    return localStorage.getItem('margin:collab-server') ?? COLLAB_SERVER;
  } catch {
    return COLLAB_SERVER;
  }
}

export function Viewer({ src, compact = false, author: authorProp = 'You', share, room: roomProp, collabServer: serverProp }: ViewerProps) {
  const [doc, setDoc] = useState<LoadedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ann, dispatch] = useReducer(annReducer, { annotations: [], past: [], future: [], source: 'load' });
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
  /** Open export menu position (fixed, so a sideways-scrolling toolbar can't clip it). */
  const [exportMenu, setExportMenu] = useState<{ top: number; right: number } | null>(null);
  const exportOpen = exportMenu !== null;
  const setExportOpen = (open: boolean) => {
    if (!open) setExportMenu(null);
  };
  /** A text selection waiting for touch users to confirm (markup tools). */
  const [touchSelection, setTouchSelection] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [busy, setBusy] = useState(false);
  const [rightTab, setRightTab] = useState<'comments' | 'assistant'>('comments');
  const [aiSettings, setAiSettings] = useState<AiSettings>(loadAiSettings);
  const [aiSeed, setAiSeed] = useState<{ text: string; n: number } | null>(null);
  const [flash, setFlash] = useState<{ page: number; rects: Rect[] } | null>(null);
  const [shareOpen, setShareOpen] = useState<'link' | 'live' | null>(null);
  const [shareScope, setShareScope] = useState<ShareScope>('shared');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [pendingShare, setPendingShare] = useState<SharePayload | null>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(roomProp ?? null);
  const [collabServer, setCollabServerState] = useState(() => serverProp ?? readCollabServer());

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

  // Only the most recent open() may install its document (a slow initial load must not
  // replace a file opened or received meanwhile).
  const openSeq = useRef(0);
  const open = useCallback(
    async (data: ArrayBuffer | Uint8Array, name: string, url: string | null = null) => {
      const seq = ++openSeq.current;
      setLoading(true);
      setError(null);
      try {
        const loaded = await loadDocument(data, name);
        if (seq !== openSeq.current) {
          loaded.pdf.loadingTask.destroy();
          return;
        }
        setDocUrl(url);
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
        if (seq === openSeq.current) setError(e instanceof Error && e.name === 'PasswordException' ? 'This PDF is password protected.' : 'Could not open this file. Is it a valid PDF?');
      } finally {
        if (seq === openSeq.current) setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let url = src;
      if (share) {
        try {
          const payload = await decodeShare(share);
          setPendingShare(payload);
          // Only follow relative document URLs, so a link can't point the viewer at another site.
          if (payload.doc.url && !/^[a-z]+:|^\/\//i.test(payload.doc.url)) url = payload.doc.url;
        } catch {
          toast('This share link is incomplete or damaged');
        }
      }
      try {
        const ticket = openSeq.current;
        const buf = await (await fetch(url)).arrayBuffer();
        // Skip if another document was opened (or received) while this one downloaded.
        if (!cancelled && ticket === openSeq.current) open(buf, url.split('/').pop() || 'document.pdf', url);
      } catch {
        setError('Could not load the document.');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, open]);

  // Shared annotations land once the matching document is open.
  useEffect(() => {
    if (!doc || !pendingShare || doc.fingerprint !== pendingShare.doc.fingerprint) return;
    const valid = pendingShare.annotations.filter((a) => a && a.id && a.page < doc.pages.length);
    dispatch({ type: 'merge', annotations: valid });
    setShowComments(true);
    setRightTab('comments');
    toast(`Added ${valid.length} annotation${valid.length === 1 ? '' : 's'} shared by ${pendingShare.from}`);
    setPendingShare(null);
  }, [doc, pendingShare, toast]);

  const collab = useCollab({
    room,
    server: collabServer,
    name: author,
    doc: doc ? { fingerprint: doc.fingerprint, name: doc.name, bytes: doc.bytes } : null,
    ann,
    dispatch,
    onDoc: useCallback((bytes: Uint8Array, name: string) => {
      open(bytes, name);
    }, [open]),
  });

  const setCollabServer = (url: string) => {
    setCollabServerState(url);
    try {
      localStorage.setItem('margin:collab-server', url);
    } catch {
      /* ignore */
    }
  };

  const liveSuffix = (id: string) => (collabServer && collabServer !== COLLAB_SERVER ? `${id}~${btoa(collabServer).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}` : id);
  const liveLink = room ? demoLink(`live/${liveSuffix(room)}`) : null;
  const startLive = () => {
    const id = randomId();
    setRoom(id);
    if (!compact) history.replaceState(null, '', `#/demo/live/${liveSuffix(id)}`);
  };
  const stopLive = () => {
    setRoom(null);
    if (!compact) history.replaceState(null, '', '#/demo');
  };

  const scopeList = useCallback(
    (scope: ShareScope) => (scope === 'selected' ? ann.annotations.filter((a) => checked.has(a.id)) : scope === 'shared' ? ann.annotations.filter(isShared) : ann.annotations),
    [ann.annotations, checked],
  );
  const createShareLink = useCallback(
    async (scope: ShareScope) => {
      if (!doc) throw new Error('No document');
      const list = scopeList(scope);
      // Sending specific annotations to someone makes them shared ones.
      if (scope === 'selected') {
        const ids = list.filter((a) => !isShared(a)).map((a) => a.id);
        if (ids.length) dispatch({ type: 'visibility', ids, visibility: 'shared' });
      }
      const token = await encodeShare({
        v: 1,
        doc: { name: doc.name, fingerprint: doc.fingerprint, ...(docUrl ? { url: docUrl } : {}) },
        from: author,
        annotations: list.map((a) => ({ ...a, visibility: 'shared' }) as Annotation),
      });
      return demoLink(`s/${token}`);
    },
    [doc, docUrl, author, scopeList],
  );
  const openShare = (tab: 'link' | 'live', scope?: ShareScope) => {
    setShareScope(scope ?? (checked.size ? 'selected' : 'shared'));
    setShareOpen(tab);
  };

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
    setRightTab('comments');
    setFocusCommentId(id);
  }, []);

  // AI assistant hooks
  const getDocText = useCallback(async () => {
    if (!doc || !indexRef.current) throw new Error('Open a document first.');
    return { name: doc.name, pages: await indexRef.current.texts(doc.pages.length) };
  }, [doc]);
  const locate = useCallback(async (page: number, quote: string) => (indexRef.current ? indexRef.current.locate(page, quote) : []), []);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jumpTo = useCallback(
    (page: number, rects: Rect[]) => {
      goToPage(page, Math.max(0, (rects[0]?.y ?? 0) * scale - 140));
      if (flashTimer.current) clearTimeout(flashTimer.current);
      setFlash({ page, rects });
      flashTimer.current = setTimeout(() => setFlash(null), 2400);
    },
    [goToPage, scale],
  );
  const highlightFromAi = useCallback(
    (page: number, rects: Rect[], quote: string, note: string) => {
      const now = Date.now();
      dispatch({
        type: 'add',
        annotation: { id: uid(), page, type: 'highlight', rects: mergeLineRects(rects), text: quote, color: '#FFD43B', opacity: 0.45, author, createdAt: now, updatedAt: now, comment: note, replies: [] },
      });
      jumpTo(page, rects);
    },
    [author, jumpTo],
  );
  const askAiAbout = useCallback((a: Annotation) => {
    const text = 'text' in a && a.text ? a.text : '';
    setShowComments(true);
    setRightTab('assistant');
    setAiSeed({ text: text ? `Explain this passage and anything I should watch out for: "${text.slice(0, 600)}"` : 'What is on this part of the page?', n: Date.now() });
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
  const cursorsByPage = useMemo(() => {
    const m = new Map<number, Cursor[]>();
    for (const c of collab.cursors.values()) m.set(c.page, [...(m.get(c.page) ?? []), c]);
    return m;
  }, [collab.cursors]);
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

  // Touch: show a confirm button while a text selection exists and a markup tool is active.
  const markupTool = tool === 'highlight' || tool === 'underline' || tool === 'strikeout';
  useEffect(() => {
    if (!markupTool) {
      setTouchSelection(false);
      return;
    }
    let touch = false;
    const onDown = (e: PointerEvent) => {
      touch = e.pointerType === 'touch';
    };
    const onChange = () => {
      const sel = window.getSelection();
      const node = sel && !sel.isCollapsed ? sel.anchorNode : null;
      const inPage = !!node && !!(node.nodeType === 1 ? (node as Element) : node.parentElement)?.closest('.mg-page');
      setTouchSelection(touch && inPage && !!sel?.toString().trim());
    };
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('selectionchange', onChange);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('selectionchange', onChange);
    };
  }, [markupTool]);

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
            <button
              className="mg-btn primary sm"
              onClick={(e) => {
                if (exportMenu) return setExportMenu(null);
                const r = e.currentTarget.getBoundingClientRect();
                const width = Math.min(290, window.innerWidth - 16);
                setExportMenu({ top: r.bottom + 6, right: Math.max(8, Math.min(window.innerWidth - r.right, window.innerWidth - width - 8)) });
              }}
              disabled={!doc || busy}
            >
              {busy ? <Loader2 size={15} className="spin" /> : <Download size={15} />}
              <span className="hide-sm">Export</span>
              <ChevronDown size={14} />
            </button>
            {exportOpen && (
              <>
                <div className="mg-menu-backdrop" onClick={() => setExportOpen(false)} />
                <div className="mg-menu" style={{ position: 'fixed', top: exportMenu!.top, right: exportMenu!.right }}>
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
          {room && collab.peers.length > 0 && (
            <div className="mg-presence" title={collab.peers.map((p) => p.name).join(', ')}>
              {collab.peers.slice(0, 3).map((p) => (
                <span key={p.id} className="mg-presence-avatar" style={{ ['--peer' as string]: p.color }}>
                  <Avatar name={p.name} />
                </span>
              ))}
              {collab.peers.length > 3 && <span className="mg-presence-more">+{collab.peers.length - 3}</span>}
            </div>
          )}
          <button className={`mg-btn sm ${room ? 'is-live' : ''}`} onClick={() => openShare(room ? 'live' : 'link')} disabled={!doc} title="Share">
            {room ? <Radio size={15} /> : <Share2 size={15} />}
            <span className="hide-sm">{room ? 'Live' : 'Share'}</span>
          </button>
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
                  onAskAI={askAiAbout}
                  flashRects={flash?.page === i ? flash.rects : EMPTY}
                  cursors={cursorsByPage.get(i) ?? EMPTY}
                  onCursor={room ? collab.sendCursor : undefined}
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
            <div className="mg-tabs" role="tablist">
              <button role="tab" aria-selected={rightTab === 'comments'} className={rightTab === 'comments' ? 'is-active' : ''} onClick={() => setRightTab('comments')}>
                <MessageSquare size={15} /> Comments <span className="mg-count">{ann.annotations.length}</span>
              </button>
              <button role="tab" aria-selected={rightTab === 'assistant'} className={rightTab === 'assistant' ? 'is-active' : ''} onClick={() => setRightTab('assistant')}>
                <Sparkles size={15} /> Assistant
              </button>
              <button className="mg-icon-btn sm mg-close-panel mg-tabs-close" onClick={() => setShowComments(false)} aria-label="Close panel">
                <X size={16} />
              </button>
            </div>
            {rightTab === 'assistant' ? (
              <AssistantPanel settings={aiSettings} onSettings={setAiSettings} getDocText={getDocText} locate={locate} onJump={jumpTo} onHighlight={highlightFromAi} seed={aiSeed} />
            ) : (
            <CommentsPanel
              annotations={ann.annotations}
              selectedId={selectedId}
              focusId={focusCommentId}
              author={author}
              onAuthor={setAuthor}
              dispatch={dispatch}
              onSelect={selectFromPanel}
              checked={checked}
              onChecked={setChecked}
              selectMode={selectMode}
              onSelectMode={setSelectMode}
              onShareChecked={() => openShare('link', 'selected')}
              live={!!room}
            />
            )}
          </aside>
        )}
      </div>

      {pendingShare && doc && doc.fingerprint !== pendingShare.doc.fingerprint && (
        <div className="mg-banner">
          <Share2 size={16} />
          <span>
            {pendingShare.from} shared {pendingShare.annotations.length} annotation{pendingShare.annotations.length === 1 ? '' : 's'} on <strong>{pendingShare.doc.name}</strong>. Open your copy of that file to see them.
          </span>
          <button className="mg-btn primary sm" onClick={() => fileRef.current?.click()}>
            Open file
          </button>
          <button className="mg-icon-btn sm" onClick={() => setPendingShare(null)} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}
      {touchSelection && (
        <div className="mg-selection-bar" onPointerDown={(e) => e.preventDefault()}>
          <button
            className="mg-btn primary"
            onClick={() => {
              window.dispatchEvent(new Event('margin:apply-selection'));
              setTouchSelection(false);
            }}
          >
            {tool === 'highlight' ? <Highlighter size={16} /> : tool === 'underline' ? <Underline size={16} /> : <Strikethrough size={16} />}
            {tool === 'highlight' ? 'Highlight' : tool === 'underline' ? 'Underline' : 'Strike through'}
          </button>
          <button
            className="mg-btn"
            onClick={() => {
              window.getSelection()?.removeAllRanges();
              setTouchSelection(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {collab.receiving && <div className="mg-banner info">Receiving {collab.receiving.name} from the session… {collab.receiving.pct}%</div>}
      {shareOpen && doc && (
        <ShareDialog
          docName={doc.name}
          docIsPublic={!!docUrl}
          counts={{ selected: checked.size, shared: ann.annotations.filter(isShared).length, all: ann.annotations.length }}
          scope={shareScope}
          onScope={setShareScope}
          createLink={createShareLink}
          live={{ room, status: collab.status, peers: collab.peers, kind: collab.kind, link: liveLink, receiving: collab.receiving }}
          server={collabServer}
          onServer={setCollabServer}
          onStartLive={startLive}
          onStopLive={stopLive}
          initialTab={shareOpen}
          onClose={() => setShareOpen(null)}
        />
      )}
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
