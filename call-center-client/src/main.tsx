import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import reportWebVitals from './reportWebVitals';

import './i18n';
import './styles/index.css';

const root = createRoot(document.getElementById('root')!);

root.render(<RouterProvider router={router} />);

// send metric to remote
reportWebVitals(console.log);
