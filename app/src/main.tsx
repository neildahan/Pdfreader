import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './site/site.css';

try {
  const theme = localStorage.getItem('margin:theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch {
  // Storage blocked: follow the system theme.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
