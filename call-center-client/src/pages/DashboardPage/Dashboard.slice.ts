import { None, Some } from '@hqoss/monads';
import type { Option } from '@hqoss/monads';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Queue } from '@/models';

export interface BaseLayout {
  isLoading: boolean;
  isError: boolean;
  queueStatus: Option<Queue>;
}

const initialState: BaseLayout = {
  isLoading: true,
  isError: false,
  queueStatus: None,
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    startLoadingDashboardData: () => initialState,
    loadQueueStatus: (state, { payload: queue }: PayloadAction<Queue>) => {
      state.queueStatus = Some(queue);
      state.isLoading = false;
    },
    loadQueueStatusError: (state) => {
      state.isError = true;
      state.isLoading = false;
    },
  },
});

export const {
  startLoadingDashboardData,
  loadQueueStatus,
  loadQueueStatusError,
} = slice.actions;

export default slice.reducer;
