import { createContext, useContext } from 'react';
import { Noop } from '@/utils';

// TODO: add state management lib and move local states 
export type AppState = {
  isLoading: boolean;
  error: string | null;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  addToQueue: Function;
};

export const defaultAppState = {
  isLoading: false,
  error: null,
  addToQueue: Noop,
};

export const AppContext = createContext<AppState>(defaultAppState);

export const useAppContext = () => {
  return useContext(AppContext);
};
