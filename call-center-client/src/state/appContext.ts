import { createContext, useContext } from 'react';
import { Noop } from '../utils';

export type AppState = {
  isLoading: boolean;
  error: string | null;
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
