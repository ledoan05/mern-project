  import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
  import axios from "axios";
  import { fetchCart, mergeCart } from "./cartSlice.js"

  // Lấy user và guestId từ localStorage
  const userFromStorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const savedGuest = localStorage.getItem("guest");

  const initialGuest = userFromStorage ? null : savedGuest || `guest_${new Date().getTime()}`;

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

  // ✅ **Đăng nhập**
  export const login = createAsyncThunk("auth/login", async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, data);
      
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("token", res.data.token);

      const userId = res.data.data._id;
      const guestId = localStorage.getItem("guestId");

      // ✅ Hợp nhất giỏ hàng nếu có guestId
      if (guestId) {
        await dispatch(mergeCart({ guestId, userId }));
        localStorage.removeItem("guestId"); // Xóa guestId sau khi hợp nhất
      }

      // ✅ Sau khi đăng nhập, tải giỏ hàng ngay
      dispatch(fetchCart({ userId }));

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi đăng nhập");
    }
  });


  // ✅ **Đăng ký**
export const register = createAsyncThunk("auth/register", async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, data);
    console.log("rêrerererer : " ,  res );
    

    localStorage.setItem("user", JSON.stringify(res.data.data));
    localStorage.setItem("token", res.data.token);

    const userId = res.data.data._id;
    const guestId = localStorage.getItem("guestId");

    // ✅ Hợp nhất giỏ hàng nếu có guestId
    if (guestId) {
      await dispatch(mergeCart({ guestId, userId }));
      localStorage.removeItem("guestId"); // Xóa guestId sau khi hợp nhất
    }

    // ✅ Sau khi đăng nhập, tải giỏ hàng ngay
    dispatch(fetchCart({ userId }));

    return res.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Lỗi đăng nhập");
  }
});




  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      // ✅ **Đăng xuất**
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.guest = `guest_${new Date().getTime()}`;

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.setItem("guest", state.guest);
      },

      // ✅ **Tạo Guest ID mới**
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
