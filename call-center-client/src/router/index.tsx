import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { App } from '../App';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PageLoader } from '../components/PageLoader';

const HomePage = lazy(() => import('../pages/HomePage'));

type WithSuspenseProps = {
  component: null | ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
const WithSuspense = ({ component = null }: WithSuspenseProps) => {
  return <Suspense fallback={<PageLoader />}>{component}</Suspense>;
};

export const router = createBrowserRouter([
  {
    element: <App />,
    loader: () => <PageLoader />,
    children: [
      {
        path: '/',
        index: true,
        element: <WithSuspense component={<HomePage />} />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
