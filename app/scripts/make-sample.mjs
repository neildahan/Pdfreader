// Generates public/sample.pdf: a fictional multi-page agreement used by the demo.
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { writeFile } from 'node:fs/promises';

const doc = await PDFDocument.create();
doc.setTitle('Master Services Agreement — Sample');
doc.setAuthor('Margin demo');
const serif = await doc.embedFont(StandardFonts.TimesRoman);
const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
const sans = await doc.embedFont(StandardFonts.Helvetica);
const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

const W = 612, H = 792, M = 72;
const ink = rgb(0.12, 0.13, 0.16);
const muted = rgb(0.42, 0.45, 0.5);
const accent = rgb(0.2, 0.33, 0.85);

let page, y, pageNo = 0;
function newPage() {
  page = doc.addPage([W, H]);
  pageNo++;
  y = H - M;
  page.drawText('NORTHWIND LOGISTICS  ·  MASTER SERVICES AGREEMENT', { x: M, y: H - 40, size: 7.5, font: sansBold, color: muted });
  page.drawText(`Page ${pageNo}`, { x: W - M - 30, y: 40, size: 8, font: sans, color: muted });
  page.drawText('Sample document generated for demonstration purposes. Not a real contract.', { x: M, y: 40, size: 7, font: sans, color: muted });
}
function wrap(text, font, size, width) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (font.widthOfTextAtSize(t, size) > width && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}
function para(text, { font = serif, size = 11, gap = 10, lh = 1.45, color = ink, indent = 0 } = {}) {
  for (const l of wrap(text, font, size, W - 2 * M - indent)) {
    if (y < M + 20) newPage();
    page.drawText(l, { x: M + indent, y, size, font, color });
    y -= size * lh;
  }
  y -= gap;
}
function heading(text) {
  if (y < M + 80) newPage();
  y -= 6;
  page.drawText(text, { x: M, y, size: 13, font: serifBold, color: ink });
  y -= 22;
}

newPage();
y -= 40;
page.drawText('Master Services Agreement', { x: M, y, size: 30, font: serifBold, color: ink });
y -= 30;
page.drawText('Between Northwind Logistics, Inc. and Contoso Freight Ltd.', { x: M, y, size: 13, font: serif, color: muted });
y -= 30;
page.drawRectangle({ x: M, y: y - 62, width: W - 2 * M, height: 70, color: rgb(0.95, 0.96, 0.99), borderColor: rgb(0.85, 0.88, 0.96), borderWidth: 1 });
const meta = [['Effective date', 'January 1, 2027'], ['Term', '36 months'], ['Contract value', '$1,240,000'], ['Governing law', 'State of Delaware']];
meta.forEach(([k, v], i) => {
  const x = M + 16 + i * 118;
  page.drawText(k.toUpperCase(), { x, y: y - 22, size: 7, font: sansBold, color: muted });
  page.drawText(v, { x, y: y - 40, size: 11, font: sansBold, color: ink });
});
y -= 100;

heading('1. Purpose and scope');
para('This Master Services Agreement ("Agreement") sets out the terms under which Contoso Freight Ltd. ("Provider") will deliver freight forwarding, warehousing and last-mile delivery services to Northwind Logistics, Inc. ("Customer"). Individual engagements will be described in Statements of Work ("SOW") that reference this Agreement.');
para('Each SOW will define the services, delivery schedule, service levels and fees for that engagement. If a SOW conflicts with this Agreement, this Agreement controls unless the SOW expressly states that a specific section of this Agreement is overridden.');
heading('2. Fees and payment');
para('Customer will pay the fees described in each SOW. Unless stated otherwise, Provider will invoice monthly in arrears and Customer will pay each undisputed invoice within forty-five (45) days of receipt. Late payments accrue interest at one percent (1%) per month or the maximum rate permitted by law, whichever is lower.');
para('Provider may increase its rates once per contract year by giving at least ninety (90) days written notice. Any increase may not exceed the lower of five percent (5%) or the change in the Consumer Price Index over the preceding twelve months.');
heading('3. Service levels');
para('Provider will meet the service levels set out in Schedule A. If Provider fails to meet an on-time delivery rate of 97% in any calendar month, Customer is entitled to a service credit equal to three percent (3%) of that month\'s fees for each full percentage point below the target, capped at fifteen percent (15%) of monthly fees.');
para('Service credits are Customer\'s sole monetary remedy for service level failures, except where the failures continue for three consecutive months, in which case Customer may terminate the affected SOW for cause under Section 7.');

