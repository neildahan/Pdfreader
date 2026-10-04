import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { pointsBBox, simplify, smoothPath } from './geometry';
import type { Point } from './types';

/** Modal for drawing a signature. Returns paths normalised so the width is 1. */
export function SignaturePad({ onCancel, onUse }: { onCancel: () => void; onUse: (paths: Point[][]) => void }) {
  const [paths, setPaths] = useState<Point[][]>([]);
  const current = useRef<Point[] | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [, force] = useState(0);

  const pt = (e: React.PointerEvent): Point => {
    const r = svg.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 500, y: ((e.clientY - r.top) / r.height) * 200 };
  };

  const use = () => {
    const all = paths.flat();
    if (!all.length) return;
    const b = pointsBBox(all);
    const w = Math.max(b.w, 1);
    onUse(paths.map((p) => simplify(p, 1).map((q) => ({ x: (q.x - b.x) / w, y: (q.y - b.y) / w }))));
  };

  return (
    <div className="mg-modal-backdrop" onPointerDown={onCancel}>
      <div className="mg-modal" onPointerDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <div className="mg-modal-head">
          <h3>Draw your signature</h3>
          <button className="mg-icon-btn" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <svg
          ref={svg}
          className="mg-sigpad"
          viewBox="0 0 500 200"
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture(e.pointerId);
            current.current = [pt(e)];
            force((n) => n + 1);
          }}
          onPointerMove={(e) => {
            if (!current.current) return;
            current.current.push(pt(e));
            force((n) => n + 1);
          }}
          onPointerUp={() => {
            if (current.current) setPaths((p) => [...p, current.current!]);
            current.current = null;
          }}
        >
          <line x1="40" x2="460" y1="150" y2="150" className="mg-sigline" />
          <text x="40" y="172" className="mg-sighint">Sign above the line</text>
          <g fill="none" stroke="#1C3FAA" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            {paths.map((p, i) => (
              <path key={i} d={smoothPath(p)} />
            ))}
            {current.current && <path d={smoothPath(current.current)} />}
          </g>
        </svg>
        <div className="mg-modal-foot">
          <button className="mg-btn ghost" onClick={() => setPaths([])} disabled={!paths.length}>
            Clear
          </button>
          <div style={{ flex: 1 }} />
          <button className="mg-btn ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="mg-btn primary" onClick={use} disabled={!paths.length}>
            Use signature
          </button>
        </div>
        <p className="mg-modal-note">Then click anywhere on the document to place it.</p>
      </div>
    </div>
  );
}
