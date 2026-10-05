// Example AI endpoint for Margin's "My server endpoint" mode.
//
// The viewer's AI assistant sends standard Anthropic Messages API requests to
// <endpoint>/v1/messages. This server adds your API key and forwards them, so the
// key never reaches your users' browsers. Put your own auth check where marked.
//
//   ANTHROPIC_API_KEY=sk-ant-... ALLOWED_ORIGIN=https://your-app.com node server/ai-proxy.mjs
//
// Then set the viewer's endpoint to http://localhost:8788 (or your deployed URL).
// No dependencies: Node 18+ only.

import http from 'node:http';

const PORT = Number(process.env.PORT || 8788);
const KEY = process.env.ANTHROPIC_API_KEY;
const ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const MODELS = new Set(['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-4-5']);

if (!KEY) {
  console.error('Set ANTHROPIC_API_KEY');
  process.exit(1);
}

const cors = {
  'access-control-allow-origin': ORIGIN,
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': '*',
  'access-control-max-age': '86400',
};

http
  .createServer(async (req, res) => {
    if (req.method === 'OPTIONS') return res.writeHead(204, cors).end();
    if (req.method !== 'POST' || !req.url?.startsWith('/v1/messages')) return res.writeHead(404, cors).end();

    // >>> Your auth check goes here, e.g. verify a session cookie or bearer token. <<<

    const chunks = [];
    for await (const c of req) chunks.push(c);
    let body;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return res.writeHead(400, cors).end('invalid JSON');
    }
    if (!MODELS.has(body.model)) return res.writeHead(400, cors).end('model not allowed');

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': KEY,
        'anthropic-version': req.headers['anthropic-version'] || '2023-06-01',
        ...(req.headers['anthropic-beta'] ? { 'anthropic-beta': req.headers['anthropic-beta'] } : {}),
      },
      body: JSON.stringify(body),
    });

    res.writeHead(upstream.status, { ...cors, 'content-type': upstream.headers.get('content-type') || 'application/json' });
    // Stream the response through as it arrives (the viewer uses streaming).
    for await (const chunk of upstream.body) res.write(chunk);
    res.end();
  })
  .listen(PORT, () => console.log(`Margin AI proxy on :${PORT}`));
