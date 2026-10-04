import { useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { arrowHead, bbox, normRect, resizeTo, simplify, smoothPath, translate, uid } from './geometry';
import type { Annotation, PageSize, Point, Rect, Tool } from './types';
import type { AnnAction } from './store';

export type ToolStyle = { color: string; strokeWidth: number; opacity: number; fontSize: number };

type Props = {
  pageIndex: number;
  size: PageSize;
  scale: number;
  annotations: Annotation[];
  tool: Tool;
  style: ToolStyle;
  author: string;
  selectedId: string | null;
  editingId: string | null;
  signature: Point[][] | null;
  dispatch: (a: AnnAction) => void;
  onSelect: (id: string | null) => void;
  onCreated: (a: Annotation) => void;
  onEditText: (id: string | null) => void;
};

type Drag =
  | { kind: 'draw'; start: Point; points: Point[] }
  | { kind: 'move'; start: Point; original: Annotation; moved: boolean }
  | { kind: 'resize'; start: Point; original: Annotation; box: Rect; handle: string; moved: boolean };

const DRAW_TOOLS: Tool[] = ['ink', 'rect', 'ellipse', 'arrow'];
const PLACE_TOOLS: Tool[] = ['text', 'note', 'signature'];

export function AnnotationShape({ a, ghost }: { a: Annotation; ghost?: boolean }) {
  const common = { opacity: ghost ? Math.min(a.opacity, 0.6) : a.opacity };
  switch (a.type) {
    case 'highlight':
      return (
        <g {...common} style={{ mixBlendMode: 'multiply' }}>
          {a.rects.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx={1.5} fill={a.color} />
          ))}
        </g>
      );
    case 'underline':
    case 'strikeout':
      return (
        <g {...common} stroke={a.color} strokeLinecap="round">
          {a.rects.map((r, i) => {
            const y = a.type === 'underline' ? r.y + r.h * 0.92 : r.y + r.h * 0.55;
            return <line key={i} x1={r.x} x2={r.x + r.w} y1={y} y2={y} strokeWidth={Math.max(1, r.h * 0.08)} />;
          })}
        </g>
      );
    case 'ink':
      return (
        <g {...common} fill="none" stroke={a.color} strokeWidth={a.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          {a.paths.map((p, i) => (
            <path key={i} d={p.length === 1 ? `M${p[0].x},${p[0].y} l0.1,0` : smoothPath(p)} />
          ))}
        </g>
      );
    case 'rect':
      return <rect {...common} x={a.rect.x} y={a.rect.y} width={a.rect.w} height={a.rect.h} rx={2} fill="none" stroke={a.color} strokeWidth={a.strokeWidth} />;
    case 'ellipse':
      return (
        <ellipse
          {...common}
          cx={a.rect.x + a.rect.w / 2}
          cy={a.rect.y + a.rect.h / 2}
          rx={a.rect.w / 2}
          ry={a.rect.h / 2}
          fill="none"
          stroke={a.color}
          strokeWidth={a.strokeWidth}
        />
      );
    case 'arrow': {
      const head = arrowHead(a.start, a.end, 6 + a.strokeWidth * 2.5);
      return (
        <g {...common} fill="none" stroke={a.color} strokeWidth={a.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <line x1={a.start.x} y1={a.start.y} x2={a.end.x} y2={a.end.y} />
          <polyline points={head.map((p) => `${p.x},${p.y}`).join(' ')} />
        </g>
      );
    }
    case 'text':
      return (
        <foreignObject x={a.rect.x} y={a.rect.y} width={a.rect.w} height={a.rect.h} {...common}>
          <div className="mg-textbox" style={{ color: a.color, fontSize: a.fontSize }}>
            {a.text || <span className="mg-textbox-placeholder">Type something…</span>}
          </div>
        </foreignObject>
      );
    case 'note':
      return (
        <g transform={`translate(${a.at.x} ${a.at.y})`} {...common}>
          <path d="M3 0h16a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-9l-5 4v-4H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3z" fill={a.color} stroke="rgba(0,0,0,.35)" strokeWidth={0.8} />
          <path d="M5 6h12M5 10h9" stroke="rgba(0,0,0,.55)" strokeWidth={1.4} strokeLinecap="round" />
        </g>
      );
  }
}

const HANDLES = ['nw', 'ne', 'sw', 'se'] as const;

export function AnnotationLayer(props: Props) {
  const { size, scale, annotations, tool, style, selectedId, editingId, dispatch } = props;
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag | null>(null);
  const [draft, setDraft] = useState<Annotation | null>(null);
  const [hover, setHover] = useState<Point | null>(null);

  const toPage = (e: { clientX: number; clientY: number }): Point => {
    const r = svgRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(size.width, (e.clientX - r.left) / scale)),
      y: Math.max(0, Math.min(size.height, (e.clientY - r.top) / scale)),
    };
  };

  const base = () => ({
    id: uid(),
    page: props.pageIndex,
    color: style.color,
    opacity: style.opacity,
    author: props.author,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    comment: '',
    replies: [],
  });

  function makeDraft(d: Extract<Drag, { kind: 'draw' }>, end: Point): Annotation | null {
    const b = base();
    switch (tool) {
      case 'ink':
        return { ...b, type: 'ink', paths: [d.points], strokeWidth: style.strokeWidth };
      case 'rect':
      case 'ellipse':
        return { ...b, type: tool, rect: normRect(d.start, end), strokeWidth: style.strokeWidth };
      case 'arrow':
        return { ...b, type: 'arrow', start: d.start, end, strokeWidth: style.strokeWidth };
    }
    return null;
  }

  function onBackgroundDown(e: RPointerEvent<SVGSVGElement>) {
    if (e.button !== 0) return;
    // Keeps focus where we put it (new text box, note comment) and stops text selection while drawing.
    if (tool !== 'select') e.preventDefault();
    const p = toPage(e);
    if (DRAW_TOOLS.includes(tool)) {
      svgRef.current!.setPointerCapture(e.pointerId);
      drag.current = { kind: 'draw', start: p, points: [p] };
      props.onSelect(null);
      return;
    }
    if (tool === 'text') {
      const a: Annotation = { ...base(), type: 'text', rect: { x: p.x, y: p.y - 4, w: 200, h: 44 }, text: '', fontSize: style.fontSize, opacity: 1 };
      props.onCreated(a);
      props.onEditText(a.id);
      return;
    }
    if (tool === 'note') {
      props.onCreated({ ...base(), type: 'note', at: { x: p.x - 11, y: p.y - 11 }, opacity: 1 });
      return;
    }
    if (tool === 'signature' && props.signature) {
      const sig = placeSignature(props.signature, p);
      props.onCreated({ ...base(), type: 'ink', paths: sig, strokeWidth: 2, signature: true, color: style.color === '#FFD43B' ? '#1C3FAA' : style.color, opacity: 1 });
      return;
    }
    if (tool === 'select') props.onSelect(null);
  }

  function onShapeDown(e: RPointerEvent, a: Annotation) {
    if (tool !== 'select' || e.button !== 0) return;
    e.stopPropagation();
    props.onSelect(a.id);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { kind: 'move', start: toPage(e), original: a, moved: false };
  }

  function onHandleDown(e: RPointerEvent, a: Annotation, handle: string) {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { kind: 'resize', start: toPage(e), original: a, box: bbox(a), handle, moved: false };
  }

  function onMove(e: RPointerEvent<SVGSVGElement>) {
    const p = toPage(e);
    if (PLACE_TOOLS.includes(tool)) setHover(p);
    const d = drag.current;
    if (!d) return;
    if (d.kind === 'draw') {
      if (tool === 'ink') d.points.push(p);
      setDraft(makeDraft(d, p));
      return;
    }
    const dx = p.x - d.start.x;
    const dy = p.y - d.start.y;
    if (!d.moved && Math.hypot(dx, dy) < 1.5) return;
    if (!d.moved) {
      dispatch({ type: 'checkpoint' });
      d.moved = true;
    }
    if (d.kind === 'move') {
      dispatch({ type: 'replace', annotation: translate(d.original, dx, dy), history: false });
    } else {
      const b = d.box;
      let x1 = b.x, y1 = b.y, x2 = b.x + b.w, y2 = b.y + b.h;
      if (d.handle.includes('w')) x1 += dx;
      if (d.handle.includes('e')) x2 += dx;
      if (d.handle.includes('n')) y1 += dy;
      if (d.handle.includes('s')) y2 += dy;
      if (e.shiftKey && b.w && b.h) {
        // Keep aspect ratio.
        const k = Math.max((x2 - x1) / b.w, (y2 - y1) / b.h);
        if (d.handle.includes('w')) x1 = x2 - b.w * k; else x2 = x1 + b.w * k;
        if (d.handle.includes('n')) y1 = y2 - b.h * k; else y2 = y1 + b.h * k;
      }
      const to = normRect({ x: x1, y: y1 }, { x: x2, y: y2 });
      if (to.w < 4 || to.h < 4) return;
      dispatch({ type: 'replace', annotation: resizeTo(d.original, b, to), history: false });
    }
  }

  function onUp(e: RPointerEvent<SVGSVGElement>) {
    const d = drag.current;
    drag.current = null;
    if (!d || d.kind !== 'draw') return;
    const end = toPage(e);
    const a = makeDraft(d, end);
    setDraft(null);
    if (!a) return;
    if (a.type === 'ink') {
      a.paths = [simplify(d.points)];
      props.onCreated(a);
      return;
    }
    const r = bbox(a);
    if (r.w < 4 && r.h < 4) {
      // A click without a drag: drop a default-sized shape.
      if (a.type === 'arrow') a.end = { x: a.start.x + 80, y: a.start.y };
      else if (a.type === 'rect' || a.type === 'ellipse') a.rect = { x: d.start.x - 40, y: d.start.y - 25, w: 80, h: 50 };
    }
    props.onCreated(a);
  }

  const capture = tool !== 'select' && !['highlight', 'underline', 'strikeout'].includes(tool);
  const selected = annotations.find((a) => a.id === selectedId);
  const resizable = selected && !['highlight', 'underline', 'strikeout', 'note'].includes(selected.type);
  const sel = selected ? bbox(selected) : null;
  const hs = 5 / scale;

  return (
    <svg
      ref={svgRef}
      className={`mg-annot-layer tool-${tool}`}
      viewBox={`0 0 ${size.width} ${size.height}`}
      style={{ pointerEvents: capture ? 'auto' : 'none' }}
      onPointerDown={onBackgroundDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={() => setHover(null)}
    >
      {annotations.map((a) => (
        <g
          key={a.id}
          className={`mg-annot ${a.id === selectedId ? 'is-selected' : ''} ${a.resolved ? 'is-resolved' : ''}`}
          style={{ pointerEvents: tool === 'select' ? 'auto' : 'none', display: a.id === editingId ? 'none' : undefined }}
          onPointerDown={(e) => onShapeDown(e, a)}
          onDoubleClick={() => a.type === 'text' && tool === 'select' && props.onEditText(a.id)}
          data-annot-id={a.id}
        >
          <HitArea a={a} />
          <AnnotationShape a={a} />
        </g>
      ))}
      {draft && <AnnotationShape a={draft} ghost />}
      {tool === 'signature' && props.signature && hover && (
        <g opacity={0.45} fill="none" stroke={style.color === '#FFD43B' ? '#1C3FAA' : style.color} strokeWidth={2} strokeLinecap="round">
          {placeSignature(props.signature, hover).map((p, i) => (
            <path key={i} d={smoothPath(p)} />
          ))}
        </g>
      )}
      {sel && (
        <g className="mg-selection" style={{ pointerEvents: 'none' }}>
          <rect x={sel.x - 3} y={sel.y - 3} width={sel.w + 6} height={sel.h + 6} rx={3} fill="none" strokeWidth={1.2 / scale} strokeDasharray={`${4 / scale} ${3 / scale}`} />
          {resizable &&
            tool === 'select' &&
            HANDLES.map((h) => {
              const x = h.includes('w') ? sel.x - 3 : sel.x + sel.w + 3;
              const y = h.includes('n') ? sel.y - 3 : sel.y + sel.h + 3;
              return (
                <rect
                  key={h}
                  className={`mg-handle h-${h}`}
                  x={x - hs}
                  y={y - hs}
                  width={hs * 2}
                  height={hs * 2}
                  rx={hs * 0.4}
                  strokeWidth={1.2 / scale}
                  style={{ pointerEvents: 'auto' }}
                  onPointerDown={(e) => onHandleDown(e, selected!, h)}
                />
              );
            })}
        </g>
      )}
    </svg>
  );
}

