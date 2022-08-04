import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/react";
import { globalReducer } from "../features/slices/global-slice";

const sentryReduxEnhancer = Sentry.createReduxEnhancer({});

export const store = configureStore({
  reducer: {
    global: globalReducer
  },
  enhancers: [ sentryReduxEnhancer ]
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
