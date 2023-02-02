/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  profiles: [],
  loading: false,
};

export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (params) => {
    try {
      const data = await axios.post("/api/profiles/new", params);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getProfiles = createAsyncThunk("profile/getProfiles", async () => {
  try {
    const { data } = await axios.get("/api/profiles");
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (id) => {
    try {
      const { data } = await axios.delete(`/api/profiles/${id}`, id);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (updatedProfile) => {
    try {
      const { data } = await axios.put(`/api/profiles/${updatedProfile.id}`, updatedProfile);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: {
    // create profile
    [createProfile.pending]: (state) => {
      state.loading = true;
    },
    [createProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.profiles.push(action.payload);
    },
    [createProfile.rejected]: (state) => {
      state.loading = false;
    },
    // get profiles
    [getProfiles.pending]: (state) => {
      state.loading = true;
    },
    [getProfiles.fulfilled]: (state, action) => {
      state.loading = false;
      state.profiles = action.payload;
    },
    [getProfiles.rejected]: (state) => {
      state.loading = false;
    },
    // delete profile
    [deleteProfile.pending]: (state) => {
      state.loading = true;
    },
    [deleteProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.profiles = state.profiles.filter((p) => p._id !== action.payload._id);
    },
    [deleteProfile.rejected]: (state) => {
      state.loading = false;
    },
    // update profile
    [updateProfile.pending]: (state) => {
      state.loading = true;
    },
    [updateProfile.fulfilled]: (state, action) => {
      state.loading = false;
      const index = state.profiles.findIndex((p) => p._id === action.payload._id);
      state.profiles[index] = action.payload;
    },
    [updateProfile.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default profileSlice.reducer;
