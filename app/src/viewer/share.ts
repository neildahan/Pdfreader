import type { Annotation } from './types';

// A share link carries the annotations themselves, compressed into the URL
// fragment. Fragments are never sent to a server, so nothing is uploaded.

export type SharedDoc = {
  name: string;
  fingerprint: string;
  /** Set when the PDF is publicly reachable (e.g. the bundled sample), so the link opens it directly. */
  url?: string;
};

export type SharePayload = {
  v: 1;
  doc: SharedDoc;
  from: string;
  annotations: Annotation[];
};

const round = (_key: string, value: unknown) => (typeof value === 'number' && !Number.isInteger(value) ? Math.round(value * 10) / 10 : value);

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodeShare(payload: SharePayload): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(payload, round));
  return toBase64Url(await pipe(json, new CompressionStream('deflate-raw')));
}

export async function decodeShare(token: string): Promise<SharePayload> {
  const json = await pipe(fromBase64Url(token), new DecompressionStream('deflate-raw'));
  const data = JSON.parse(new TextDecoder().decode(json)) as SharePayload;
  if (data?.v !== 1 || !Array.isArray(data.annotations) || !data.doc?.fingerprint) throw new Error('Not a Margin share link');
  return data;
}

/** Link to the full-screen demo with the given route suffix (e.g. `s/<token>` or `live/<room>`). */
export function demoLink(suffix: string): string {
  return `${location.origin}${location.pathname}#/demo/${suffix}`;
}

export function randomId(length = 10): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

/** Links above this size can break in some chat apps and email clients. */
export const LONG_LINK = 8000;
