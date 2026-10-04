import type { PDFDocumentProxy, PageViewport } from 'pdfjs-dist';
import { getDocument } from './pdfjs';
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFRef,
  PDFString,
  type PDFObject,
} from 'pdf-lib';
import { rgbToHex, uid, unionRects, normRect } from './geometry';
import type { Annotation, PageSize, Point } from './types';

const ASSETS = `${import.meta.env.BASE_URL}pdfjs/`;

export type LoadedDocument = {
  pdf: PDFDocumentProxy;
  pages: PageSize[];
  /** Annotations found in the file, converted to editable ones. */
  imported: Annotation[];
  fingerprint: string;
  /** Original bytes: export always starts from these. */
  bytes: Uint8Array;
  name: string;
};

// Raw annotation data pulled out of the file, still in PDF coordinates.
type RawAnnot = {
  page: number;
  subtype: string;
  rect: number[];
  quads?: number[];
  ink?: number[][];
  line?: number[];
  color?: string;
  opacity: number;
  author: string;
  contents: string;
  fontSize?: number;
  borderWidth: number;
  margin?: Annotation;
};

const IMPORTABLE = new Set(['Highlight', 'Underline', 'StrikeOut', 'Squiggly', 'Ink', 'Square', 'Circle', 'Line', 'FreeText', 'Text']);

const name = (o: PDFObject | undefined) => (o instanceof PDFName ? o.decodeText() : undefined);
const text = (o: PDFObject | undefined) =>
  o instanceof PDFString || o instanceof PDFHexString ? o.decodeText() : '';
const nums = (o: PDFObject | undefined, doc: PDFDocument): number[] => {
  const arr = o instanceof PDFRef ? doc.context.lookup(o) : o;
  if (!(arr instanceof PDFArray)) return [];
  return arr.asArray().map((v) => {
    const n = v instanceof PDFRef ? doc.context.lookup(v) : v;
    return n instanceof PDFNumber ? n.asNumber() : 0;
  });
};

function colorFrom(c: number[]): string | undefined {
  if (c.length === 1) return rgbToHex(c[0], c[0], c[0]);
  if (c.length === 3) return rgbToHex(c[0], c[1], c[2]);
  if (c.length === 4) {
    const [C, M, Y, K] = c;
    return rgbToHex((1 - C) * (1 - K), (1 - M) * (1 - K), (1 - Y) * (1 - K));
  }
  return undefined;
}

/**
 * Pulls supported annotations out of the file so we can edit them, and returns
 * bytes with those annotations removed (otherwise pdf.js would paint them too).
 */
async function extractAnnotations(bytes: Uint8Array): Promise<{ raw: RawAnnot[]; bytes: Uint8Array }> {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  if (doc.isEncrypted) return { raw: [], bytes };
  const raw: RawAnnot[] = [];
  let changed = false;

  doc.getPages().forEach((page, pageIndex) => {
    const annots = page.node.Annots();
    if (!annots) return;
    const removed = new Set<PDFObject>();
    const entries = annots.asArray().map((ref) => ({ ref, dict: doc.context.lookup(ref) }));

    for (const { ref, dict } of entries) {
      if (!(dict instanceof PDFDict)) continue;
      const subtype = name(dict.get(PDFName.of('Subtype')));
      if (!subtype || !IMPORTABLE.has(subtype)) continue;
      const marginJson = text(dict.get(PDFName.of('MarginData')));
      let margin: Annotation | undefined;
      if (marginJson) {
        try {
          margin = { ...JSON.parse(marginJson), page: pageIndex } as Annotation;
        } catch {
          margin = undefined;
        }
      }
      const bs = dict.get(PDFName.of('BS'));
      const bsDict = bs instanceof PDFRef ? doc.context.lookup(bs) : bs;
      const bw = bsDict instanceof PDFDict ? bsDict.get(PDFName.of('W')) : undefined;
      const ca = dict.get(PDFName.of('CA'));
      const da = text(dict.get(PDFName.of('DA')));
      const fontMatch = da.match(/([\d.]+)\s+Tf/);
      const inkList = dict.get(PDFName.of('InkList'));
      const inkArr = inkList instanceof PDFRef ? doc.context.lookup(inkList) : inkList;

      raw.push({
        page: pageIndex,
        subtype,
        rect: nums(dict.get(PDFName.of('Rect')), doc),
        quads: nums(dict.get(PDFName.of('QuadPoints')), doc),
        ink: inkArr instanceof PDFArray ? inkArr.asArray().map((p) => nums(p, doc)) : undefined,
        line: nums(dict.get(PDFName.of('L')), doc),
        color: colorFrom(nums(dict.get(PDFName.of('C')), doc)),
        opacity: ca instanceof PDFNumber ? ca.asNumber() : 1,
        author: text(dict.get(PDFName.of('T'))),
        contents: text(dict.get(PDFName.of('Contents'))),
        fontSize: fontMatch ? parseFloat(fontMatch[1]) : undefined,
        borderWidth: bw instanceof PDFNumber ? bw.asNumber() : 1,
        margin,
      });
      removed.add(ref);
    }

    if (!removed.size) return;
    // Popups belong to the annotations we lifted out; drop them as well.
    const kept = entries.filter(({ ref, dict }) => {
      if (removed.has(ref)) return false;
      if (dict instanceof PDFDict && name(dict.get(PDFName.of('Subtype'))) === 'Popup') {
        const parent = dict.get(PDFName.of('Parent'));
        return !(parent && removed.has(parent));
      }
      return true;
    });
    page.node.set(PDFName.of('Annots'), doc.context.obj(kept.map((k) => k.ref)));
    changed = true;
  });

  if (!changed) return { raw, bytes };
  return { raw, bytes: await doc.save({ useObjectStreams: false }) };
}

