// src/store/adminOrderSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/untils/axiosInstance";

// ==== ASYNC THUNKS ====

// Lấy danh sách đơn hàng
export const fetchOrders = createAsyncThunk(
  'adminOrder/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/admin/order', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Không lấy được danh sách đơn hàng");
    }
  }
);

// Cập nhật đơn hàng
export const updateOrder = createAsyncThunk(
  'adminOrder/updateOrder',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/admin/order/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      return res.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Cập nhật đơn hàng thất bại");
    }
  }
);

// Xóa đơn hàng
export const deleteOrder = createAsyncThunk(
  'adminOrder/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/order/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Xóa đơn hàng thất bại");
    }
  }
);

// ==== SLICE ====
const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState: {
    orders: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateOrder
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteOrder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default adminOrderSlice.reducer;
