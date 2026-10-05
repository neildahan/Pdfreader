import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Link2, ListChecks, Loader2, Lock, Radio, Users, X } from 'lucide-react';
import { LONG_LINK } from './share';
import type { Peer, Status } from './collab/transport';
import { Avatar } from './CommentsPanel';

/** What a share link contains. */
export type ShareScope = 'selected' | 'shared' | 'all';

type Props = {
  docName: string;
  /** True when recipients can open the PDF from the link itself (e.g. the sample). */
  docIsPublic: boolean;
  counts: Record<ShareScope, number>;
  scope: ShareScope;
  onScope: (s: ShareScope) => void;
  createLink: (scope: ShareScope) => Promise<string>;
  live: { room: string | null; status: Status; peers: Peer[]; kind: 'tabs' | 'server'; link: string | null; receiving: { name: string; pct: number } | null };
  server: string;
  onServer: (url: string) => void;
  onStartLive: () => void;
  onStopLive: () => void;
  initialTab: 'link' | 'live';
  onClose: () => void;
};

function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      ref.current?.select();
    }
  };
  return (
    <div className="mg-copy">
      <input ref={ref} readOnly value={value} onFocus={(e) => e.currentTarget.select()} aria-label="Link" />
      <button className="mg-btn primary sm" onClick={copy}>
        {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export function ShareDialog(p: Props) {
  const [tab, setTab] = useState<'link' | 'live'>(p.initialTab);
  const [link, setLink] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  const count = p.counts[p.scope];
  useEffect(() => {
    if (tab !== 'link' || !count) return;
    let cancelled = false;
    setLink(null);
    setLinkError(null);
    p.createLink(p.scope).then(
      (l) => !cancelled && setLink(l),
      () => !cancelled && setLinkError('Could not create the link in this browser.'),
    );
    return () => {
      cancelled = true;
    };
    // Regenerate when the scope or the number of annotations in it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, p.scope, count]);

  const scopes: { id: ShareScope; icon: typeof Users; label: string; hint: string }[] = [
    { id: 'selected', icon: ListChecks, label: `Selected annotations (${p.counts.selected})`, hint: p.counts.selected ? 'Only the ones you checked. They become Shared.' : 'Use the checklist button in Comments to pick some.' },
    { id: 'shared', icon: Users, label: `Shared annotations (${p.counts.shared})`, hint: 'Everything marked Shared. Private notes stay out.' },
    { id: 'all', icon: Lock, label: `Everything (${p.counts.all})`, hint: 'Includes your private notes.' },
  ];

  return (
    <div className="mg-modal-backdrop" onPointerDown={p.onClose}>
      <div className="mg-modal mg-share" onPointerDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <div className="mg-modal-head">
          <h3>Share</h3>
          <button className="mg-icon-btn" onClick={p.onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="mg-segmented mg-share-tabs">
          <button className={tab === 'link' ? 'is-active' : ''} onClick={() => setTab('link')}>
            <Link2 size={14} /> Share link
          </button>
          <button className={tab === 'live' ? 'is-active' : ''} onClick={() => setTab('live')}>
            <Radio size={14} /> Live session {p.live.room && <span className="mg-live-dot" />}
          </button>
        </div>

        {tab === 'link' && (
          <div className="mg-share-body">
            <div className="mg-scopes" role="radiogroup" aria-label="What to share">
              {scopes.map((s) => (
                <label key={s.id} className={`mg-scope ${p.scope === s.id ? 'is-on' : ''} ${p.counts[s.id] ? '' : 'is-empty'}`}>
                  <input type="radio" name="mg-scope" checked={p.scope === s.id} onChange={() => p.onScope(s.id)} />
                  <s.icon size={15} />
                  <span>
                    <strong>{s.label}</strong>
                    <small>{s.hint}</small>
                  </span>
                </label>
              ))}
            </div>
            {count === 0 ? (
              <p className="mg-share-note">
                {p.scope === 'selected'
                  ? 'Nothing selected yet. Close this, tap the checklist button in Comments, and pick the annotations to send.'
                  : 'No annotations are marked Shared yet. Click the Private badge on an annotation to share it, or pick “Selected”.'}
              </p>
            ) : link ? (
              <CopyField value={link} />
            ) : linkError ? (
              <p className="mg-ai-error">{linkError}</p>
            ) : (
              <p className="mg-ai-thinking">
                <Loader2 size={14} className="spin" /> Creating link…
              </p>
            )}
            <p className="mg-ai-muted">The annotations and their comment threads travel inside the link, so nothing is uploaded. Recipients can add their own and share back.</p>
            {!p.docIsPublic && (
              <p className="mg-share-note">
                The PDF itself isn't in the link. Recipients open the link, then open their copy of <strong>{p.docName}</strong>, and your annotations appear on it.
                To send the file too, use a live session.
              </p>
            )}
            {link && link.length > LONG_LINK && <p className="mg-share-note warn">This link is long ({Math.round(link.length / 1000)}k characters). Some email and chat apps cut long links; if that happens, use Export → Annotations as JSON instead.</p>}
          </div>
        )}

        {tab === 'live' && (
          <div className="mg-share-body">
            {!p.live.room ? (
              <>
                <p>Review together in real time. Everyone sees each other's cursors, and annotations marked Shared appear for everyone as they happen. Your private notes stay on this device. People who join get the document automatically.</p>
                <label className="mg-ai-field">
                  Collaboration server <span className="mg-ai-muted">optional</span>
                  <input className="mg-input" placeholder="wss://collab.your-app.com" value={p.server} onChange={(e) => p.onServer(e.target.value)} />
                </label>
                {!p.server && <p className="mg-share-note">Without a server, a live session connects tabs in this browser only, which is handy for trying it out. Run <code>server/collab-server.mjs</code> to collaborate with other people.</p>}
                <button className="mg-btn primary" onClick={p.onStartLive}>
                  <Radio size={16} /> Start live session
                </button>
              </>
            ) : (
              <>
                <div className="mg-live-status">
                  <span className={`mg-status-dot ${p.live.status}`} />
                  {p.live.status === 'live' ? 'Live' : p.live.status === 'connecting' ? 'Connecting…' : 'Reconnecting…'}
                  <span className="mg-ai-muted">· {p.live.kind === 'server' ? 'via server' : 'tabs in this browser'}</span>
                </div>
                {p.live.link && <CopyField value={p.live.link} />}
                <p className="mg-share-note">
                  Others see your {p.counts.shared} Shared annotation{p.counts.shared === 1 ? '' : 's'}. {p.counts.all - p.counts.shared === 1 ? '1 private note stays' : `${p.counts.all - p.counts.shared} private notes stay`} on this device.
                </p>
                {p.live.receiving && (
                  <p className="mg-ai-thinking">
                    <Loader2 size={14} className="spin" /> Receiving {p.live.receiving.name}… {p.live.receiving.pct}%
                  </p>
                )}
                <div className="mg-live-people">
                  <Users size={15} />
                  {p.live.peers.length ? (
                    p.live.peers.map((peer) => (
                      <span key={peer.id} className="mg-live-person" style={{ ['--peer' as string]: peer.color }}>
                        <Avatar name={peer.name} /> {peer.name}
                      </span>
                    ))
                  ) : (
                    <span className="mg-ai-muted">Waiting for others to join. Send them the link.</span>
                  )}
                </div>
                <button className="mg-btn" onClick={p.onStopLive}>
                  Leave session
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
