import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import reviewSlice from "./features/review/reviewSlice";
import serviceReducer from "./features/service/serviceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    service: serviceReducer,
    review: reviewSlice,
  }
});
