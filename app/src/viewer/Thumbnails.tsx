import { memo, useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { PageSize } from './types';

const WIDTH = 132;

function Thumb({ pdf, index, size, active, count, onClick }: { pdf: PDFDocumentProxy; index: number; size: PageSize; active: boolean; count: number; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const h = (size.height / size.width) * WIDTH;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: '300px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    pdf.getPage(index + 1).then((page) => {
      if (cancelled || !canvas.current) return;
      const vp = page.getViewport({ scale: (WIDTH / size.width) * 2 });
      canvas.current.width = vp.width;
      canvas.current.height = vp.height;
      page.render({ canvas: canvas.current, viewport: vp }).promise.catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [visible, pdf, index, size.width]);

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <button ref={ref} className={`mg-thumb ${active ? 'is-active' : ''}`} onClick={onClick}>
      <div className="mg-thumb-page" style={{ width: WIDTH, height: h }}>
        <canvas ref={canvas} />
        {count > 0 && <span className="mg-thumb-badge">{count}</span>}
      </div>
      <span className="mg-thumb-label">{index + 1}</span>
    </button>
  );
}

export const Thumbnails = memo(function Thumbnails({
  pdf,
  pages,
  current,
  counts,
  onGo,
}: {
  pdf: PDFDocumentProxy;
  pages: PageSize[];
  current: number;
  counts: number[];
  onGo: (i: number) => void;
}) {
  return (
    <div className="mg-thumbs">
      {pages.map((size, i) => (
        <Thumb key={i} pdf={pdf} index={i} size={size} active={i === current} count={counts[i] ?? 0} onClick={() => onGo(i)} />
      ))}
    </div>
  );
});
