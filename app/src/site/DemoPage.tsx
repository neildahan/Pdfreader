import { ArrowLeft } from 'lucide-react';
import { LazyViewer as Viewer } from './LazyViewer';
import { BRAND } from '../config';
import { Logo, ThemeToggle } from './Landing';

const SAMPLE = `${import.meta.env.BASE_URL}sample.pdf`;

// #/demo/s/<token> opens a share link; #/demo/live/<room> joins a live session.
function readLink(): { share?: string; room?: string; key: string } {
  const m = /^#\/?demo\/(s|live)\/([^/?#]+)/.exec(window.location.hash);
  if (!m) return { key: 'demo' };
  return m[1] === 's' ? { share: m[2], key: `s-${m[2].slice(0, 24)}` } : { room: m[2], key: `live-${m[2]}` };
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
        <Viewer key={link.key} src={SAMPLE} share={link.share} room={link.room} />
      </div>
    </div>
  );
}
