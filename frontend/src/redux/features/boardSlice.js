import { createSlice, current } from '@reduxjs/toolkit'
import { createAsyncThunk } from "@reduxjs/toolkit";
import { boardsApi } from "../../apis/axiosInstance";
import { toast } from "react-hot-toast";

export const fetchBoards = createAsyncThunk("board/fetchBoards", async (_, { rejectWithValue }) => {
  try {
    const res = await boardsApi.getBoards();
    return res.data.boards;
  } catch (error){
      rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createBoard = createAsyncThunk("board/createBoard", async (boardData, { dispatch, rejectWithValue }) => {
  try {
    const res = await boardsApi.createBoard(boardData);
    return res.data.board;
  }catch (error){
      rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getActiveBoardMembers = createAsyncThunk("board/getBoardMembers", async (boardId, { rejectWithValue }) => {
  try {
    const res = await boardsApi.getBoardMembers(boardId);
    return res.data.members;
  }
  catch (error){
      rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const addBoardMember = createAsyncThunk("board/addBoardMember", async ({ boardId, memberData }, { rejectWithValue }) => {
  try {
    const res = await boardsApi.addMember(boardId, memberData);
    return res.data.members;
  }
  catch (error){
      rejectWithValue(error.response?.data?.message || error.message);
    }
})

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
    }
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

  },
})

export const { setBoards, setBoardActive } = boardSlice.actions

export default boardSlice.reducer