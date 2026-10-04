import { lazy, Suspense } from 'react';
import type { ViewerProps } from '../viewer/Viewer';

// pdf.js is ~1 MB; load it after the page shell so the landing page paints fast.
const Viewer = lazy(() => import('../viewer/Viewer').then((m) => ({ default: m.Viewer })));

export function LazyViewer(props: ViewerProps) {
  return (
    <Suspense fallback={<div className="viewer-loading" aria-busy="true" />}>
      <Viewer {...props} />
    </Suspense>
  );
}
