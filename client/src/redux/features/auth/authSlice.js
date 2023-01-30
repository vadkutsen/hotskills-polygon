/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  status: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  // eslint-disable-next-line consistent-return
  async ({ address }) => {
    try {
      const { data } = await axios.post("/api/auth/register", {
        address,
      });
      if (data.token) {
        window.localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  // eslint-disable-next-line consistent-return
  async ({ address }) => {
    try {
      const { data } = await axios.post("/api/auth/login", {
        address,
      });
      if (data.token) {
        window.localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  // eslint-disable-next-line consistent-return
  async () => {
    try {
      const { data } = await axios.get("/api/auth/me");
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.status = null;
    }
  },
  extraReducers: {
    // register user
    [registerUser.pending]: (state) => {
      state.isLoading = true;
      state.status = null;
    },
    [registerUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.status = action.message;
      state.user = action.user;
      state.token = action.token;
    },
    [registerUser.rejected]: (state, action) => {
      state.status = action.message;
      state.isLoading = false;
    },

    // login user
    [loginUser.pending]: (state) => {
      state.isLoading = true;
      state.status = null;
    },
    [loginUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.status = action.message;
      state.user = action.user;
      state.token = action.token;
    },
    [loginUser.rejected]: (state, action) => {
      state.status = action.message;
      state.isLoading = false;
    },

    // authorization check
    [getMe.pending]: (state) => {
      state.isLoading = true;
      state.status = null;
    },
    [getMe.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.status = null;
      state.user = action?.user;
      state.token = action?.token;
    },
    [getMe.rejected]: (state, action) => {
      state.status = action.message;
      state.isLoading = false;
    },
  },
});

export const checkIsAuth = (state) => Boolean(state.auth.token);
export const { logout } = authSlice.actions;
export default authSlice.reducer;
