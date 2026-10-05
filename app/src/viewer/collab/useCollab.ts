import { useCallback, useEffect, useRef, useState } from 'react';
import type { Annotation } from '../types';
import type { AnnAction, AnnState, RemoteOp } from '../store';
import { roomUrl, ServerTransport, TabsTransport, type CollabMsg, type Peer, type Status, type Transport } from './transport';
import { randomId } from '../share';

export type Cursor = { peer: Peer; page: number; x: number; y: number; at: number };

const COLORS = ['#E8590C', '#2F9E44', '#1971C2', '#C2255C', '#7048E8', '#0C8599', '#E67700'];
const CHUNK = 192 * 1024; // characters of base64 per message

function colorFor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return COLORS[Math.abs(h) % COLORS.length];
}

function toBase64(bytes: Uint8Array) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function fromBase64(b64: string) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export const COLLAB_SERVER = import.meta.env.VITE_COLLAB_URL?.trim() || '';

type Options = {
  room: string | null;
  server: string;
  name: string;
  doc: { fingerprint: string; name: string; bytes: Uint8Array } | null;
  ann: AnnState;
  dispatch: (a: AnnAction) => void;
  /** Called when another participant sends us the document they're looking at. */
  onDoc: (bytes: Uint8Array, name: string) => void;
};

