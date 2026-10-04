import {
  PDFDict,
  PDFDocument,
  PDFFont,
  PDFHexString,
  PDFName,
  PDFString,
  StandardFonts,
  pushGraphicsState,
  popGraphicsState,
  drawObject,
  type PDFPage,
  type PDFRef,
} from 'pdf-lib';
import type { PDFDocumentProxy, PageViewport } from 'pdfjs-dist';
import { arrowHead, hexToRgb, simplify } from './geometry';
import type { Annotation, Point, Rect } from './types';

const IMPORTABLE = new Set(['Highlight', 'Underline', 'StrikeOut', 'Squiggly', 'Ink', 'Square', 'Circle', 'Line', 'FreeText', 'Text']);
const f = (n: number) => (Math.round(n * 100) / 100).toString();

type Ctx = {
  doc: PDFDocument;
  font: PDFFont;
  toPdf: (p: Point) => Point;
};

function pdfRect(ctx: Ctx, r: Rect): [number, number, number, number] {
  const pts = [
    ctx.toPdf({ x: r.x, y: r.y }),
    ctx.toPdf({ x: r.x + r.w, y: r.y }),
    ctx.toPdf({ x: r.x, y: r.y + r.h }),
    ctx.toPdf({ x: r.x + r.w, y: r.y + r.h }),
  ];
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

const grow = (r: number[], d: number): [number, number, number, number] => [r[0] - d, r[1] - d, r[2] + d, r[3] + d];

function wrapLines(text: string, font: PDFFont, size: number, width: number): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const t = line ? `${line} ${word}` : word;
      if (line && font.widthOfTextAtSize(t, size) > width) {
        out.push(line);
        line = word;
      } else line = t;
    }
    out.push(line);
  }
  return out;
}

// Standard 14 fonts only cover WinAnsi; replace anything else so encoding can't throw.
const winAnsi = (s: string) => s.replace(/[^\x20-\x7E\xA0-\xFF\n–—‘’“”•€]/g, '?');

function ellipseOps(x1: number, y1: number, x2: number, y2: number) {
  const k = 0.5522847498;
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2, rx = (x2 - x1) / 2, ry = (y2 - y1) / 2;
  return [
    `${f(cx + rx)} ${f(cy)} m`,
    `${f(cx + rx)} ${f(cy + k * ry)} ${f(cx + k * rx)} ${f(cy + ry)} ${f(cx)} ${f(cy + ry)} c`,
    `${f(cx - k * rx)} ${f(cy + ry)} ${f(cx - rx)} ${f(cy + k * ry)} ${f(cx - rx)} ${f(cy)} c`,
    `${f(cx - rx)} ${f(cy - k * ry)} ${f(cx - k * rx)} ${f(cy - ry)} ${f(cx)} ${f(cy - ry)} c`,
    `${f(cx + k * rx)} ${f(cy - ry)} ${f(cx + rx)} ${f(cy - k * ry)} ${f(cx + rx)} ${f(cy)} c`,
  ].join('\n');
}

type Built = {
  subtype: string;
  rect: [number, number, number, number];
  ops: string;
  extra: Record<string, unknown>;
  usesFont?: boolean;
  multiply?: boolean;
};

