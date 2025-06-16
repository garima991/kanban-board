import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, usersApi } from "../../apis/axiosInstance";
import toast from "react-hot-toast";

/* ───────────── ASYNC THUNKS ───────────── */

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Login Failed." }
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Registration Failed." });
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.refreshToken();
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    if (!navigator.onLine) {
      return rejectWithValue("offline");
    }

    try {
      const res = await usersApi.getMe();
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ───────────── INITIAL STATE ───────────── */

const initialState = {
  user: null,
  loading: false,
  fieldErrors: {},
  errorMessage: null,
  authChecked: false,
};

/* ───────────── SLICE ───────────── */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearFieldErrors: (state) => { state.fieldErrors = {}; state.errorMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.fieldErrors = {};
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authChecked = true;
        state.fieldErrors = {};
        state.errorMessage = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.fieldErrors = action.payload.errors || {};
        state.errorMessage = action.payload.message || "Login Failed";
      })

      // Handle register thunk
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.fieldErrors = {};
        state.errorMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authChecked = true;
        state.fieldErrors = {};
        state.errorMessage = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.fieldErrors = action.payload.errors || {};
        state.errorMessage = action.payload.message || "Registration Failed";
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.fieldErrors = {},
        state.errorMessage = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.authChecked = true;
        state.fieldErrors = {};
        state.errorMessage = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.fieldErrors = {};
        state.errorMessage = action.payload;
      })

      // Refresh
      .addCase(refreshUser.pending, (state) => {
        state.loading = true;
        state.fieldErrors = {},
        state.errorMessage = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
        state.authChecked = true;
      })

      // GetMe
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.fieldErrors = {};
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        if (action.payload === "offline") {
          state.loading = false;
          return;  // don't reset user or show error
        }
        state.loading = false;
        state.user = null; // in case token expired
        state.authChecked = true;
        state.errorMessage = action.payload;
      })
  },
});


export const { clearFieldErrors } = authSlice.actions;
export default authSlice.reducer;
