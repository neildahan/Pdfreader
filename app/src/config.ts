// Everything a non-developer may want to change lives here.

export const BRAND = {
  name: 'Margin',
  tagline: 'The PDF SDK with honest pricing',
};

/**
 * Where founding-customer requests go. With `formEndpoint` set (e.g. a Formspree
 * or Basin URL) the form posts there; otherwise it opens an email to `email`.
 */
export const CONTACT = {
  email: 'founders@example.com',
  formEndpoint: '',
};

export type Plan = {
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    name: 'Developer',
    price: '$0',
    period: 'forever',
    blurb: 'Build and test locally. No credit card, no sales call.',
    features: ['Full SDK in development', 'All annotation tools', 'Watermark in production', 'Community support'],
    cta: 'Start building',
  },
  {
    name: 'Startup',
    price: '$5,000',
    period: 'per year',
    blurb: 'For one production app. Buy it online in two minutes.',
    features: ['1 production app', 'Unlimited users & documents', 'Annotations, comments, signatures', 'Email support, 2 business days'],
    cta: 'Reserve founding price',
  },
  {
    name: 'Business',
    price: '$12,000',
    period: 'per year',
    blurb: 'Everything most teams need, with a real support SLA.',
    features: ['Up to 3 production apps', 'Unlimited users & documents', 'Redaction & forms', 'Priority support, 1 business day', 'Security review package'],
    cta: 'Reserve founding price',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$25k+',
    period: 'per year',
    blurb: 'Self-hosted collaboration, SSO and procurement paperwork.',
    features: ['Unlimited apps', 'Real-time collaboration server', 'SOC 2 report, DPA, custom terms', 'Dedicated engineer & SLA'],
    cta: 'Talk to us',
  },
];

export const FOUNDING_OFFER = {
  discount: '50% off for life',
  deposit: '$500 refundable deposit',
  spots: 20,
};
