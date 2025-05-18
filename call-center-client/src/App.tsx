import { BaseLayout } from './pages/BaseLayout';
import { AppProvider } from './state/appProvider';

export const App = () => {

  return (
    <AppProvider>
      <BaseLayout />
    </AppProvider>
  );
}
