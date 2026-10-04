import { useEffect, useState } from 'react';
import { Landing } from './site/Landing';
import { DemoPage } from './site/DemoPage';

// Hash routing keeps the build deployable to any static host without rewrites.
function useRoute() {
  // Accepts both "#/demo" and "#demo".
  const read = () => window.location.hash.replace(/^#\/?/, '');
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function App() {
  const route = useRoute();
  if (route.startsWith('demo')) return <DemoPage />;
  return <Landing />;
}
