import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built site works from any static host or sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  // The viewer chunk is mostly pdf.js and is lazy-loaded.
  build: { chunkSizeWarningLimit: 1500 },
});
