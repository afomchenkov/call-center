import { configureStore } from '@reduxjs/toolkit';
import type { Action } from '@reduxjs/toolkit';

import agent from '@/pages/AgentPage/Agent.slice';
import dashboard from '@/pages/DashboardPage/Dashboard.slice';

const middlewareConfiguration = { serializableCheck: false };

export const store = configureStore({
  reducer: { agent, dashboard },
  // TODO: split state as { agents, tasks, tickets, queue }
  devTools: {
    name: 'Conduit',
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});
export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
