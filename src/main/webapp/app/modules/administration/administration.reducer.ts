import axios from 'axios';
import {createAsyncThunk, createSlice, isPending, isRejected} from '@reduxjs/toolkit';

import {serializeAxiosError} from 'app/shared/reducers/reducer.utils';
import {AppThunk} from 'app/config/store';
import {processMetrics} from "app/shared/util/metrics-utils";
import {IGatewayInfo} from "app/shared/model/gateway.info.model";

const initialState = {
  loading: false,
  errorMessage: null,
  health: {} as any,
  metrics: {} as any,
  clusterNodes: [] as IGatewayInfo[],
  totalItems: 0,
};

export type AdministrationState = Readonly<typeof initialState>;

// Actions
export const getClusterNodes = createAsyncThunk('administration/fetch_cluster_nodes', async () => axios.get<any>('/cluster/list'), {
  serializeError: serializeAxiosError,
});

export const getSystemHealth = createAsyncThunk('administration/fetch_health', async () => axios.get<any>('/health'), {
  serializeError: serializeAxiosError,
});

export const getSystemMetrics = createAsyncThunk('administration/fetch_metrics', async () => axios.get<any>('/metrics'), {
  serializeError: serializeAxiosError,
});

export const AdministrationSlice = createSlice({
  name: 'administration',
  initialState: initialState as AdministrationState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getClusterNodes.fulfilled, (state, action) => {
        state.loading = false;
        state.clusterNodes = action.payload.data;
      })
      .addCase(getSystemHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.health = action.payload.data;
      })
      .addCase(getSystemMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = processMetrics(action.payload.data);
      })
      .addMatcher(isPending(getSystemHealth, getSystemMetrics,getClusterNodes), state => {
        state.errorMessage = null;
        state.loading = true;
      })
      .addMatcher(
        isRejected(getSystemHealth, getSystemMetrics,getClusterNodes),
        (state, action) => {
          state.errorMessage = action.error.message;
          state.loading = false;
        },
      );
  },
});

// Reducer
export default AdministrationSlice.reducer;
