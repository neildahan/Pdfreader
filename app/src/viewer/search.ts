import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Util } from './pdfjs';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import type { Rect } from './types';

type PageText = { text: string; spans: { start: number; end: number; rect: Rect }[] };

export type SearchHit = { page: number; rects: Rect[]; snippet: string };

export class TextIndex {
  private cache = new Map<number, Promise<PageText>>();
  constructor(private pdf: PDFDocumentProxy) {}

  page(index: number): Promise<PageText> {
    let p = this.cache.get(index);
    if (!p) {
      p = this.build(index);
      this.cache.set(index, p);
    }
    return p;
  }

  private async build(index: number): Promise<PageText> {
    const page = await this.pdf.getPage(index + 1);
    const vp = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    let text = '';
    const spans: PageText['spans'] = [];
    for (const item of content.items as TextItem[]) {
      if (typeof item.str !== 'string') continue;
      const tx = Util.transform(vp.transform, item.transform);
      const h = Math.hypot(tx[2], tx[3]);
      const start = text.length;
      text += item.str;
      spans.push({ start, end: text.length, rect: { x: tx[4], y: tx[5] - h * 0.85, w: item.width * vp.scale, h: h * 1.1 } });
      if (item.hasEOL) text += ' ';
    }
    return { text, spans };
  }

  async search(query: string, numPages: number): Promise<SearchHit[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits: SearchHit[] = [];
    for (let i = 0; i < numPages; i++) {
      const { text, spans } = await this.page(i);
      const lower = text.toLowerCase();
      let at = lower.indexOf(q);
      while (at !== -1) {
        const end = at + q.length;
        const rects: Rect[] = [];
        for (const s of spans) {
          if (s.end <= at || s.start >= end) continue;
          const len = Math.max(1, s.end - s.start);
          const a = (Math.max(at, s.start) - s.start) / len;
          const b = (Math.min(end, s.end) - s.start) / len;
          rects.push({ x: s.rect.x + s.rect.w * a, y: s.rect.y, w: s.rect.w * (b - a), h: s.rect.h });
        }
        const from = Math.max(0, at - 40);
        hits.push({
          page: i,
          rects,
          snippet: (from > 0 ? '…' : '') + text.slice(from, end + 50).trim() + (end + 50 < text.length ? '…' : ''),
        });
        at = lower.indexOf(q, end);
      }
    }
    return hits;
  }
}
