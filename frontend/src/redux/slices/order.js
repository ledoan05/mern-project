import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../untils/axiosInstance.js";

// Lấy tất cả đơn hàng của người dùng
export const fetchOrderUser = createAsyncThunk("order/fetchOrderUser", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/my-order`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Lỗi không xác định" });
  }
});

export const fetchOrderDetail = createAsyncThunk(
  "order/fetchOrderDetail",
  async (orderId, { rejectWithValue }) => {
    console.log("👉 Đã vào fetchOrderDetail với orderId:", orderId);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/order/my-order/${orderId}`;
      const token = localStorage.getItem("token");

      console.log("👉 URL:", url);
      console.log("👉 Token:", token);

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Response:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi axios:", error);

      // Bắt lỗi rõ ràng
      return rejectWithValue(
        error.response?.data || { message: "Lỗi không xác định" }
      );
    }
  }
);



const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: [],
    totalOrder: 0,
    orderDetail: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user orders
      .addCase(fetchOrderUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderUser.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đã xảy ra lỗi khi lấy danh sách đơn hàng.";
      })

      // Fetch order detail
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {

        state.loading = false;
        state.orderDetail = action.payload;
        console.log(action.payload);
        
        state.error = null;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đã xảy ra lỗi khi lấy chi tiết đơn hàng.";
      });
  }
});

export default orderSlice.reducer;
