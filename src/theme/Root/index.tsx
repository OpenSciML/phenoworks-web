import {lazy, Suspense, type ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const AskPhenoWorks = lazy(() => import('@site/src/components/AskPhenoWorks'));

/** Keep the chat mounted across documentation navigation. @param children - Site pages. */
export default function Root({children}: {children: ReactNode}): ReactNode {
  return <>{children}<BrowserOnly>{() => <Suspense fallback={null}><AskPhenoWorks /></Suspense>}</BrowserOnly></>;
}