export function useCollab({ room, server, name, doc, ann, dispatch, onDoc }: Options) {
  const [status, setStatus] = useState<Status>('offline');
  const [peers, setPeers] = useState<Peer[]>([]);
  const [cursors, setCursors] = useState<Map<string, Cursor>>(new Map());
  const [receiving, setReceiving] = useState<{ name: string; pct: number } | null>(null);
  const transport = useRef<Transport | null>(null);
  const me = useRef<Peer>({ id: randomId(8), name, color: '' });
  me.current.name = name;
  if (!me.current.color) me.current.color = colorFor(me.current.id);

  // Latest values for the message handler without reconnecting on every render.
  const latest = useRef({ doc, ann, onDoc });
  latest.current = { doc, ann, onDoc };
  const incoming = useRef<{ fp: string; name: string; parts: string[]; total: number } | null>(null);
  const lastSent = useRef<Annotation[] | null>(null);
  /** What the server last told us about the room's document. */
  const roomDoc = useRef<{ fp: string | null; hasDoc: boolean }>({ fp: null, hasDoc: false });
  /** Fingerprint of a document we received from the session (opening it isn't a "switch"). */
  const adopted = useRef<string | null>(null);
  const prevFp = useRef<string | null>(null);

  const peersRef = useRef(peers);
  peersRef.current = peers;
  const send = useCallback((m: CollabMsg) => transport.current?.send(m), []);

  const sendDoc = useCallback(() => {
    const d = latest.current.doc;
    if (!d) return;
    const b64 = toBase64(d.bytes);
    const total = Math.max(1, Math.ceil(b64.length / CHUNK));
    for (let seq = 0; seq < total; seq++) send({ t: 'doc', id: me.current.id, fp: d.fingerprint, name: d.name, seq, total, chunk: b64.slice(seq * CHUNK, (seq + 1) * CHUNK) });
  }, [send]);

  const announce = useCallback(
    (switching = false) => {
      const d = latest.current.doc;
      const mine = d?.fingerprint ?? null;
      send({ t: 'hello', peer: me.current, fp: mine, name: d?.name, ...(switching ? { switch: true } : {}) });
      if (!d) return;
      const room = roomDoc.current;
      // The room is on another document: adopt it instead of pushing ours.
      if (room.fp && room.fp !== mine && !switching) {
        if (room.hasDoc && !incoming.current) send({ t: 'doc-req', id: me.current.id, fp: room.fp });
        return;
      }
      send({ t: 'sync', id: me.current.id, fp: mine!, annotations: latest.current.ann.annotations, ...(switching ? { switch: true } : {}) });
      // Give the server a copy so people joining later get the file even if we've left.
      if (transport.current?.kind === 'server' && !(room.fp === mine && room.hasDoc)) {
        sendDoc();
        roomDoc.current = { fp: mine, hasDoc: true };
      }
    },
    [send, sendDoc],
  );

  useEffect(() => {
    if (!room) return;
    const t: Transport = server ? new ServerTransport(roomUrl(server, room)) : new TabsTransport(room);
    transport.current = t;
    t.onStatus = setStatus;
    // With a server, wait for its 'state' message (what it knows about the room) before announcing.
    if (!(t instanceof ServerTransport)) queueMicrotask(() => announce());

    t.onMessage = (m) => {
      const { doc: d } = latest.current;
      const mine = d?.fingerprint ?? null;
      switch (m.t) {
        case 'hello':
        case 'here': {
          if (m.t === 'here' && m.to !== me.current.id) return;
          setPeers((ps) => [...ps.filter((p) => p.id !== m.peer.id), m.peer]);
          if (m.t === 'hello') {
            send({ t: 'here', peer: me.current, fp: mine, name: d?.name, to: m.peer.id });
            if (d && m.fp === mine) send({ t: 'sync', id: me.current.id, fp: d.fingerprint, annotations: latest.current.ann.annotations });
          }
          // Newcomers adopt the document of people already here; a deliberate switch moves everyone.
          const follow = m.t === 'here' || (m.t === 'hello' && m.switch);
          if (follow && m.fp && m.fp !== mine && !incoming.current) send({ t: 'doc-req', id: me.current.id, fp: m.fp });
          return;
        }
        case 'state':
          roomDoc.current = { fp: m.fp, hasDoc: m.hasDoc };
          if (m.annotations.length && m.fp === mine) dispatch({ type: 'remote', ops: m.annotations.map((annotation) => ({ kind: 'upsert', annotation })) });
          announce();
          return;
        case 'bye':
          setPeers((ps) => ps.filter((p) => p.id !== m.id));
          setCursors((cs) => {
            const next = new Map(cs);
            next.delete(m.id);
            return next;
          });
          return;
        case 'cursor':
          setCursors((cs) => {
            const peer = peersRef.current.find((p) => p.id === m.id);
            if (!peer) return cs;
            const next = new Map(cs);
            if (m.page < 0) next.delete(m.id);
            else next.set(m.id, { peer, page: m.page, x: m.x, y: m.y, at: Date.now() });
            return next;
          });
          return;
        case 'ops':
          if (m.fp === mine) dispatch({ type: 'remote', ops: m.ops });
          return;
        case 'sync':
          if (m.fp === mine && m.annotations.length) dispatch({ type: 'remote', ops: m.annotations.map((annotation) => ({ kind: 'upsert', annotation })) });
          return;
        case 'doc-req':
          if (d && m.fp === mine) sendDoc();
          return;
        case 'doc': {
          if (m.fp === mine) return;
          if (!incoming.current || incoming.current.fp !== m.fp) incoming.current = { fp: m.fp, name: m.name, parts: [], total: m.total };
          const inc = incoming.current;
          inc.parts[m.seq] = m.chunk;
          const have = inc.parts.filter(Boolean).length;
          setReceiving({ name: m.name, pct: Math.round((have / inc.total) * 100) });
          if (have === inc.total) {
            incoming.current = null;
            setReceiving(null);
            adopted.current = inc.fp;
            roomDoc.current = { fp: inc.fp, hasDoc: true };
            latest.current.onDoc(fromBase64(inc.parts.join('')), inc.name);
          }
          return;
        }
      }
    };

    const leave = () => t.send({ t: 'bye', id: me.current.id });
    window.addEventListener('pagehide', leave);
    return () => {
      leave();
      window.removeEventListener('pagehide', leave);
      t.close();
      transport.current = null;
      setPeers([]);
      setCursors(new Map());
      setStatus('offline');
    };
  }, [room, server, announce, dispatch, send, sendDoc]);

  // When our document changes (opened a file, or received one), re-announce so others can sync with us.
  const fp = doc?.fingerprint;
  useEffect(() => {
    const before = prevFp.current;
    prevFp.current = fp ?? null;
    // Opening a different file mid-session (not one received from the session) moves everyone to it.
    const switching = !!before && !!fp && fp !== before && fp !== adopted.current;
    if (switching) roomDoc.current = { fp: null, hasDoc: false };
    if (room && fp && transport.current) announce(switching);
    // New baseline: annotations loaded with the document aren't "edits" to broadcast.
    lastSent.current = latest.current.ann.annotations;
  }, [fp, room, announce]);

  // Broadcast local edits as minimal upsert/remove ops.
  useEffect(() => {
    const prev = lastSent.current;
    lastSent.current = ann.annotations;
    if (!room || !doc || !prev || ann.source !== 'local') return;
    const before = new Map(prev.map((a) => [a.id, a]));
    const now = new Set(ann.annotations.map((a) => a.id));
    const ops: RemoteOp[] = [];
    for (const a of ann.annotations) if (before.get(a.id) !== a) ops.push({ kind: 'upsert', annotation: a });
    for (const a of prev) if (!now.has(a.id)) ops.push({ kind: 'remove', id: a.id });
    if (ops.length) send({ t: 'ops', id: me.current.id, fp: doc.fingerprint, ops });
  }, [ann, room, doc, send]);

  // Tell others when our display name changes.
  const named = useRef(name);
  useEffect(() => {
    if (!room || named.current === name) return;
    const t = setTimeout(() => {
      named.current = name;
      send({ t: 'hello', peer: me.current, fp: latest.current.doc?.fingerprint ?? null, name: latest.current.doc?.name });
    }, 600);
    return () => clearTimeout(t);
  }, [name, room, send]);

  // Drop cursors that went quiet.
  useEffect(() => {
    if (!room) return;
    const iv = setInterval(() => {
      setCursors((cs) => {
        const stale = [...cs.values()].filter((c) => Date.now() - c.at > 15_000);
        if (!stale.length) return cs;
        const next = new Map(cs);
        stale.forEach((c) => next.delete(c.peer.id));
        return next;
      });
    }, 5000);
    return () => clearInterval(iv);
  }, [room]);

  const lastCursor = useRef(0);
  const sendCursor = useCallback(
    (page: number, x: number, y: number) => {
      if (!room) return;
      const now = performance.now();
      if (page >= 0 && now - lastCursor.current < 40) return;
      lastCursor.current = now;
      send({ t: 'cursor', id: me.current.id, page, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    },
    [room, send],
  );

  return { status, peers, cursors, sendCursor, receiving, me: me.current, kind: transport.current?.kind ?? (server ? 'server' : 'tabs') };
}
