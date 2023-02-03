/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  tasks: [],
  loading: false,
};

export const createTask = createAsyncThunk(
  "task/createTask",
  async (params) => {
    try {
      const data = await axios.post("/api/tasks/new", params);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getTasks = createAsyncThunk("task/getTasks", async () => {
  try {
    const { data } = await axios.get("/api/tasks");
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id) => {
    try {
      const { data } = await axios.delete(`/api/tasks/${id}`, id);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (updatedTask) => {
    try {
      const { data } = await axios.put(`/api/tasks/${updatedTask.id}`, updatedTask);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: {
    // create task
    [createTask.pending]: (state) => {
      state.loading = true;
    },
    [createTask.fulfilled]: (state, action) => {
      state.loading = false;
      state.tasks.push(action.payload);
    },
    [createTask.rejected]: (state) => {
      state.loading = false;
    },
    // get tasks
    [getTasks.pending]: (state) => {
      state.loading = true;
    },
    [getTasks.fulfilled]: (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    },
    [getTasks.rejected]: (state) => {
      state.loading = false;
    },
    // delete task
    [deleteTask.pending]: (state) => {
      state.loading = true;
    },
    [deleteTask.fulfilled]: (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task._id !== action.payload._id);
    },
    [deleteTask.rejected]: (state) => {
      state.loading = false;
    },
    // update task
    [updateTask.pending]: (state) => {
      state.loading = true;
    },
    [updateTask.fulfilled]: (state, action) => {
      state.loading = false;
      const index = state.tasks.findIndex((task) => task._id === action.payload._id);
      state.tasks[index] = action.payload;
    },
    [updateTask.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default taskSlice.reducer;
