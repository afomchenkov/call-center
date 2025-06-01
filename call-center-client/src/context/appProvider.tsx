import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { AppContext, defaultAppState } from './appContext';

type AppProviderProps = {
  children: string | ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const appState = useMemo(() => {
    return {
      ...defaultAppState,
    };
  }, []);

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
