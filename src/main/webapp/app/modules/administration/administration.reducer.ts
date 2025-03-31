import axios from 'axios';
import {createAsyncThunk, createSlice, isPending, isRejected} from '@reduxjs/toolkit';

import {serializeAxiosError} from 'app/shared/reducers/reducer.utils';
import {AppThunk} from 'app/config/store';

const initialState = {
  loading: false,
  errorMessage: null,
  health: {} as any,
  metrics: {} as any,
  progressCompatibleMetrics: {} as any,
  totalItems: 0,
};

export type AdministrationState = Readonly<typeof initialState>;

// Actions

export const getSystemHealth = createAsyncThunk('administration/fetch_health', async () => axios.get<any>('/health'), {
  serializeError: serializeAxiosError,
});

export const getSystemMetrics = createAsyncThunk('administration/fetch_metrics', async () => axios.get<any>('/metrics'), {
  serializeError: serializeAxiosError,
});

const FIELDS = ["used", "max"];

const processMetrics = (metrics): any => {
  const res = {};
  for (const field of FIELDS) {
    for (const [key, value] of Object.entries<any>(metrics)) {
      if (key.indexOf(field) === key.length - field.length) {
        const prefix = key.replace(`.${field}`, '');
        value.forEach((it: { [x: string]: any; tags: { id: any; }; }) => {
          const k = `${prefix}.${it.tags.id}`
          res[k] = res[k] === undefined ? {} : res[k];
          res[k][field] = it["value"];
        });
      }
    }
  }
  for (const [key, value] of Object.entries<any>(res)) {
    if (value["used"] === undefined || value["max"] === undefined || value["max"] === -1)
      delete res[key];
  }
  return res;
}

export const AdministrationSlice = createSlice({
  name: 'administration',
  initialState: initialState as AdministrationState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getSystemHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.health = action.payload.data;
      })
      .addCase(getSystemMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.data;
        state.progressCompatibleMetrics = processMetrics(state.metrics);
      })

      .addMatcher(isPending(getSystemHealth, getSystemMetrics), state => {
        state.errorMessage = null;
        state.loading = true;
      })
      .addMatcher(
        isRejected(getSystemHealth, getSystemMetrics),
        (state, action) => {
          state.errorMessage = action.error.message;
          state.loading = false;
        },
      );
  },
});

// Reducer
export default AdministrationSlice.reducer;
