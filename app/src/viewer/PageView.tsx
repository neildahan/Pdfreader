import { memo, useEffect, useRef, useState, type RefObject } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { TextLayer } from './pdfjs';
import { MessageSquare, Sparkles, Trash2 } from 'lucide-react';
import type { Cursor } from './collab/useCollab';
import { VisibilityPill } from './CommentsPanel';
import { AnnotationLayer, type ToolStyle } from './AnnotationLayer';
import { bbox, mergeLineRects, uid } from './geometry';
import type { AnnAction } from './store';
import { PALETTE, type Annotation, type PageSize, type Point, type Rect, type TextAnnotation, type Tool } from './types';

type Props = {
  pdf: PDFDocumentProxy;
  index: number;
  size: PageSize;
  scale: number;
  root: RefObject<HTMLDivElement | null>;
  annotations: Annotation[];
  tool: Tool;
  style: ToolStyle;
  author: string;
  selectedId: string | null;
  editingId: string | null;
  signature: Point[][] | null;
  searchRects: Rect[];
  activeSearchRects: Rect[];
  dispatch: (a: AnnAction) => void;
  onSelect: (id: string | null) => void;
  onCreated: (a: Annotation) => void;
  onEditText: (id: string | null) => void;
  onOpenComment: (id: string) => void;
  onAskAI: (a: Annotation) => void;
  /** Briefly highlighted passage (e.g. an AI citation the user jumped to). */
  flashRects: Rect[];
  /** Other participants' cursors on this page (live sessions). */
  cursors: Cursor[];
  onCursor?: (page: number, x: number, y: number) => void;
};

const MAX_CANVAS_PIXELS = 16_000_000;

