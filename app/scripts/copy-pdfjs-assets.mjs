// Copies pdf.js runtime assets (CJK cmaps, standard fonts, wasm decoders) into public/.
import { cp } from 'node:fs/promises';

for (const dir of ['cmaps', 'standard_fonts', 'wasm', 'iccs']) {
  await cp(new URL(`../node_modules/pdfjs-dist/${dir}`, import.meta.url), new URL(`../public/pdfjs/${dir}`, import.meta.url), {
    recursive: true,
  });
}
