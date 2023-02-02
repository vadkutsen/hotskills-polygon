/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  reviews: [],
  loading: false,
};

export const createReview = createAsyncThunk("review/createReview", async ({ userId, rating, comment }) => {
  try {
    const { data } = await axios.post(`/api/reviews/${userId}`, {
      userId,
      rating,
      comment
    });
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: {
    // create review
    [createReview.pending]: (state) => {
      state.loading = true;
    },
    [createReview.fulfilled]: (state, action) => {
      state.loading = false;
      state.reviews.push(action.payload);
    },
    [createReview.rejected]: (state) => {
      state.loading = false;
    },
  }
});

export default reviewSlice.reducer;
