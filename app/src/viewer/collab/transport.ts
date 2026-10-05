import type { Annotation } from '../types';
import type { RemoteOp } from '../store';

export type Peer = { id: string; name: string; color: string };

/** Everything participants exchange. `fp` is the document fingerprint; edits for another document are ignored. */
export type CollabMsg =
  | { t: 'hello'; peer: Peer; fp: string | null; name?: string }
  | { t: 'here'; peer: Peer; fp: string | null; name?: string; to: string }
  | { t: 'bye'; id: string }
  | { t: 'cursor'; id: string; page: number; x: number; y: number }
  | { t: 'ops'; id: string; fp: string; ops: RemoteOp[] }
  | { t: 'sync'; id: string; fp: string; annotations: Annotation[] }
  | { t: 'doc-req'; id: string; fp: string }
  | { t: 'doc'; id: string; fp: string; name: string; seq: number; total: number; chunk: string }
  /** Sent by the server to a client that just joined: what it remembers about the room. */
  | { t: 'state'; fp: string | null; name: string | null; annotations: Annotation[]; hasDoc: boolean };

export type Status = 'connecting' | 'live' | 'offline';

export interface Transport {
  readonly kind: 'tabs' | 'server';
  send(msg: CollabMsg): void;
  close(): void;
  onMessage: (msg: CollabMsg) => void;
  onStatus: (s: Status) => void;
}

/** Same-browser collaboration between tabs. Needs no server; useful for demos and testing. */
export class TabsTransport implements Transport {
  readonly kind = 'tabs';
  onMessage: (msg: CollabMsg) => void = () => {};
  onStatus: (s: Status) => void = () => {};
  private channel: BroadcastChannel;

  constructor(room: string) {
    this.channel = new BroadcastChannel(`margin-live-${room}`);
    this.channel.onmessage = (e) => this.onMessage(e.data as CollabMsg);
    queueMicrotask(() => this.onStatus('live'));
  }
  send(msg: CollabMsg) {
    this.channel.postMessage(msg);
  }
  close() {
    this.channel.close();
  }
}

/** Real multi-user collaboration through server/collab-server.mjs. Reconnects automatically. */
export class ServerTransport implements Transport {
  readonly kind = 'server';
  onMessage: (msg: CollabMsg) => void = () => {};
  onStatus: (s: Status) => void = () => {};
  private ws: WebSocket | null = null;
  private queue: string[] = [];
  private closed = false;
  private retry = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  /** Called after every (re)connect so the client can re-announce itself. */
  onOpen: () => void = () => {};

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    this.onStatus('connecting');
    const ws = new WebSocket(this.url);
    this.ws = ws;
    ws.onopen = () => {
      this.retry = 0;
      this.onStatus('live');
      this.onOpen();
      for (const m of this.queue.splice(0)) ws.send(m);
    };
    ws.onmessage = (e) => {
      try {
        this.onMessage(JSON.parse(e.data as string) as CollabMsg);
      } catch {
        // Ignore malformed frames.
      }
    };
    ws.onclose = () => {
      if (this.closed) return;
      this.onStatus('offline');
      const delay = Math.min(10_000, 500 * 2 ** this.retry++);
      this.timer = setTimeout(() => this.connect(), delay);
    };
  }

  send(msg: CollabMsg) {
    const data = JSON.stringify(msg);
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(data);
    else if (msg.t !== 'cursor') this.queue.push(data);
  }

  close() {
    this.closed = true;
    if (this.timer) clearTimeout(this.timer);
    this.ws?.close();
  }
}

export function roomUrl(server: string, room: string) {
  const base = server.trim().replace(/\/+$/, '').replace(/^http/, 'ws');
  return `${base}/room/${encodeURIComponent(room)}`;
}
