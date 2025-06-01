import { None, Some } from '@hqoss/monads';
import type { Option } from '@hqoss/monads';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Agent } from '@/models';

export type AgentPageState = {
  agent: Option<Agent>;
  isLoading: boolean;
  isError: boolean;
};

const initialState: AgentPageState = {
  agent: None,
  isLoading: true,
  isError: false,
};

const slice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    initializeAgent: () => initialState,
    loadAgent: (state, { payload: agent }: PayloadAction<Agent>) => {
      state.agent = Some(agent);
      state.isLoading = false;
    },
    loadAgentError: (state) => {
      state.isError = true;
      state.isLoading = false;
    },
  },
});

export const { loadAgent, loadAgentError, initializeAgent } = slice.actions;

export default slice.reducer;
