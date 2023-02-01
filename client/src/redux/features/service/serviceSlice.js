import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  services: [],
  loading: false,
};

export const createService = createAsyncThunk(
  "service/createService",
  async (params) => {
    try {
      const data = await axios.post("/api/services/new", params);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getServices = createAsyncThunk("service/getService", async () => {
  try {
    const { data } = await axios.get("/api/services");
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (id) => {
    try {
      const { data } = await axios.delete(`/api/services/${id}`, id);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

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
    },
    // get services
    [getServices.pending]: (state) => {
      state.loading = true;
    },
    [getServices.fulfilled]: (state, action) => {
      state.loading = false;
      state.services = action.payload;
    },
    [getServices.rejected]: (state) => {
      state.loading = false;
    },
    // delete service
    [deleteService.pending]: (state) => {
      state.loading = true;
    },
    [deleteService.fulfilled]: (state, action) => {
      state.loading = false;
      state.services = state.services.filter((service) => service._id !== action.payload._id);
    },
    [deleteService.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default serviceSlice.reducer;
