/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Form endpoint for founding-customer sign-ups, e.g. https://formspree.io/f/abcdwxyz */
  readonly VITE_FORM_ENDPOINT?: string;
  /** Email address shown on the site and used when no form endpoint is set. */
  readonly VITE_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
