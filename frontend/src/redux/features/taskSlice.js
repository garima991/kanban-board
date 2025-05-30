
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tasksApi } from "../../apis/axiosInstance";
import { toast } from "react-hot-toast";

// Async Thunks

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (boardId, { rejectWithValue }) => {
    try {
      const res = await tasksApi.getTasksByBoard(boardId);
      return res.data.tasks;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async ({ boardId, taskData }, { dispatch, rejectWithValue }) => {
    try {
      await tasksApi.createTask(boardId, taskData);
      // Refetch tasks after successful creation
      dispatch(fetchTasks(boardId));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ boardId, taskId, newStatus }, { dispatch, rejectWithValue }) => {
    try {
      const res = await tasksApi.changeTaskStatus(boardId, taskId, newStatus);
      // Refetch tasks to ensure consistency
      dispatch(fetchTasks(boardId));
      return res.data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);



// Slice

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    isTaskLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.isTaskLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isTaskLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isTaskLoading = false;
        state.error = action.payload;
        toast.error(`Failed to fetch tasks: ${action.payload}`);
      })

      // create task
      .addCase(createTask.pending, (state) => {
        state.isTaskLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isTaskLoading = false;
        toast.success("Task created successfully");
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isTaskLoading = false;
        state.error = action.payload;
        toast.error(`Failed to create task: ${action.payload}`);
      })

      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        state.isTaskLoading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.isTaskLoading = false;
        toast.success("Task status updated");
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.isTaskLoading = false;
        state.error = action.payload;
        toast.error(`Failed to update task status: ${action.payload}`);
      });

  },
});

export default taskSlice.reducer;
