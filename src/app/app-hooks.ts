import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { AsyncThunkAction, unwrapResult } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './app-store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppUnwrap = <R extends any>(asyncThunk: AsyncThunkAction<R, any, any>) => Promise<R>

// unwraps the result so we can try/catch
export const useAppUnwrap = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    <R extends any>(asyncThunk: AsyncThunkAction<R, any, any>): Promise<R> => dispatch(asyncThunk).then(unwrapResult),
    [dispatch],
  );
};
