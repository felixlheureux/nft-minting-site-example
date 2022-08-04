import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import axios from "axios";

const getProof = async ({ address }: { address: string }): Promise<string[]> => {
  const response = await axios.create({
    headers: {
      "Content-Type": "application/json"
    },
    params: {
      "address": address
    }
  }).get("");

  return response.data;
};

export const hello = createAsyncThunk<string[],
  { address: string },
  { rejectValue: any }>(
  "global/hello",
  async ({ address }: { address: string }, { rejectWithValue }) => {
    try {
      return await getProof({ address });
    } catch (err: any) {
      console.log(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const clearGlobalState = createAction("global/clearState");

export interface GlobalState {
  status: "idle" | "pending";
  error: any;
  proof: string[];
}

const initialState: GlobalState = {
  status: "idle",
  error: {},
  proof: []
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(hello.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(hello.fulfilled, (state, { payload }) => {
      state.proof = payload;
      state.status = "idle";
    });
    builder.addCase(hello.rejected, (state, { payload }) => {
      state.error = payload ?? {};
      state.status = "idle";
    });
    builder.addCase(clearGlobalState, () => initialState);
  }
});

export const selectProof = (state: { global: GlobalState }) => state.global.proof;
export const selectAuthenticated = (state: { global: GlobalState }) => !_.isEmpty(state.global.proof);

export const globalReducer = globalSlice.reducer;
