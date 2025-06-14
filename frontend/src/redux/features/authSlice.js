import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, usersApi } from "../../apis/axiosInstance";
import toast from "react-hot-toast";

/* ───────────── ASYNC THUNKS ───────────── */

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      toast.success("Login successful");
      return response.data.user;
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      toast.success("Registration successful");
      return response.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      toast.success("Logout successful");
    } catch (err) {
      const message = err?.response?.data?.message || "Logout failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.refreshToken();
      // console.log("refreshUser response", res);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Refresh failed");
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
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Fetch user failed");
    }
  }
);

/* ───────────── INITIAL STATE ───────────── */

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  authChecked: false,
};

/* ───────────── SLICE ───────────── */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle register thunk
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Refresh
      .addCase(refreshUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.authChecked = true;
      })

      // GetMe
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        if (action.payload === "offline") {
          state.isLoading = false;
          return;  // don't reset user or show error
        }
        state.isLoading = false;
        state.user = null; // in case token expired
        state.authChecked = true;
        state.error = action.payload;
      })
  },
});


export const { setUser, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
