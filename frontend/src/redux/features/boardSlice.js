import { createSlice, current } from '@reduxjs/toolkit'

const initialState = { value: [] }

export const boardSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.value = action.payload.map((board, idx) => ({
        ...board,
        isActive: idx == 0, // frontend-only field
      }));
    },
    setBoardActive : (state, action) => {
      console.log(current(state));
      const boardName  = action.payload;
      state.value.forEach((board) => {
        board.isActive = board.name === boardName;
      })
    }
  }
})

export const { setBoards, setBoardActive } = boardSlice.actions

export default boardSlice.reducer