import { ArrowLeft } from 'lucide-react';
import { LazyViewer as Viewer } from './LazyViewer';
import { BRAND } from '../config';
import { Logo, ThemeToggle } from './Landing';

const SAMPLE = `${import.meta.env.BASE_URL}sample.pdf`;

// #/demo/s/<token> opens a share link; #/demo/live/<room> joins a live session.
// A live link may carry the collaboration server after "~" (base64url), so invitees connect to the same one.
function readLink(): { share?: string; room?: string; server?: string; key: string } {
  const m = /^#\/?demo\/(s|live)\/([^/?#]+)/.exec(window.location.hash);
  if (!m) return { key: 'demo' };
  if (m[1] === 's') return { share: m[2], key: `s-${m[2].slice(0, 24)}` };
  const [room, srv] = m[2].split('~');
  let server: string | undefined;
  try {
    server = srv ? atob(srv.replace(/-/g, '+').replace(/_/g, '/')) : undefined;
  } catch {
    server = undefined;
  }
  return { room, server, key: `live-${room}` };
}

export function DemoPage() {
  const link = readLink();
  return (
    <div className="demo-page">
      <div className="demo-bar">
        <a href="#/" className="demo-back">
          <ArrowLeft size={16} />
          <Logo />
          <span className="demo-brand">{BRAND.name}</span>
          <span className="demo-tag">Live demo</span>
        </a>
        <div className="demo-bar-right">
          <span className="demo-note">Drop in your own PDF. Nothing leaves your browser.</span>
          <ThemeToggle />
          <a href="#/pricing" className="btn btn-primary btn-sm">
            See pricing
          </a>
        </div>
      </div>
      <div className="demo-frame">
        <Viewer key={link.key} src={SAMPLE} share={link.share} room={link.room} collabServer={link.server} />
      </div>
    </div>
  );
}