/** Geometry, appearance stream and type-specific keys for one annotation. */
function build(ctx: Ctx, a: Annotation): Built | null {
  const [r, g, b] = hexToRgb(a.color);
  const rgb = `${f(r)} ${f(g)} ${f(b)}`;
  switch (a.type) {
    case 'highlight':
    case 'underline':
    case 'strikeout': {
      const boxes = a.rects.map((rc) => pdfRect(ctx, rc));
      const quads = boxes.flatMap(([x1, y1, x2, y2]) => [x1, y2, x2, y2, x1, y1, x2, y1]);
      let ops: string;
      if (a.type === 'highlight') {
        ops = `${rgb} rg\n` + boxes.map(([x1, y1, x2, y2]) => `${f(x1)} ${f(y1)} ${f(x2 - x1)} ${f(y2 - y1)} re f`).join('\n');
      } else {
        ops = `${rgb} RG\n` + boxes.map(([x1, y1, x2, y2]) => {
          const h = y2 - y1;
          const y = a.type === 'underline' ? y1 + h * 0.08 : y1 + h * 0.45;
          return `${f(Math.max(0.8, h * 0.07))} w ${f(x1)} ${f(y)} m ${f(x2)} ${f(y)} l S`;
        }).join('\n');
      }
      const all = boxes.reduce((u, x) => [Math.min(u[0], x[0]), Math.min(u[1], x[1]), Math.max(u[2], x[2]), Math.max(u[3], x[3])]);
      return {
        subtype: a.type === 'highlight' ? 'Highlight' : a.type === 'underline' ? 'Underline' : 'StrikeOut',
        rect: grow(all, 1),
        ops,
        extra: { QuadPoints: quads },
        multiply: a.type === 'highlight',
      };
    }
    case 'ink': {
      const paths = a.paths.map((p) => simplify(p, 0.6).map(ctx.toPdf));
      const pts = paths.flat();
      if (!pts.length) return null;
      const box = [Math.min(...pts.map((p) => p.x)), Math.min(...pts.map((p) => p.y)), Math.max(...pts.map((p) => p.x)), Math.max(...pts.map((p) => p.y))];
      const ops =
        `${rgb} RG ${f(a.strokeWidth)} w 1 J 1 j\n` +
        paths
          .map((p) => p.map((q, i) => `${f(q.x)} ${f(q.y)} ${i ? 'l' : 'm'}`).join(' ') + (p.length === 1 ? ` ${f(p[0].x + 0.1)} ${f(p[0].y)} l` : '') + ' S')
          .join('\n');
      return {
        subtype: 'Ink',
        rect: grow(box, a.strokeWidth),
        ops,
        extra: { InkList: paths.map((p) => p.flatMap((q) => [q.x, q.y])), BS: { W: a.strokeWidth, S: 'S' } },
      };
    }
    case 'rect':
    case 'ellipse': {
      const [x1, y1, x2, y2] = pdfRect(ctx, a.rect);
      const w = a.strokeWidth;
      const shape = a.type === 'rect' ? `${f(x1)} ${f(y1)} ${f(x2 - x1)} ${f(y2 - y1)} re` : ellipseOps(x1, y1, x2, y2);
      return {
        subtype: a.type === 'rect' ? 'Square' : 'Circle',
        rect: grow([x1, y1, x2, y2], w / 2 + 1),
        ops: `${rgb} RG ${f(w)} w\n${shape}\nS`,
        extra: { BS: { W: w, S: 'S' }, RD: [w / 2 + 1, w / 2 + 1, w / 2 + 1, w / 2 + 1] },
      };
    }
    case 'arrow': {
      const s = ctx.toPdf(a.start);
      const e = ctx.toPdf(a.end);
      const head = arrowHead(s, e, 6 + a.strokeWidth * 2.5);
      const box = [Math.min(s.x, e.x), Math.min(s.y, e.y), Math.max(s.x, e.x), Math.max(s.y, e.y)];
      return {
        subtype: 'Line',
        rect: grow(box, 8 + a.strokeWidth * 3),
        ops:
          `${rgb} RG ${f(a.strokeWidth)} w 1 J 1 j\n${f(s.x)} ${f(s.y)} m ${f(e.x)} ${f(e.y)} l S\n` +
          `${f(head[0].x)} ${f(head[0].y)} m ${f(head[1].x)} ${f(head[1].y)} l ${f(head[2].x)} ${f(head[2].y)} l S`,
        extra: { L: [s.x, s.y, e.x, e.y], LE: ['None', 'OpenArrow'], BS: { W: a.strokeWidth, S: 'S' }, IC: [r, g, b] },
      };
    }
    case 'text': {
      const [x1, y1, x2, y2] = pdfRect(ctx, a.rect);
      const size = a.fontSize;
      const pad = 4;
      const lines = wrapLines(winAnsi(a.text), ctx.font, size, x2 - x1 - pad * 2);
      const lh = size * 1.25;
      const textOps = lines
        .map((l, i) => {
          const y = y2 - pad - size * 0.9 - i * lh;
          return `BT /Helv ${f(size)} Tf ${f(x1 + pad)} ${f(y)} Td ${ctx.font.encodeText(l).toString()} Tj ET`;
        })
        .join('\n');
      return {
        subtype: 'FreeText',
        rect: [x1, y1, x2, y2],
        ops: `${rgb} rg\n${textOps}`,
        extra: { DA: PDFString.of(`/Helv ${f(size)} Tf ${rgb} rg`), BS: { W: 0 } },
        usesFont: true,
      };
    }
    case 'note': {
      const p = ctx.toPdf(a.at);
      const s = 20;
      const [x1, y1] = [p.x, p.y - s];
      return {
        subtype: 'Text',
        rect: [x1, y1, x1 + s, y1 + s],
        ops:
          `${rgb} rg 0.2 0.2 0.2 RG 0.6 w\n${f(x1 + 1)} ${f(y1 + 1)} ${s - 2} ${s - 2} re B\n` +
          `0.2 0.2 0.2 RG 1.2 w ${f(x1 + 5)} ${f(y1 + 14)} m ${f(x1 + 15)} ${f(y1 + 14)} l S ${f(x1 + 5)} ${f(y1 + 10)} m ${f(x1 + 15)} ${f(y1 + 10)} l S ${f(x1 + 5)} ${f(y1 + 6)} m ${f(x1 + 11)} ${f(y1 + 6)} l S`,
        extra: { Name: 'Comment', Open: false },
      };
    }
  }
}

