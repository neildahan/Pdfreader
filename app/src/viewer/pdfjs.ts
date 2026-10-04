// The legacy build ships polyfills for features (e.g. Map#getOrInsertComputed)
// that current Safari and older Chromium/Firefox releases still lack.
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export const { getDocument, TextLayer, Util } = pdfjs;
