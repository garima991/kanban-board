import { createSlice, current } from '@reduxjs/toolkit'
import { createAsyncThunk } from "@reduxjs/toolkit";
import { boardsApi } from "../../apis/axiosInstance";
import { toast } from "react-hot-toast";

export const fetchBoards = createAsyncThunk("board/fetchBoards", async (_, { rejectWithValue }) => {
  try {
    const res = await boardsApi.getBoards();
    return res.data.boards;
  } catch (error) {
    rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createBoard = createAsyncThunk("board/createBoard", async (boardData, { dispatch, rejectWithValue }) => {
  try {
    const res = await boardsApi.createBoard(boardData);
    return res.data.board;
  } catch (error) {
    rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getActiveBoardMembers = createAsyncThunk("board/getBoardMembers", async (boardId, { rejectWithValue }) => {
  try {
    const res = await boardsApi.getBoardMembers(boardId);
    return res.data.members;
  }
  catch (error) {
    rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addBoardMember = createAsyncThunk("board/addBoardMember", async ({ boardId, memberData }, { rejectWithValue }) => {
  try {
    const res = await boardsApi.addMember(boardId, memberData);
    return res.data.members;
  }
  catch (error) {
    rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateBoard = createAsyncThunk(
  "board/updateBoard",
  async ({ boardId, name }, { rejectWithValue }) => {
    try {
      const res = await boardsApi.updateBoard(boardId, { name });
      return res.data.board;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeBoardMember = createAsyncThunk(
  "board/removeBoardMember",
  async ({ boardId, memberId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await boardsApi.removeMember(boardId, memberId);
      // After removal, always refetch the latest members
      await dispatch(getActiveBoardMembers(boardId));
      return { boardId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const boardSlice = createSlice({
  name: 'kanban',
  initialState: {
    value: [],
    activeBoardMembers: [],
    isLoading: false,
    error: null,
  },

  reducers: {
    setBoards: (state, action) => {
      state.value = action.payload.map((board, idx) => ({
        ...board,
        isActive: idx == 0, // frontend-only field
      }));
    },
    setBoardActive: (state, action) => {
      console.log(current(state));
      const boardName = action.payload;
      state.value.forEach((board) => {
        board.isActive = board.name === boardName;
      })
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch Boards
      .addCase(fetchBoards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.value = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.isLoading = false;
        toast.error("Failed to fetch boards !");
      })

      // create Board
      .addCase(createBoard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.value.push(action.payload);
        toast.success("Board created successfully !")
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error("Failed to create board !")
      })

      // fetch active board members
      .addCase(getActiveBoardMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveBoardMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeBoardMembers = action.payload;
      })
      .addCase(getActiveBoardMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // add board members
      .addCase(addBoardMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBoardMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeBoardMembers = action.payload;
        toast.success("Member added successfully");
      })
      .addCase(addBoardMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error("Failed to add member");
      })

      //update board
      .addCase(updateBoard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        const updatedBoard = action.payload;
        const idx = state.value.findIndex(b => b._id === updatedBoard._id);
        if (idx !== -1) {
          state.value[idx] = { ...state.value[idx], ...updatedBoard };
        }
        toast.success("Board updated successfully!");
      })
      .addCase(updateBoard.rejected, (state, action) => {  
        state.isLoading = false;
        state.error = action.payload;
        toast.error("Failed to update board");
      })

      .addCase(removeBoardMember.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Member removed successfully");
      })
      .addCase(removeBoardMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error("Failed to remove member");
      })

  },
})

export const { setBoards, setBoardActive } = boardSlice.actions

export default boardSlice.reducer