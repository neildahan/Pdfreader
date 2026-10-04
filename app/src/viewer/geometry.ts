import type { Annotation, Point, Rect } from './types';

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function normRect(a: Point, b: Point): Rect {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) };
}

export function unionRects(rects: Rect[]): Rect {
  const x1 = Math.min(...rects.map((r) => r.x));
  const y1 = Math.min(...rects.map((r) => r.y));
  const x2 = Math.max(...rects.map((r) => r.x + r.w));
  const y2 = Math.max(...rects.map((r) => r.y + r.h));
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

export function pointsBBox(pts: Point[]): Rect {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

export function bbox(a: Annotation): Rect {
  switch (a.type) {
    case 'highlight':
    case 'underline':
    case 'strikeout':
      return unionRects(a.rects);
    case 'ink': {
      const r = pointsBBox(a.paths.flat());
      const p = a.strokeWidth / 2;
      return { x: r.x - p, y: r.y - p, w: r.w + 2 * p, h: r.h + 2 * p };
    }
    case 'rect':
    case 'ellipse':
    case 'text':
      return a.rect;
    case 'arrow': {
      const r = pointsBBox([a.start, a.end]);
      const p = a.strokeWidth * 3;
      return { x: r.x - p, y: r.y - p, w: r.w + 2 * p, h: r.h + 2 * p };
    }
    case 'note':
      return { x: a.at.x, y: a.at.y, w: 22, h: 22 };
  }
}

/** Applies a point transform to every coordinate of an annotation. */
export function mapPoints(a: Annotation, f: (p: Point) => Point): Annotation {
  const mapRect = (r: Rect): Rect => normRect(f({ x: r.x, y: r.y }), f({ x: r.x + r.w, y: r.y + r.h }));
  switch (a.type) {
    case 'highlight':
    case 'underline':
    case 'strikeout':
      return { ...a, rects: a.rects.map(mapRect) };
    case 'ink':
      return { ...a, paths: a.paths.map((path) => path.map(f)) };
    case 'rect':
    case 'ellipse':
    case 'text':
      return { ...a, rect: mapRect(a.rect) };
    case 'arrow':
      return { ...a, start: f(a.start), end: f(a.end) };
    case 'note':
      return { ...a, at: f(a.at) };
  }
}

export const translate = (a: Annotation, dx: number, dy: number) =>
  mapPoints(a, (p) => ({ x: p.x + dx, y: p.y + dy }));

/** Scales an annotation so its bounding box `from` becomes `to`. */
export function resizeTo(a: Annotation, from: Rect, to: Rect): Annotation {
  const sx = from.w ? to.w / from.w : 1;
  const sy = from.h ? to.h / from.h : 1;
  return mapPoints(a, (p) => ({ x: to.x + (p.x - from.x) * sx, y: to.y + (p.y - from.y) * sy }));
}

/** Smooth SVG path through freehand points (quadratic midpoints). */
export function smoothPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  if (pts.length < 3) return `M${pts[0].x},${pts[0].y} ` + pts.map((p) => `L${p.x},${p.y}`).join(' ');
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q${pts[i].x},${pts[i].y} ${mx},${my}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${last.x},${last.y}`;
}

/** Drops points closer than `tol` to the previous kept point. */
export function simplify(pts: Point[], tol = 0.8): Point[] {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (const p of pts.slice(1)) {
    const q = out[out.length - 1];
    if (Math.hypot(p.x - q.x, p.y - q.y) >= tol) out.push(p);
  }
  if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
  return out;
}

export function arrowHead(start: Point, end: Point, size: number): Point[] {
  const ang = Math.atan2(end.y - start.y, end.x - start.x);
  const a1 = ang + Math.PI - 0.45;
  const a2 = ang + Math.PI + 0.45;
  return [
    { x: end.x + size * Math.cos(a1), y: end.y + size * Math.sin(a1) },
    end,
    { x: end.x + size * Math.cos(a2), y: end.y + size * Math.sin(a2) },
  ];
}

/** Merges selection client rects that sit on the same text line. */
export function mergeLineRects(rects: Rect[]): Rect[] {
  const sorted = rects.filter((r) => r.w > 0.5 && r.h > 0.5).sort((a, b) => a.y - b.y || a.x - b.x);
  const out: Rect[] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    const sameLine = last && Math.abs(last.y + last.h / 2 - (r.y + r.h / 2)) < Math.min(last.h, r.h) * 0.5;
    if (sameLine && r.x <= last.x + last.w + 6) out[out.length - 1] = unionRects([last, r]);
    else out.push({ ...r });
  }
  return out;
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}
