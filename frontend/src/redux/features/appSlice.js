import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOnline: navigator.onLine, 
  theme: "dark",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setOnlineStatus, setTheme} = appSlice.actions;
export default appSlice.reducer;
