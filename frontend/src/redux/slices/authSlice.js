  import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
  import axios from "../../untils/axiosInstance.js";    
  import { fetchCart, mergeCart } from "./cartSlice.js";

  const userFromStorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const savedGuest = localStorage.getItem("guest");
  const initialGuest = userFromStorage ?  null : savedGuest || `guest_${new Date().getTime()}`;

  if (!savedGuest && !userFromStorage) {
    localStorage.setItem("guest", initialGuest);
  }

  const initialState = {
    user: userFromStorage,  
    guest: initialGuest,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  };

  export const login = createAsyncThunk("auth/login", async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("token", res.data.token);

      const userId = res.data.data._id;
      const guestId = localStorage.getItem("guestId");

      if (guestId) {
        await dispatch(mergeCart({ guestId, userId }));
        localStorage.removeItem("guestId");
      }

      dispatch(fetchCart({ userId }));

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi đăng nhập");
    }
  });

  export const register = createAsyncThunk("auth/register", async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("token", res.data.token);

      const userId = res.data.data._id;
      const guestId = localStorage.getItem("guestId");

      if (guestId) {
        await dispatch(mergeCart({ guestId, userId }));
        localStorage.removeItem("guestId");
      }

      dispatch(fetchCart({ userId }));

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi đăng ký");
    }
  });

  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      logout: (state) => {
        state.user = null;
        state.token = null; 
        state.guest = `guest_${new Date().getTime()}`;

        localStorage.removeItem("user");
        localStorage.removeItem("cart")
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.setItem("guest", state.guest);
      },
      generateNewGuest: (state) => {
        state.guest = `guest_${new Date().getTime()}`;
        localStorage.setItem("guest", state.guest);
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.user = action.payload;
          state.token = localStorage.getItem("token");
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(register.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.user = action.payload;
          state.token = localStorage.getItem("token");
        })
        .addCase(register.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });

export const { logout, generateNewGuest } = authSlice.actions;
  export default authSlice.reducer;
