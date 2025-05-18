import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

import './styles/reset.scss';
import './styles/index.scss';

const root = createRoot(document.getElementById('root')!);

root.render(
  <RouterProvider router={router} />
);
