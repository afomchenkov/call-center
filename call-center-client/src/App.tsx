import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { BaseLayout } from '@/pages/BaseLayout';
import { AppProvider } from '@/context/appProvider';

const queryClient = new QueryClient();

export function App(): ReactNode {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BaseLayout />
      </AppProvider>
    </QueryClientProvider>
  );
}
