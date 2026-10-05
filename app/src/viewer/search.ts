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

  async texts(numPages: number): Promise<string[]> {
    const out: string[] = [];
    for (let i = 0; i < numPages; i++) out.push((await this.page(i)).text);
    return out;
  }

  /**
   * Finds `quote` on a page and returns its rectangles. Tolerates whitespace,
   * case and typographic-quote differences; falls back to the quote's opening words.
   */
  async locate(pageIndex: number, quote: string): Promise<Rect[]> {
    const { text, spans } = await this.page(pageIndex);
    const norm = (c: string) => (/\s/.test(c) ? ' ' : c.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').toLowerCase());
    // Normalised copy of the page text plus a map back to original indices.
    let flat = '';
    const map: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const c = norm(text[i]);
      if (c === ' ' && flat.endsWith(' ')) continue;
      flat += c;
      map.push(i);
    }
    const q = Array.from(quote.trim()).map(norm).join('').replace(/ +/g, ' ');
    let at = flat.indexOf(q);
    let len = q.length;
    if (at === -1 && q.length > 30) {
      const head = q.slice(0, 30);
      at = flat.indexOf(head);
      len = head.length;
    }
    if (at === -1) return [];
    const start = map[at];
    const end = map[Math.min(at + len, map.length) - 1] + 1;
    const rects: Rect[] = [];
    for (const s of spans) {
      if (s.end <= start || s.start >= end) continue;
      const n = Math.max(1, s.end - s.start);
      const a = (Math.max(start, s.start) - s.start) / n;
      const b = (Math.min(end, s.end) - s.start) / n;
      rects.push({ x: s.rect.x + s.rect.w * a, y: s.rect.y, w: s.rect.w * (b - a), h: s.rect.h });
    }
    return rects;
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
