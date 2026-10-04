import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  FileCheck2,
  Lock,
  MessagesSquare,
  Moon,
  PenTool,
  ScanSearch,
  Sparkles,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import { LazyViewer as Viewer } from './LazyViewer';
import { BRAND, CONTACT, FOUNDING_OFFER, PLANS } from '../config';

const SAMPLE = `${import.meta.env.BASE_URL}sample.pdf`;

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#3b5bdb" />
      <path d="M10 7h8.5L24 12.5V24a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" fill="#fff" />
      <path d="M18.5 7v4a1.5 1.5 0 0 0 1.5 1.5h4" fill="#c5d0fa" />
      <rect x="11" y="16" width="10" height="3.2" rx="1" fill="#ffd43b" />
      <rect x="11" y="21" width="7" height="1.6" rx=".8" fill="#adb5bd" />
    </svg>
  );
}

function getTheme(): 'light' | 'dark' {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme);
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('margin:theme', next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };
  return (
    <button className="icon-btn" onClick={toggle} aria-label="Toggle dark mode">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

const COMPARISON: [string, string, string][] = [
  ['Pricing', 'Quote-only, after sales calls', 'Public price list'],
  ['What it’s based on', 'Your revenue, users or document volume', 'Number of apps. That’s it.'],
  ['Core features', 'Annotations, signatures, redaction sold as add-ons', 'Included in every paid plan'],
  ['Contract', 'Multi-year commitments', 'Annual, cancel any time'],
  ['Renewals', 'Uncapped increases', 'Capped at 5% per year, in writing'],
  ['Time to first render', 'Days of trial paperwork', 'npm install, five minutes'],
];

const FEATURES = [
  { icon: Zap, title: 'Fast, accurate rendering', text: 'Opens large documents instantly with crisp text at any zoom, progressive page loading and a small bundle.' },
  { icon: PenTool, title: 'Every annotation tool', text: 'Highlight, underline, strike, pen, shapes, arrows, text boxes, sticky notes and signatures — with undo, move and resize.' },
  { icon: MessagesSquare, title: 'Comment threads', text: 'Every annotation carries a discussion: replies, resolve and reopen, authors and timestamps.' },
  { icon: FileCheck2, title: 'Acrobat-compatible', text: 'Export real PDF annotations that stay editable in Acrobat, Preview and Chrome — or flatten them. Import existing ones too.' },
  { icon: ScanSearch, title: 'Search & selection', text: 'Full-text search with hit navigation and native text selection across pages.' },
  { icon: Lock, title: 'Documents stay with you', text: 'Everything runs in the browser. Files never touch our servers, which keeps your security review short.' },
];

const FAQ = [
  {
    q: 'Is Margin available today?',
    a: `We’re onboarding a small group of founding customers now. The viewer on this page is the real core. Founding customers lock in ${FOUNDING_OFFER.discount} with a ${FOUNDING_OFFER.deposit}; your plan only starts when you ship to production.`,
  },
  {
    q: 'What does “honest pricing” mean?',
    a: 'One public price per plan. No per-document or per-user metering, no revenue questionnaires, no surprise add-ons, annual terms and renewals capped at 5%.',
  },
  {
    q: 'How do you compare with Apryse or Nutrient?',
    a: 'They are mature, broad platforms and a great fit if you need everything — Office conversion, dozens of platforms, server SDKs. Margin focuses on the part most product teams actually ship: viewing, annotation, review and signatures on the web, done really well, at a price you can see.',
  },
  {
    q: 'Do our documents leave our infrastructure?',
    a: 'No. Rendering, annotation and export all happen client-side. You store annotations wherever you like — as JSON in your database or inside the PDF.',
  },
  {
    q: 'Which frameworks are supported?',
    a: 'React, Vue, Angular and plain JavaScript on the web. React Native and Flutter wrappers are on the roadmap for founding customers.',
  },
  {
    q: 'What if it doesn’t work out?',
    a: 'Your deposit is fully refundable until you go to production. No questions asked.',
  },
];

const CODE: Record<string, string> = {
  React: `import { MarginViewer } from '@margin/react';

export function ContractReview({ url, user }) {
  return (
    <MarginViewer
      document={url}
      author={user.name}
      tools={['highlight', 'note', 'signature']}
      onAnnotationsChange={(list) => save(list)}
    />
  );
}`,
  JavaScript: `import Margin from '@margin/viewer';

const viewer = await Margin.mount('#viewer', {
  document: '/contracts/msa.pdf',
  author: 'Dana Levi',
});

viewer.on('annotation:add', (a) => api.save(a));
const pdf = await viewer.export({ annotations: 'editable' });`,
};

function Section({ id, eyebrow, title, sub, children }: { id?: string; eyebrow?: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="section">
      <div className="container">
        <div className="section-head">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          {sub && <p className="lead">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

type FormState = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

function FoundingForm() {
  const [state, setState] = useState<FormState>('idle');
  const [plan, setPlan] = useState('Business');

  useEffect(() => {
    const on = (e: Event) => setPlan((e as CustomEvent<string>).detail);
    window.addEventListener('margin:plan', on);
    return () => window.removeEventListener('margin:plan', on);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (CONTACT.formEndpoint) {
      setState('sending');
      try {
        const res = await fetch(CONTACT.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        setState(res.ok ? 'sent' : 'error');
      } catch {
        setState('error');
      }
      return;
    }
    const body = Object.entries(data)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Founding customer — ${data.company || data.name}`)}&body=${encodeURIComponent(body)}`;
    setState('mailto');
  }

  if (state === 'sent' || state === 'mailto') {
    return (
      <div className="form-done">
        <div className="form-done-icon">
          <Check size={26} />
        </div>
        <h3>{state === 'sent' ? 'You’re on the list.' : 'Almost there — send the email that just opened.'}</h3>
        <p>We’ll reply within one business day with onboarding details and a deposit link. Founding pricing is locked from today.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Name
          <input name="name" required autoComplete="name" placeholder="Dana Levi" />
        </label>
        <label>
          Work email
          <input name="email" type="email" required autoComplete="email" placeholder="dana@company.com" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Company
          <input name="company" required autoComplete="organization" placeholder="Acme Legal" />
        </label>
        <label>
          Plan
          <select name="plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
            {PLANS.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          What do you use today?
          <select name="current" defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            <option>Apryse / PDFTron</option>
            <option>Nutrient / PSPDFKit</option>
            <option>Foxit</option>
            <option>PDF.js or another open-source library</option>
            <option>Built in-house</option>
            <option>Nothing yet</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          <span>
            Yearly spend today <span className="optional">optional</span>
          </span>
          <input name="currentSpend" placeholder="e.g. $28,000" />
        </label>
      </div>
      <label>
        <span>
          What are you building? <span className="optional">optional</span>
        </span>
        <textarea name="useCase" rows={3} placeholder="Contract review in our legal platform, ~2,000 users…" />
      </label>
      <button className="btn btn-primary btn-lg" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Reserve my founding spot'} <ArrowRight size={18} />
      </button>
      {state === 'error' && <p className="form-error">Something went wrong. Email us at {CONTACT.email}.</p>}
      <p className="form-fine">
        {FOUNDING_OFFER.deposit} after a short call. {FOUNDING_OFFER.discount}. Only {FOUNDING_OFFER.spots} spots.
      </p>
    </form>
  );
}

export function Landing() {
  const [tab, setTab] = useState<keyof typeof CODE>('React');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // "#/pricing" style links scroll to the matching section.
  useEffect(() => {
    const go = () => {
      const id = window.location.hash.replace(/^#\/?/, '');
      if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
    };
    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, []);

  const choosePlan = (name: string) => {
    window.dispatchEvent(new CustomEvent('margin:plan', { detail: name }));
    document.getElementById('founding')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="site">
      <nav className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#/" className="brand">
            <Logo />
            <span>{BRAND.name}</span>
          </a>
          <div className="nav-links">
            <a href="#/demo">Demo</a>
            <a href="#/features">Features</a>
            <a href="#/developers">Developers</a>
            <a href="#/pricing">Pricing</a>
            <a href="#/faq">FAQ</a>
          </div>
          <div className="nav-cta">
            <ThemeToggle />
            <a href="#/founding" className="btn btn-primary btn-sm">
              Get founding price
            </a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-glow" aria-hidden />
        <div className="container hero-inner">
          <a href="#/founding" className="pill">
            <Sparkles size={14} /> Founding customers get {FOUNDING_OFFER.discount} <ArrowRight size={14} />
          </a>
          <h1>
            The PDF SDK with
            <br />
            <span className="marker">honest pricing</span>.
          </h1>
          <p className="hero-sub">
            Drop-in PDF viewing, annotation, comments and signatures for your web app. One public price per plan — no document metering, no revenue audits,
            no add-on maze.
          </p>
          <div className="hero-ctas">
            <a href="#/demo" className="btn btn-primary btn-lg">
              Open the full demo <ArrowRight size={18} />
            </a>
            <a href="#/pricing" className="btn btn-secondary btn-lg">
              See pricing
            </a>
          </div>
          <ul className="hero-points">
            <li>
              <Check size={15} /> Unlimited users & documents
            </li>
            <li>
              <Check size={15} /> Annual terms, capped renewals
            </li>
            <li>
              <Check size={15} /> Files never leave the browser
            </li>
          </ul>
        </div>
        <div className="container">
          <div className="window">
            <div className="window-bar">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <span className="window-title">This is the real SDK — select some text and highlight it.</span>
              <a href="#/demo" className="window-link">
                Full screen <ArrowRight size={13} />
              </a>
            </div>
            <div className="window-body">
              <Viewer src={SAMPLE} compact author="Guest reviewer" />
            </div>
          </div>
        </div>
      </header>

      <Section id="why" eyebrow="Why teams switch" title="Buying a PDF SDK shouldn’t take a procurement cycle." sub="The big vendors build excellent technology. Their pricing is the problem. We fixed the pricing.">
        <div className="compare">
          <div className="compare-row compare-head">
            <span />
            <span>Typical enterprise PDF SDK</span>
            <span className="compare-us">
              <Logo size={18} /> {BRAND.name}
            </span>
          </div>
          {COMPARISON.map(([k, them, us]) => (
            <div className="compare-row" key={k}>
              <span className="compare-key">{k}</span>
              <span className="compare-them">
                <X size={15} /> {them}
              </span>
              <span className="compare-us">
                <Check size={15} /> {us}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="features" eyebrow="Features" title="Everything your users need to review documents." sub="The core of document workflows in legal, construction, insurance and healthcare — built for the web.">
        <div className="features">
          {FEATURES.map((f) => (
            <div className="feature" key={f.title}>
              <div className="feature-icon">
                <f.icon size={20} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="developers" eyebrow="Developers" title="Five minutes from npm install to annotated PDF." sub="Typed APIs, framework components and events for every change, so you can store annotations wherever you want.">
        <div className="dev">
          <div className="code-card">
            <div className="code-tabs">
              {Object.keys(CODE).map((k) => (
                <button key={k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k as keyof typeof CODE)}>
                  {k}
                </button>
              ))}
              <span className="code-badge">API preview</span>
            </div>
            <pre>
              <code>{CODE[tab]}</code>
            </pre>
          </div>
          <ul className="dev-points">
            <li>
              <Code2 size={18} />
              <div>
                <strong>Framework-native</strong>
                <span>React, Vue, Angular and vanilla JS. Full TypeScript types.</span>
              </div>
            </li>
            <li>
              <FileCheck2 size={18} />
              <div>
                <strong>Open formats</strong>
                <span>Annotations as JSON or standard PDF annotations. No lock-in.</span>
              </div>
            </li>
            <li>
              <Lock size={18} />
              <div>
                <strong>Client-side by default</strong>
                <span>No document upload, no telemetry on content.</span>
              </div>
            </li>
          </ul>
        </div>
      </Section>

      <Section id="pricing" eyebrow="Pricing" title="Prices you can read. On a website. Today." sub="Billed annually in USD. Unlimited users and documents on every paid plan.">
        <div className="founding-banner">
          <Sparkles size={18} />
          <span>
            <strong>Founding customers:</strong> {FOUNDING_OFFER.discount} on Startup and Business. {FOUNDING_OFFER.spots} spots.
          </span>
          <a href="#/founding">Reserve →</a>
        </div>
        <div className="plans">
          {PLANS.map((p) => (
            <div className={`plan ${p.highlight ? 'is-highlight' : ''}`} key={p.name}>
              {p.highlight && <span className="plan-badge">Most popular</span>}
              <h3>{p.name}</h3>
              <div className="plan-price">
                <span>{p.price}</span>
                <small>{p.period}</small>
              </div>
              <p className="plan-blurb">{p.blurb}</p>
              <button className={`btn ${p.highlight ? 'btn-primary' : 'btn-secondary'} btn-block`} onClick={() => choosePlan(p.name)}>
                {p.cta}
              </button>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>
                    <Check size={15} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <section id="founding" className="section founding">
        <div className="container founding-inner">
          <div className="founding-copy">
            <span className="eyebrow">Founding customers</span>
            <h2>Lock in {FOUNDING_OFFER.discount}.</h2>
            <p className="lead">We’re working closely with a small group of teams to shape the roadmap. You get our engineers on Slack, input into priorities, and a price that never goes up.</p>
            <ul className="founding-list">
              <li>
                <Check size={16} /> {FOUNDING_OFFER.deposit} — your plan starts when you go live
              </li>
              <li>
                <Check size={16} /> Direct Slack channel with the engineering team
              </li>
              <li>
                <Check size={16} /> Vote on the roadmap: mobile, forms, redaction, collaboration
              </li>
            </ul>
          </div>
          <div className="founding-form">
            <FoundingForm />
          </div>
        </div>
      </section>

      <Section id="faq" eyebrow="FAQ" title="Questions, answered plainly.">
        <div className="faq">
          {FAQ.map((f, i) => (
            <div className={`faq-item ${openFaq === i ? 'is-open' : ''}`} key={f.q}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                {f.q}
                <ChevronDown size={18} />
              </button>
              {openFaq === i && <p>{f.a}</p>}
            </div>
          ))}
        </div>
      </Section>

      <footer className="footer">
        <div className="container footer-inner">
          <a href="#/" className="brand">
            <Logo size={22} />
            <span>{BRAND.name}</span>
          </a>
          <span className="footer-note">© {new Date().getFullYear()} {BRAND.name}. Apryse and Nutrient are trademarks of their respective owners.</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
      </footer>
    </div>
  );
}
