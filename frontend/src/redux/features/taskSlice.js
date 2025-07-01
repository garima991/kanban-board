
import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { boardsApi, tasksApi } from "../../apis/axiosInstance";
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
      const res = await tasksApi.createTask(boardId, taskData);
      return res.data.task;
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
      return res.data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addSubtask = createAsyncThunk(
  "task/addSubtask",
  async ({ boardId, taskId, title }, { dispatch, rejectWithValue }) => {
    try {
      const res = await tasksApi.addSubtask(boardId, taskId, { title });
      return res.data.task;
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  });

export const updateSubtask = createAsyncThunk(
  "task/updateSubtask",
  async ({ boardId, taskId, subtaskId, subtaskData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await tasksApi.updateSubtask(boardId, taskId, subtaskId, subtaskData);
      return res.data.task;
    }
    catch (error){
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  });

export const deleteSubtask = createAsyncThunk(
  "task/deleteSubtask",
  async ({ boardId, taskId, subtaskId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await tasksApi.deleteSubtask(boardId, taskId, subtaskId);
      return res.data.task;
    }
    catch(error){
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  });


export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ boardId, taskId, taskData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await tasksApi.updateTask(boardId, taskId, taskData);
      return res.data.task;
    }
    catch (error){
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  });


export const assignTask = createAsyncThunk("task/assignTask", async ({ boardId, taskId, userId }, { rejectWithValue }) => {
  try {
    const res = await tasksApi.assignTask(boardId, taskId, userId);
    return res.data;
  } catch (error){
      return rejectWithValue(error.response?.data?.message || error.message);
    }
})


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
        state.tasks.push(action.payload);
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
        const updated = action.payload;
        const index = state.tasks.findIndex(task => task._id === updated._id);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
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
        const updated = action.payload;
        const index = state.tasks.findIndex(task => task._id === updated._id);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
        toast.success("Subtask added successfully");
      })
      .addCase(addSubtask.rejected, (state, action) => {
        state.isTaskLoading = false;
        state.error = action.payload;
        toast.error("Failed to add subtask");
      })

      // update subtask
      .addCase(updateSubtask.pending, (state) => {
        state.isTaskLoading = true;
        state.error = null;
      })
      .addCase(updateSubtask.fulfilled, (state, action) => {
        state.isTaskLoading = false;
        const updated = action.payload;
        const index = state.tasks.findIndex(task => task._id === updated._id);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
        toast.success("Subtask updated successfully");
      })
      .addCase(updateSubtask.rejected, (state, action) => {
        state.isTaskLoading = false;
        state.error = action.payload;
        toast.error("Failed to update subtask");
      })

      // delete subtask
      .addCase(deleteSubtask.pending, (state) => {
        state.isTaskLoading = true;
        state.error = null;
      })
      .addCase(deleteSubtask.fulfilled, (state, action) => {
        state.isTaskLoading = false;
        const updated = action.payload;
        const index = state.tasks.findIndex(task => task._id === updated._id);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
        toast.success("Subtask Deleted successfully");
      })
      .addCase(deleteSubtask.rejected, (state, action) => {
        state.isTaskLoading = false;
        state.error = action.payload;
        toast.error("Failed to delete subtask");
      })


      // update task
      .addCase(updateTask.pending, (state) => {
        state.isTaskLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isTaskLoading = false;
        const updated = action.payload;
        const index = state.tasks.findIndex(task => task._id === updated._id);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
        toast.success("Task updated successfully");
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isTaskLoading = false;
        state.error = action.payload;
        toast.error(`Failed to update task: ${action.payload}`);
      })

      // assign task
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, userId } = action.payload;
        const task = state.tasks.find(t => t._id === taskId);
        if (task && !task.assignedTo.includes(userId)) {
          task.assignedTo.push(userId);
        }
        toast.success("Assigned successfully");
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.isTaskLoading = false;
        state.error = action.payload;
        toast.error(`Failed to assign user : ${action.payload}`);
      })

  },
});


const selectAllTasks = (state) => state.boardTasks.tasks;

export const makeSelectTasksByStatus = () =>
  createSelector(
    [selectAllTasks, (_, status) => status],
    (tasks, status) => tasks.filter((task) => task.status === status)
  );


export default taskSlice.reducer;
