import axios from 'axios';
import {createAsyncThunk, createSlice, isPending, isRejected} from '@reduxjs/toolkit';

import {serializeAxiosError} from 'app/shared/reducers/reducer.utils';
import {AppThunk} from 'app/config/store';

const initialState = {
  loading: false,
  errorMessage: null,
  health: {} as any,
  metrics: {} as any,
  parsedMetrics: {} as any,
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

const PROGRESS_FIELDS = ["used", "max"];
const SIMPLE_TYPES = ["gauge", "functionalCounter", "counter"];

const processMetrics = (metrics): any => {
  const res = {};
  for (const [key, value] of Object.entries<any>(metrics)) {
    for (const field of PROGRESS_FIELDS) {
      const prefix = key.replace(`.${field}`, '');
      value.forEach((it: {
        [x: string]: any;
        tags: { id: any; };
        type: string;
        value?: any;
        count?: number;
        mean?: number;
        total?: number;
        max?: number;
        meanMs?:number;
        totalTimeMs?:number;
        maxMs?:number;
      }) => {
        if (key.indexOf(field) === key.length - field.length) {
          const k = `${prefix}.${it.tags.id}`
          res["resources"] = res["resources"] === undefined ? {} : res["resources"];
          res["resources"][k] = res["resources"][k] === undefined ? {} : res["resources"][k];
          res["resources"][k][field] = it["value"];
        } else if (SIMPLE_TYPES.includes(it.type)) {
          res["gauge"] = res["gauge"] === undefined ? [] : res["gauge"];
          const k = `${key}/${it.tags.id ? it.tags.id : JSON.stringify(it.tags)}`
          res["gauge"].push({
            key: k,
            value: it.type === "gauge" ? it.value : it.count
          });
        } else if (it.type === "summary") {
          const k = `${key}/${it.tags.id ? it.tags.id : JSON.stringify(it.tags)}`
          res["summary"] = res["summary"] === undefined ? [] : res["summary"];
          res["summary"].push({
            key: k,
            count: it.count,
            mean: it.mean,
            total: it.total,
            max: it.max
          })
        }else if (it.type === "timer") {
          const k = `${key}/${it.tags.id ? it.tags.id : JSON.stringify(it.tags)}`
          res["timer"] = res["timer"] === undefined ? [] : res["timer"];
          res["timer"].push({
            key: k,
            count: it.count,
            meanMs: it.meanMs,
            totalTimeMs: it.totalTimeMs,
            maxMs: it.maxMs
          })
        }
      });
    }
  }
  for (const [key, value] of Object.entries<any>(res["resources"])) {
    if (value["used"] === undefined || value["max"] === undefined || value["max"] === -1)
      delete res["resources"][key];
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
        state.parsedMetrics = processMetrics(state.metrics);
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