heading('4. Confidentiality');
para('Each party will protect the other party\'s Confidential Information using at least the same degree of care it uses for its own confidential information, and no less than reasonable care. Confidential Information may only be used to perform or receive the services and may only be disclosed to employees and contractors who need to know it and are bound by written obligations at least as protective as these.');
para('These obligations survive for five (5) years after termination of this Agreement, except for trade secrets, which remain protected for as long as they qualify as trade secrets under applicable law.');
heading('5. Data protection');
para('Where Provider processes personal data on behalf of Customer, the parties will comply with the Data Processing Addendum attached as Schedule B. Provider will notify Customer without undue delay, and in any case within forty-eight (48) hours, after becoming aware of a personal data breach affecting Customer data.');
heading('6. Liability');
para('EXCEPT FOR BREACHES OF SECTION 4, INDEMNIFICATION OBLIGATIONS, OR A PARTY\'S GROSS NEGLIGENCE OR WILFUL MISCONDUCT, NEITHER PARTY\'S TOTAL LIABILITY UNDER THIS AGREEMENT WILL EXCEED THE FEES PAID OR PAYABLE IN THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM.', { size: 10.5 });
para('Neither party is liable for indirect, incidental, special or consequential damages, including lost profits, even if it was advised of the possibility of those damages.');
heading('7. Term and termination');
para('This Agreement starts on the Effective Date and continues for thirty-six (36) months. It renews automatically for successive twelve (12) month periods unless either party gives notice of non-renewal at least sixty (60) days before the end of the then-current term.');
para('Either party may terminate this Agreement or any SOW for cause if the other party materially breaches it and fails to cure the breach within thirty (30) days of written notice describing the breach in reasonable detail.');

// Schedule A table
newPage();
y -= 10;
page.drawText('Schedule A — Service levels', { x: M, y, size: 18, font: serifBold, color: ink });
y -= 34;
const cols = [M, M + 190, M + 300, M + 390];
const rows = [
  ['Metric', 'Target', 'Measured', 'Credit'],
  ['On-time delivery', '97.0%', 'Monthly', '3% per point'],
  ['Damage-free shipments', '99.5%', 'Monthly', '2% per point'],
  ['Invoice accuracy', '99.0%', 'Quarterly', '1% per point'],
  ['Tracking data latency', '< 15 min', 'Daily', 'None'],
  ['Claims resolved in 30 days', '95.0%', 'Quarterly', '1% per point'],
];
rows.forEach((r, i) => {
  if (i === 0) page.drawRectangle({ x: M, y: y - 8, width: W - 2 * M, height: 24, color: rgb(0.93, 0.94, 0.97) });
  r.forEach((c, j) => page.drawText(c, { x: cols[j] + 8, y, size: 10.5, font: i === 0 ? sansBold : sans, color: ink }));
  y -= 30;
  page.drawLine({ start: { x: M, y: y + 14 }, end: { x: W - M, y: y + 14 }, thickness: 0.6, color: rgb(0.85, 0.86, 0.9) });
});
y -= 20;
page.drawText('Monthly on-time delivery, last 12 months', { x: M, y, size: 11, font: sansBold, color: ink });
y -= 20;
const vals = [96.1, 97.4, 98.2, 97.9, 96.8, 95.9, 97.2, 98.4, 98.9, 97.6, 96.4, 98.1];
const chartH = 150, baseY = y - chartH, bw = 28;
for (let g = 94; g <= 100; g += 2) {
  const gy = baseY + ((g - 94) / 6) * chartH;
  page.drawLine({ start: { x: M + 28, y: gy }, end: { x: W - M, y: gy }, thickness: 0.4, color: rgb(0.88, 0.89, 0.92) });
  page.drawText(`${g}%`, { x: M, y: gy - 3, size: 7.5, font: sans, color: muted });
}
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
vals.forEach((v, i) => {
  const x = M + 40 + i * 36;
  const h = ((v - 94) / 6) * chartH;
  page.drawRectangle({ x, y: baseY, width: bw, height: h, color: v < 97 ? rgb(0.93, 0.45, 0.35) : accent });
  page.drawText(months[i], { x: x + 10, y: baseY - 14, size: 8, font: sans, color: muted });
});
const ty = baseY + ((97 - 94) / 6) * chartH;
page.drawLine({ start: { x: M + 28, y: ty }, end: { x: W - M, y: ty }, thickness: 1, color: ink, dashArray: [4, 3] });
page.drawText('Target 97%', { x: W - M - 50, y: ty + 4, size: 7.5, font: sansBold, color: ink });
y = baseY - 50;
para('Months shown in red fell below the on-time delivery target and generated service credits under Section 3. Provider has committed to a remediation plan for the November peak season, described in the next schedule.');

// Signature page
newPage();
y -= 10;
page.drawText('Signatures', { x: M, y, size: 18, font: serifBold, color: ink });
y -= 30;
para('IN WITNESS WHEREOF, the parties have executed this Agreement by their duly authorised representatives as of the Effective Date.');
y -= 30;
['Northwind Logistics, Inc.', 'Contoso Freight Ltd.'].forEach((party, i) => {
  const x = M + i * 250;
  page.drawText(party, { x, y, size: 11, font: sansBold, color: ink });
  ['Signature', 'Name', 'Title', 'Date'].forEach((f, j) => {
    const ly = y - 60 - j * 50;
    page.drawLine({ start: { x, y: ly }, end: { x: x + 210, y: ly }, thickness: 0.8, color: muted });
    page.drawText(f, { x, y: ly - 12, size: 8, font: sans, color: muted });
  });
});

await writeFile(new URL('../public/sample.pdf', import.meta.url), await doc.save());
console.log('wrote public/sample.pdf');
