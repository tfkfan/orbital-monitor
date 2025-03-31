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

const PROGRESS_FIELDS = ["used", "max", "committed"];

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
        meanMs?: number;
        totalTimeMs?: number;
        maxMs?: number;
        valueMs?: number;
      }) => {
        if (key.indexOf("jvm") !== -1 && key.indexOf(field) === key.length - field.length) {
          const k = `${prefix}.${it.tags.id}`
          res["jvm"] = res["jvm"] === undefined ? {} : res["jvm"];
          res["jvm"][k] = res["jvm"][k] === undefined ? {} : res["jvm"][k];
          res["jvm"][k][field] = it["value"];
        } else if (key.indexOf("process") !== -1 || key.indexOf("system") !== -1) {
          res["processMetrics"] = res["processMetrics"] === undefined ? {} : res["processMetrics"];
          res["processMetrics"][key] = it.valueMs !== undefined ? it.valueMs : it.value;
        } else if (key.indexOf("gc") !== -1) {
          res["garbageCollector"] = res["garbageCollector"] === undefined ? {} : res["garbageCollector"];
          res["garbageCollector"][key] = it.value !== undefined ? it.value : it.count;
        }
      });
    }
  }
  res["threadDump"] = {}
  res["threadDump"]["threads"] = []

  for (const value of metrics["jvm.threads.states"]) {
    for (let i = 0; i < value.value; i++)
      res["threadDump"]["threads"].push({
        stackTrace: {},
        key: i,
        threadState: value.tags.state.toUpperCase().replace("-", "_")
      })
  }
  res["garbageCollector"]["classesLoaded"] = metrics["jvm.classes.loaded"][0]["value"];
  res["garbageCollector"]["classesUnloaded"] = metrics["jvm.classes.unloaded"][0]["count"];
  res["garbageCollector"]["count"] = metrics["jvm.gc.pause"].reduce((acc, it) => acc + it["count"], 0);
  res["garbageCollector"]["mean"] = metrics["jvm.gc.pause"].reduce((acc, it) => acc + it["meanMs"], 0);
  res["garbageCollector"]["max"] = metrics["jvm.gc.pause"].reduce((acc, it) => acc + it["maxMs"], 0);

  res["http.server.requests"] = {};
  res["http.server.requests"]["all"] = {};
  res["http.server.requests"]["all"]["count"] = metrics["vertx.http.server.requests"].reduce((acc, it) => acc + it["count"], 0)
  res["http.server.requests"]["percode"] = {};

  metrics["vertx.http.server.requests"].forEach(it => {
    res["http.server.requests"]["percode"][it.tags.code] = res["http.server.requests"]["percode"][it.tags.code] !== undefined ? res["http.server.requests"]["percode"][it.tags.code]
      : {};
    const v = res["http.server.requests"]["percode"][it.tags.code];
    v.count = v.count !== undefined ? v.count : 0;
    v.count += it.count;
    v.mean = 0;
    v.max = 0;
  });
  metrics["vertx.http.server.response.time"].forEach(it => {
    const v = res["http.server.requests"]["percode"][it.tags.code];
    if (v === undefined)
      return
    v.mean = v.mean !== undefined ? v.mean : 0;
    v.max = v.max !== undefined ? v.max : 0;

    v.mean += it.meanMs/v.count;
    v.max += it.maxMs/v.count;
  });


  for (const [key, value] of Object.entries<any>(res["jvm"])) {
    if (value["used"] === undefined || value["max"] === undefined)
      delete res["jvm"][key];
    if (value["max"] === -1)
      value["max"] = 2000000000;
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