function PageViewInner(props: Props) {
  const { pdf, index, size, scale, root, tool } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const textLayer = useRef<InstanceType<typeof TextLayer> | null>(null);
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      root: root.current,
      rootMargin: '800px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [root]);

  // Canvas: render (or re-render on zoom) whenever the page is near the viewport.
  useEffect(() => {
    if (!visible) return;
    let task: RenderTask | null = null;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const page = await pdf.getPage(index + 1);
      if (cancelled) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let outScale = scale * dpr;
      const px = size.width * size.height * outScale * outScale;
      if (px > MAX_CANVAS_PIXELS) outScale *= Math.sqrt(MAX_CANVAS_PIXELS / px);
      const viewport = page.getViewport({ scale: outScale });
      const off = document.createElement('canvas');
      off.width = Math.floor(viewport.width);
      off.height = Math.floor(viewport.height);
      task = page.render({ canvas: off, viewport });
      try {
        await task.promise;
      } catch {
        return;
      }
      if (cancelled || !canvasRef.current) return;
      // Swap in the finished bitmap so zooming never flashes blank.
      const c = canvasRef.current;
      c.width = off.width;
      c.height = off.height;
      c.getContext('2d')!.drawImage(off, 0, 0);
      setRendered(true);
    }, rendered ? 120 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      task?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, scale, pdf, index]);

  // Text layer: created once, then rescaled.
  useEffect(() => {
    if (!visible || !textRef.current) return;
    let cancelled = false;
    (async () => {
      const page = await pdf.getPage(index + 1);
      const viewport = page.getViewport({ scale });
      if (cancelled || !textRef.current) return;
      if (textLayer.current) {
        textLayer.current.update({ viewport });
        return;
      }
      textRef.current.replaceChildren();
      const layer = new TextLayer({ textContentSource: page.streamTextContent(), container: textRef.current, viewport });
      textLayer.current = layer;
      try {
        await layer.render();
      } catch {
        textLayer.current = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, scale, pdf, index]);

  // Text markup: turn a finished text selection on this page into an annotation.
  // Mouse and pen apply on release; touch users adjust the selection handles first
  // and confirm with the floating button, which fires 'margin:apply-selection'.
  useEffect(() => {
    if (!['highlight', 'underline', 'strikeout'].includes(tool)) return;
    const apply = () => {
      const sel = window.getSelection();
      const wrap = wrapRef.current;
      if (!sel || sel.isCollapsed || !wrap) return;
      const text = sel.toString().trim();
      if (!text) return;
      const range = sel.getRangeAt(0);
      if (!wrap.contains(range.commonAncestorContainer) && !range.intersectsNode(wrap)) return;
      const box = wrap.getBoundingClientRect();
      const rects: Rect[] = [];
      for (const r of Array.from(range.getClientRects())) {
        const x1 = Math.max(r.left, box.left), x2 = Math.min(r.right, box.right);
        const y1 = Math.max(r.top, box.top), y2 = Math.min(r.bottom, box.bottom);
        if (x2 - x1 < 1 || y2 - y1 < 1) continue;
        if (r.width > box.width * 0.95 && r.height > box.height * 0.5) continue; // whole-layer rects
        rects.push({ x: (x1 - box.left) / scale, y: (y1 - box.top) / scale, w: (x2 - x1) / scale, h: (y2 - y1) / scale });
      }
      // Some browsers (notably iOS Safari) report block-sized boxes for a selection;
      // keep only rectangles about as tall as a line of text.
      const heights = rects.map((r) => r.h).sort((a, b) => a - b);
      const median = heights[Math.floor(heights.length / 2)] ?? 0;
      const lines = rects.filter((r) => r.h <= Math.max(median * 2.2, 6) && r.h < 60);
      const merged = mergeLineRects(lines);
      if (!merged.length) return;
      props.onCreated({
        id: uid(),
        page: index,
        type: tool as 'highlight',
        rects: merged,
        text,
        color: props.style.color,
        opacity: tool === 'highlight' ? Math.min(props.style.opacity, 0.45) : props.style.opacity,
        author: props.author,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        comment: '',
        replies: [],
      });
      // Let other pages read a selection that spans them before clearing it.
      setTimeout(() => sel.removeAllRanges(), 0);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') apply();
    };
    document.addEventListener('pointerup', onUp);
    window.addEventListener('margin:apply-selection', apply);
    return () => {
      document.removeEventListener('pointerup', onUp);
      window.removeEventListener('margin:apply-selection', apply);
    };
  });

  const selected = props.annotations.find((a) => a.id === props.selectedId);
  const editing = props.annotations.find((a) => a.id === props.editingId) as TextAnnotation | undefined;

  return (
    <div
      ref={wrapRef}
      className={`mg-page ${tool}`}
      data-page={index}
      style={{ width: size.width * scale, height: size.height * scale, ['--total-scale-factor' as string]: scale }}
      onPointerDown={(e) => {
        if (tool === 'select' && !(e.target as Element).closest('.mg-annot, .mg-popover, .mg-text-editor')) props.onSelect(null);
      }}
      onPointerMove={
        props.onCursor
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              props.onCursor!(index, (e.clientX - r.left) / scale, (e.clientY - r.top) / scale);
            }
          : undefined
      }
      onPointerLeave={props.onCursor ? () => props.onCursor!(-1, 0, 0) : undefined}
    >
      <canvas ref={canvasRef} className="mg-canvas" />
      {!rendered && <div className="mg-page-skeleton" />}
      <div ref={textRef} className="textLayer" />
      <div className="mg-search-layer">
        {props.searchRects.map((r, i) => (
          <div key={i} className="mg-search-hit" style={{ left: r.x * scale, top: r.y * scale, width: r.w * scale, height: r.h * scale }} />
        ))}
        {props.activeSearchRects.map((r, i) => (
          <div key={`a${i}`} className="mg-search-hit is-active" style={{ left: r.x * scale, top: r.y * scale, width: r.w * scale, height: r.h * scale }} />
        ))}
      </div>
      {props.flashRects.length > 0 && (
        <div className="mg-flash-layer">
          {props.flashRects.map((r, i) => (
            <div key={i} className="mg-flash" style={{ left: r.x * scale - 2, top: r.y * scale - 2, width: r.w * scale + 4, height: r.h * scale + 4 }} />
          ))}
        </div>
      )}
      <AnnotationLayer {...props} pageIndex={index} />
      {props.cursors.map((c) => (
        <div key={c.peer.id} className="mg-cursor" style={{ left: c.x * scale, top: c.y * scale, ['--peer' as string]: c.peer.color }}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M1 1l5.5 13 1.8-5.2L13.5 7z" fill="var(--peer)" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          <span>{c.peer.name}</span>
        </div>
      ))}
      {selected && !editing && tool === 'select' && (
        <Popover a={selected} scale={scale} author={props.author} dispatch={props.dispatch} onComment={() => props.onOpenComment(selected.id)} onAskAI={() => props.onAskAI(selected)} onSelect={props.onSelect} />
      )}
      {editing && <TextEditor a={editing} scale={scale} dispatch={props.dispatch} onDone={() => props.onEditText(null)} />}
      <div className="mg-page-number">{index + 1}</div>
    </div>
  );
}

export const PageView = memo(PageViewInner);

function Popover({ a, scale, author, dispatch, onComment, onAskAI, onSelect }: { a: Annotation; scale: number; author: string; dispatch: Props['dispatch']; onComment: () => void; onAskAI: () => void; onSelect: Props['onSelect'] }) {
  const r = bbox(a);
  const top = r.y * scale - 48;
  return (
    <div className="mg-popover" style={{ left: Math.max(4, (r.x + r.w / 2) * scale), top: top < 4 ? (r.y + r.h) * scale + 10 : top }} onPointerDown={(e) => e.stopPropagation()}>
      {PALETTE.map((c) => (
        <button
          key={c}
          className={`mg-swatch ${a.color.toUpperCase() === c ? 'is-active' : ''}`}
          style={{ background: c }}
          title={c}
          onClick={() => dispatch({ type: 'update', id: a.id, patch: { color: c } })}
        />
      ))}
      <span className="mg-popover-sep" />
      <VisibilityPill a={a} author={author} dispatch={dispatch} />
      <button className="mg-icon-btn" title="Comment" onClick={onComment}>
        <MessageSquare size={16} />
      </button>
      {'text' in a && a.type !== 'text' && a.text && (
        <button className="mg-icon-btn ai" title="Ask AI about this" onClick={onAskAI}>
          <Sparkles size={16} />
        </button>
      )}
      <button
        className="mg-icon-btn danger"
        title="Delete (Del)"
        onClick={() => {
          dispatch({ type: 'remove', id: a.id });
          onSelect(null);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function TextEditor({ a, scale, dispatch, onDone }: { a: TextAnnotation; scale: number; dispatch: Props['dispatch']; onDone: () => void }) {
  const [value, setValue] = useState(a.text);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.select();
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, a.rect.h * scale)}px`;
  }, [value, a.rect.h, scale]);

  const commit = () => {
    const el = ref.current;
    if (!value.trim()) dispatch({ type: 'remove', id: a.id });
    else if (value !== a.text || el) {
      const h = el ? Math.max(a.rect.h, el.scrollHeight / scale) : a.rect.h;
      dispatch({ type: 'update', id: a.id, patch: { text: value, rect: { ...a.rect, h } } as Partial<Annotation> });
    }
    onDone();
  };

  return (
    <textarea
      ref={ref}
      className="mg-text-editor"
      value={value}
      placeholder="Type something…"
      style={{ left: a.rect.x * scale, top: a.rect.y * scale, width: a.rect.w * scale, fontSize: a.fontSize * scale, color: a.color }}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Escape' || (e.key === 'Enter' && (e.metaKey || e.ctrlKey))) ref.current?.blur();
      }}
    />
  );
}
