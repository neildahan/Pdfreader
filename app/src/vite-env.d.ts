/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Form endpoint for founding-customer sign-ups, e.g. https://formspree.io/f/abcdwxyz */
  readonly VITE_FORM_ENDPOINT?: string;
  /** Email address shown on the site and used when no form endpoint is set. */
  readonly VITE_CONTACT_EMAIL?: string;
  /** Live collaboration server, e.g. wss://collab.example.com (see server/collab-server.mjs). */
  readonly VITE_COLLAB_URL?: string;
  /** Default AI endpoint that holds the Anthropic key (see server/ai-proxy.mjs). */
  readonly VITE_AI_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
