import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

/* ---------- Register ---------- */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
  
      const payload = {
        ...userData,
        emailID: userData.email || userData.emailID
      };
      
      const { data } = await axiosClient.post("/user/register", payload);
      
      return data.user; 
    } catch (err) {
      console.error("Register error in thunk:", err.response?.data);
      
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          "Registration failed";
      
      return rejectWithValue(errorMessage);
    }
  }
);

/* ---------- Login ---------- */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      userData.emailID = userData.email;
      const { data } = await axiosClient.post("/user/login", userData);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ---------- Check Auth ---------- */
export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/user/check");
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ---------- Logout ---------- */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.get("/user/logout");
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ---------- Slice ---------- */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },

  /* SYNCHRONOUS REDUCER */
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },

  /* ASYNC REDUCERS */
  extraReducers: (builder) => {
    builder

      /* Register */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Login */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Check Auth */
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      /* Logout */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;
