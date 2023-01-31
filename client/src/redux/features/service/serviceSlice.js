import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  services: [],
  loading: false,
};

export const createService = createAsyncThunk("service/createService", async (params) => {
  try {
    const data = await axios.post("/api/services/new", params);
    return data;
  } catch (error) {
    console.log(error.message);
  }
});

export const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: {
    // create service
    [createService.pending]: (state) => {
      state.loading = true;
    },
    [createService.fulfilled]: (state, action) => {
      state.loading = false;
      state.services.push(action.payload);
    },
    [createService.rejected]: (state) => {
      state.loading = false;
    }
  }
});

export default serviceSlice.reducer;
