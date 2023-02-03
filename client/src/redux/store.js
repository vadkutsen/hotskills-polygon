import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import profileReducer from "./features/profile/profileSlice";
import reviewReducer from "./features/review/reviewSlice";
import serviceReducer from "./features/service/serviceSlice";
import taskReducer from "./features/task/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    service: serviceReducer,
    review: reviewReducer,
    profile: profileReducer,
    task: taskReducer,
  }
});
