// Margin live-collaboration server.
//
// A small WebSocket relay: everyone connected to ws://host/room/<id> receives
// everyone else's messages. It also remembers each room's latest annotations and
// document so someone joining after the others left still gets the current state.
//
//   PORT=8787 node server/collab-server.mjs
//
// Point the viewer at it with VITE_COLLAB_URL=wss://your-host (build time) or in
// the Share > Live session dialog. State lives in memory; rooms are dropped an hour
// after the last person leaves.

import http from 'node:http';
import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT || 8787);
const MAX_MESSAGE = 1024 * 1024; // 1 MB per frame (documents arrive in chunks)
const MAX_DOC = 40 * 1024 * 1024; // base64 characters kept per room
const ROOM_TTL = 60 * 60 * 1000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);

/** @type {Map<string, {clients: Set<import('ws').WebSocket>, annotations: Map<string, any>, fp: string|null, name: string|null, doc: {fp: string, name: string, total: number, parts: string[], size: number}|null, emptySince: number|null}>} */
const rooms = new Map();

function room(id) {
  let r = rooms.get(id);
  if (!r) {
    r = { clients: new Set(), annotations: new Map(), fp: null, name: null, doc: null, emptySince: null };
    rooms.set(id, r);
  }
  return r;
}

function upsert(r, a) {
  const cur = r.annotations.get(a.id);
  if (!cur || (a.updatedAt ?? 0) >= (cur.updatedAt ?? 0)) r.annotations.set(a.id, a);
}

/** Switching documents resets the remembered annotations; they belong to the old file. */
function setDoc(r, fp, name) {
  if (!fp || fp === r.fp) return;
  r.fp = fp;
  r.name = name ?? r.name;
  r.annotations.clear();
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end(`Margin collaboration server. ${rooms.size} active room(s).\n`);
});

const wss = new WebSocketServer({ server, maxPayload: MAX_MESSAGE });

wss.on('connection', (ws, req) => {
  if (ALLOWED_ORIGINS.length && !ALLOWED_ORIGINS.includes(req.headers.origin ?? '')) {
    ws.close(1008, 'origin not allowed');
    return;
  }
  const match = /^\/room\/([\w-]{4,64})$/.exec(new URL(req.url ?? '/', 'http://x').pathname);
  if (!match) {
    ws.close(1008, 'use /room/<id>');
    return;
  }
  const r = room(match[1]);
  r.clients.add(ws);
  r.emptySince = null;
  let peerId = null;
  ws.isAlive = true;
  ws.on('pong', () => (ws.isAlive = true));

  ws.send(JSON.stringify({ t: 'state', fp: r.fp, name: r.name, annotations: [...r.annotations.values()], hasDoc: !!(r.doc && r.doc.parts.filter(Boolean).length === r.doc.total) }));

  ws.on('message', (data) => {
    let m;
    try {
      m = JSON.parse(String(data));
    } catch {
      return;
    }
    switch (m.t) {
      case 'hello':
        peerId = m.peer?.id ?? null;
        if (!r.fp) setDoc(r, m.fp, m.name);
        break;
      case 'sync':
        if (m.fp !== r.fp) {
          // Someone who just joined may still be on another file while the room's
          // document is on its way to them; only a person alone can switch it.
          if (r.fp && r.clients.size > 1) break;
          setDoc(r, m.fp, null);
        }
        for (const a of m.annotations ?? []) upsert(r, a);
        break;
      case 'ops':
        if (m.fp !== r.fp) break;
        for (const op of m.ops ?? []) {
          if (op.kind === 'remove') r.annotations.delete(op.id);
          else if (op.kind === 'upsert' && op.annotation?.id) upsert(r, op.annotation);
        }
        break;
      case 'doc-req': {
        const d = r.doc;
        if (d && d.fp === m.fp && d.parts.filter(Boolean).length === d.total) {
          d.parts.forEach((chunk, seq) => ws.send(JSON.stringify({ t: 'doc', id: 'server', fp: d.fp, name: d.name, seq, total: d.total, chunk })));
          return; // served from memory, no need to bother the others
        }
        break;
      }
      case 'doc': {
        if (!r.doc || r.doc.fp !== m.fp) r.doc = { fp: m.fp, name: m.name, total: m.total, parts: [], size: 0 };
        if (r.doc.size + (m.chunk?.length ?? 0) <= MAX_DOC && !r.doc.parts[m.seq]) {
          r.doc.parts[m.seq] = m.chunk;
          r.doc.size += m.chunk.length;
        }
        break;
      }
    }
    const out = String(data);
    for (const c of r.clients) if (c !== ws && c.readyState === c.OPEN) c.send(out);
  });

  ws.on('close', () => {
    r.clients.delete(ws);
    if (peerId) for (const c of r.clients) c.send(JSON.stringify({ t: 'bye', id: peerId }));
    if (!r.clients.size) r.emptySince = Date.now();
  });
});

// Drop dead connections and expired rooms.
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) ws.terminate();
    ws.isAlive = false;
    ws.ping();
  }
  for (const [id, r] of rooms) if (r.emptySince && Date.now() - r.emptySince > ROOM_TTL) rooms.delete(id);
}, 30_000).unref();

server.listen(PORT, () => console.log(`Margin collaboration server on :${PORT}`));
