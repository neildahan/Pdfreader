import { useEffect, useState } from 'react';
import { Landing } from './site/Landing';
import { DemoPage } from './site/DemoPage';

// Hash routing keeps the build deployable to any static host without rewrites.
function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, '') || '/');
  useEffect(() => {
    const on = () => setRoute(window.location.hash.replace(/^#/, '') || '/');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function App() {
  const route = useRoute();
  if (route.startsWith('/demo')) return <DemoPage />;
  return <Landing />;
}