function toAnnotation(r: RawAnnot, vp: PageViewport): Annotation | null {
  if (r.margin) return r.margin;
  const pt = (x: number, y: number): Point => {
    const [vx, vy] = vp.convertToViewportPoint(x, y);
    return { x: vx, y: vy };
  };
  const rectOf = (q: number[]) => normRect(pt(q[0], q[1]), pt(q[2], q[3]));
  const base = {
    id: uid(),
    page: r.page,
    color: r.color ?? '#FFD43B',
    opacity: r.opacity,
    author: r.author || 'Imported',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    comment: r.contents,
    replies: [],
  };
  switch (r.subtype) {
    case 'Highlight':
    case 'Underline':
    case 'StrikeOut':
    case 'Squiggly': {
      const rects = [];
      const q = r.quads ?? [];
      for (let i = 0; i + 7 < q.length; i += 8) {
        const ps = [pt(q[i], q[i + 1]), pt(q[i + 2], q[i + 3]), pt(q[i + 4], q[i + 5]), pt(q[i + 6], q[i + 7])];
        rects.push(unionRects(ps.map((p) => ({ x: p.x, y: p.y, w: 0, h: 0 }))));
      }
      if (!rects.length && r.rect.length === 4) rects.push(rectOf(r.rect));
      const type = r.subtype === 'Highlight' ? 'highlight' : r.subtype === 'StrikeOut' ? 'strikeout' : 'underline';
      return { ...base, type, rects, text: '', opacity: type === 'highlight' ? Math.min(base.opacity, 0.45) : base.opacity };
    }
    case 'Ink':
      if (!r.ink?.length) return null;
      return {
        ...base,
        type: 'ink',
        strokeWidth: r.borderWidth || 2,
        paths: r.ink.map((p) => {
          const out: Point[] = [];
          for (let i = 0; i + 1 < p.length; i += 2) out.push(pt(p[i], p[i + 1]));
          return out;
        }),
      };
    case 'Square':
    case 'Circle': {
      if (r.rect.length !== 4) return null;
      const rc = rectOf(r.rect);
      const b = r.borderWidth / 2;
      return {
        ...base,
        type: r.subtype === 'Square' ? 'rect' : 'ellipse',
        strokeWidth: r.borderWidth || 2,
        rect: { x: rc.x + b, y: rc.y + b, w: rc.w - 2 * b, h: rc.h - 2 * b },
      };
    }
    case 'Line':
      if (r.line?.length !== 4) return null;
      return { ...base, type: 'arrow', strokeWidth: r.borderWidth || 2, start: pt(r.line[0], r.line[1]), end: pt(r.line[2], r.line[3]) };
    case 'FreeText':
      if (r.rect.length !== 4) return null;
      return { ...base, type: 'text', rect: rectOf(r.rect), text: r.contents, comment: '', fontSize: r.fontSize ?? 12, color: r.color ?? '#212529' };
    case 'Text': {
      if (r.rect.length !== 4) return null;
      const rc = rectOf(r.rect);
      return { ...base, type: 'note', at: { x: rc.x, y: rc.y } };
    }
  }
  return null;
}

export async function loadDocument(input: ArrayBuffer | Uint8Array, fileName: string): Promise<LoadedDocument> {
  const original = new Uint8Array(input).slice();
  let raw: RawAnnot[] = [];
  let renderBytes: Uint8Array = original;
  try {
    const res = await extractAnnotations(original.slice());
    raw = res.raw;
    renderBytes = res.bytes;
  } catch {
    // pdf-lib can't parse every file; fall back to rendering it untouched.
  }

  const pdf = await getDocument({
    data: new Uint8Array(renderBytes),
    cMapUrl: `${ASSETS}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${ASSETS}standard_fonts/`,
    wasmUrl: `${ASSETS}wasm/`,
    iccUrl: `${ASSETS}iccs/`,
  }).promise;

  const pages: PageSize[] = [];
  const imported: Annotation[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    pages.push({ width: vp.width, height: vp.height });
    for (const r of raw.filter((a) => a.page === i - 1)) {
      const a = toAnnotation(r, vp);
      if (a) imported.push(a);
    }
  }

  return { pdf, pages, imported, fingerprint: await hash(original), bytes: original, name: fileName };
}

async function hash(bytes: Uint8Array): Promise<string> {
  try {
    const digest = await crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
    return Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // crypto.subtle needs a secure context; fall back to size + name.
    return `${bytes.length}`;
  }
}

export async function getPageViewport(pdf: PDFDocumentProxy, pageIndex: number) {
  const page = await pdf.getPage(pageIndex + 1);
  return page.getViewport({ scale: 1 });
}