function contentsOf(a: Annotation): string {
  const head = a.type === 'text' ? a.text : a.comment;
  const replies = a.replies.map((r) => `\n— ${r.author}: ${r.text}`).join('');
  return head + replies;
}

function appearance(ctx: Ctx, b: Built, opacity: number): PDFRef {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resources: Record<string, any> = {
    ExtGState: { GS0: { Type: 'ExtGState', CA: opacity, ca: opacity, ...(b.multiply ? { BM: 'Multiply' } : {}) } },
  };
  if (b.usesFont) resources.Font = { Helv: ctx.font.ref };
  const stream = ctx.doc.context.stream(`q /GS0 gs\n${b.ops}\nQ`, {
    Type: 'XObject',
    Subtype: 'Form',
    BBox: b.rect,
    Resources: resources,
  });
  return ctx.doc.context.register(stream);
}

function pdfDate(ms: number) {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, '0');
  return `D:${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
}

function stripImportable(doc: PDFDocument, page: PDFPage) {
  const annots = page.node.Annots();
  if (!annots) return;
  const entries = annots.asArray().map((ref) => ({ ref, dict: doc.context.lookup(ref) }));
  const removed = new Set(entries.filter(({ dict }) => dict instanceof PDFDict && IMPORTABLE.has((dict.get(PDFName.of('Subtype')) as PDFName | undefined)?.decodeText() ?? '')).map((e) => e.ref));
  if (!removed.size) return;
  const kept = entries.filter(({ ref, dict }) => {
    if (removed.has(ref)) return false;
    if (dict instanceof PDFDict && (dict.get(PDFName.of('Subtype')) as PDFName | undefined)?.decodeText() === 'Popup') {
      const parent = dict.get(PDFName.of('Parent'));
      return !(parent && removed.has(parent));
    }
    return true;
  });
  page.node.set(PDFName.of('Annots'), doc.context.obj(kept.map((k) => k.ref)));
}

export async function exportPdf(
  bytes: Uint8Array,
  pdf: PDFDocumentProxy,
  annotations: Annotation[],
  mode: 'annotations' | 'flatten',
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes.slice(), { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const viewports = new Map<number, PageViewport>();

  for (let i = 0; i < pages.length; i++) {
    stripImportable(doc, pages[i]);
    const list = annotations.filter((a) => a.page === i);
    if (!list.length) continue;
    if (!viewports.has(i)) viewports.set(i, (await pdf.getPage(i + 1)).getViewport({ scale: 1 }));
    const vp = viewports.get(i)!;
    const ctx: Ctx = {
      doc,
      font,
      toPdf: (p) => {
        const [x, y] = vp.convertToPdfPoint(p.x, p.y);
        return { x, y };
      },
    };

    for (const a of list) {
      const b = build(ctx, a);
      if (!b) continue;
      const ap = appearance(ctx, b, a.type === 'highlight' ? Math.max(a.opacity, 0.35) : a.opacity);
      if (mode === 'flatten') {
        const name = pages[i].node.newXObject('MarginAnnot', ap);
        pages[i].pushOperators(pushGraphicsState(), drawObject(name), popGraphicsState());
        continue;
      }
      const [r, g, bl] = hexToRgb(a.color);
      const dict = doc.context.obj({
        Type: 'Annot',
        Subtype: b.subtype,
        Rect: b.rect,
        C: [r, g, bl],
        CA: a.opacity,
        F: 4,
        NM: PDFString.of(a.id),
        M: PDFString.of(pdfDate(a.updatedAt)),
        CreationDate: PDFString.of(pdfDate(a.createdAt)),
        AP: { N: ap },
        ...b.extra,
      });
      dict.set(PDFName.of('T'), PDFHexString.fromText(a.author));
      dict.set(PDFName.of('Contents'), PDFHexString.fromText(contentsOf(a)));
      // Full-fidelity copy (comment threads, styling) so Margin can reopen it losslessly.
      dict.set(PDFName.of('MarginData'), PDFHexString.fromText(JSON.stringify(a)));
      if (a.type === 'highlight' || a.type === 'underline' || a.type === 'strikeout') {
        dict.set(PDFName.of('Subj'), PDFHexString.fromText(a.text.slice(0, 200)));
      }
      dict.set(PDFName.of('P'), pages[i].ref);
      if (a.resolved) dict.set(PDFName.of('StateModel'), PDFString.of('Review'));
      pages[i].node.addAnnot(doc.context.register(dict));
    }
  }
  return doc.save();
}

export function download(data: Uint8Array | string, filename: string, type: string) {
  const blob = new Blob([data as BlobPart], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
