import { ArrowLeft } from 'lucide-react';
import { Viewer } from '../viewer/Viewer';
import { BRAND } from '../config';
import { Logo, ThemeToggle } from './Landing';

const SAMPLE = `${import.meta.env.BASE_URL}sample.pdf`;

export function DemoPage() {
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
        <Viewer src={SAMPLE} />
      </div>
    </div>
  );
}
