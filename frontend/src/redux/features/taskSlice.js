
import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
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

export const addSubtask = createAsyncThunk(
  "task/addSubtask",
  async ({ boardId, taskId, subtaskData }, { dispatch, rejectWithValue }) => {
    try {
      await tasksApi.addSubtask(boardId, taskId, subtaskData);
      return res.data.task.subtasks;
    }
    catch(error){
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  });


// Slice

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    isTaskLoading: false,
    currentTask: null,
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
      })

      //add subtask 
      .addCase(addSubtask.pending, (state) => {
        state.isTaskLoading = true;
        state.error = null;
      })
      .addCase(addSubtask.fulfilled, (state, action) => {
        state.isTaskLoading = false;
        toast.success("Subtask added successfully");
      })
      .addCase(addSubtask.rejected, (state, action) => {
        state.isTaskLoading = false;
        state.error = action.payload;
        toast.error("Failed to add subtask");
      })

  },
});


export default taskSlice.reducer;