/** Invisible, generous click target so thin strokes are easy to grab. */
function HitArea({ a }: { a: Annotation }) {
  if (a.type === 'ink') {
    return (
      <g fill="none" stroke="transparent" strokeWidth={Math.max(10, a.strokeWidth + 8)}>
        {a.paths.map((p, i) => (
          <path key={i} d={smoothPath(p)} />
        ))}
      </g>
    );
  }
  if (a.type === 'arrow') return <line x1={a.start.x} y1={a.start.y} x2={a.end.x} y2={a.end.y} stroke="transparent" strokeWidth={12} />;
  if (a.type === 'rect' || a.type === 'ellipse') {
    const r = a.rect;
    return <rect x={r.x - 5} y={r.y - 5} width={r.w + 10} height={r.h + 10} fill="none" stroke="transparent" strokeWidth={10} />;
  }
  const r = bbox(a);
  return <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="transparent" />;
}

/** Signature paths are stored normalised to a 0..1 box; place them centred on `at`. */
function placeSignature(sig: Point[][], at: Point): Point[][] {
  const w = 150;
  const all = sig.flat();
  const maxY = Math.max(...all.map((p) => p.y), 0.01);
  const h = w * maxY;
  return sig.map((path) => path.map((p) => ({ x: at.x - w / 2 + p.x * w, y: at.y - h / 2 + p.y * w })));
}
