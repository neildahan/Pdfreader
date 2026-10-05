# Margin: PDF SDK demo

A working demo of an embeddable PDF viewer with annotations, plus the marketing site to validate demand for it (pricing, founding-customer sign-up).

- `#/`: landing page with the live viewer embedded, comparison, features, pricing, founding-customer form and FAQ.
- `#/demo`: full-screen viewer.

## What the viewer does

- Fast rendering (pdf.js) with lazy page loading, thumbnails, zoom (buttons, ⌘/Ctrl + wheel, fit width) and full-text search.
- Annotation tools: highlight, underline, strikethrough (on selected text), pen, rectangle, ellipse, arrow, text box, sticky note, drawn signature.
- Select, move, resize (Shift keeps aspect ratio), recolor, delete, undo/redo.
- Comment thread on every annotation: comment, replies, resolve/reopen, filters, author name.
- Export as a PDF with **real, editable PDF annotations** (opens in Acrobat, Preview, Chrome, Poppler), as a flattened PDF, or as JSON. Import JSON.
- Opens existing annotations already in a PDF (e.g. from Acrobat) and makes them editable. Margin's own exports reopen losslessly, including comment threads.
- Autosaves per document in the browser. Drag and drop any PDF. Nothing is uploaded.
- Light/dark mode, responsive down to phone width.

### Share links
**Share > Share link** puts all annotations and comment threads into one link, compressed into the URL fragment, so nothing is uploaded. Whoever opens it gets the annotations merged into their copy (newest edit wins) and can share back. For the sample PDF the link opens the document too; for a user's own file, the recipient opens their copy and the annotations appear on it.

### AI assistant (bring your own key)
The **Assistant** tab answers questions about the open document, summarizes, and finds passages ("Find & highlight"). Answers carry citations to the exact sentence (Anthropic citations on the document text); clicking one jumps to it, and the highlighter icon turns it into an annotation. Quotes from "Find" that can't be located in the page text are flagged and not highlighted.

Two ways to connect, chosen in the panel:
- **My Anthropic API key**: stored in that browser only, requests go straight to Anthropic. Good for demos and trials.
- **My server endpoint**: the browser talks to your server, which adds the key. `server/ai-proxy.mjs` is a dependency-free example (`ANTHROPIC_API_KEY=… npm run ai-proxy`); set `VITE_AI_ENDPOINT` to make it the default.

Default model is Claude Opus 5.5 (Sonnet 5.5 and Haiku 4.5 selectable), with server-side refusal fallback enabled and prompt caching on the document so follow-ups are cheaper.

### Live collaboration
**Share > Live session** starts a room. Everyone in it sees each other's cursors and names, and annotations, comments and replies sync instantly. People who join get the PDF sent to them automatically, and undo only reverts your own edits.
- Without a server, sessions connect tabs in the same browser (useful for demos).
- With `server/collab-server.mjs` (`npm run collab-server`, WebSocket on port 8787), sessions work between people anywhere. The server relays messages and remembers each room's document and annotations, so a late joiner gets the current state even if everyone else left. Set `VITE_COLLAB_URL=wss://…` at build time, or enter the server in the Live session dialog (the address is then carried in the invite link). Deployment steps: `gtm/DEPLOY.md` section F.

Keyboard: `V` select · `H` highlight · `U` underline · `K` strike · `P` pen · `R` rectangle · `O` ellipse · `A` arrow · `T` text · `N` note · `G` signature · `⌘Z`/`⇧⌘Z` undo/redo · `⌘F` search · `Del` delete · `Esc` back to select.

## Run it

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in app/dist
```

`dist/` is a static site with relative paths and hash routing, so it can be served from any host or sub-path (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3).

## Things to change before sharing

Everything is in `src/config.ts`:

- `CONTACT.email`: where founding-customer requests go (currently a placeholder, `founders@example.com`).
- `CONTACT.formEndpoint`: set a Formspree/Basin/etc. URL to collect sign-ups without email.
- Both `CONTACT` values can instead come from the `VITE_FORM_ENDPOINT` and `VITE_CONTACT_EMAIL` environment variables at build time, so they can be set in the hosting dashboard. Deploy steps: `gtm/DEPLOY.md`.
- `PLANS` and `FOUNDING_OFFER`: prices, plan features, discount, number of spots.
- `BRAND`: product name. "Margin" is a working name; check trademark availability before using it.

The code sample on the landing page is labelled "API preview". The `@margin/*` npm packages don't exist yet.

## Code map

```
src/viewer/          the SDK itself (could be extracted into a package)
  Viewer.tsx         toolbar, panels, zoom, search, shortcuts, export menu
  PageView.tsx       one page: canvas, text layer, search hits, editors
  AnnotationLayer.tsx SVG annotations + drawing / move / resize interactions
  CommentsPanel.tsx  comment threads
  pdfLoader.ts       loading + importing existing PDF annotations (pdf-lib)
  exportPdf.ts       writing PDF annotations with appearance streams / flattening
  store.ts           annotation state with undo/redo, autosave, remote ops
  share.ts           share-link encoding (deflate + base64url in the URL fragment)
  ShareDialog.tsx    Share link / Live session dialog
  ai/                AI assistant: Anthropic SDK calls (ai.ts) and the panel UI
  collab/            live collaboration: transports (tabs / WebSocket) and useCollab hook
server/              collab-server.mjs (live sessions), ai-proxy.mjs (AI key proxy example)
src/site/            landing page and demo page
scripts/make-sample.mjs  generates public/sample.pdf (fictional contract)
```

## Libraries and licences

pdf.js (Apache-2.0), pdf-lib (MIT), React (MIT), lucide-react (ISC), @anthropic-ai/sdk (MIT), ws (MIT). All allow commercial use.
