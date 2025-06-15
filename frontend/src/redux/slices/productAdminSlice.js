// src/store/adminProductSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/untils/axiosInstance";

export const fetchProduct = createAsyncThunk(
  'adminProduct/fetchProduct',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/admin/product', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Không lấy được danh sách sản phẩm");
    }
  }
);

// Thêm sản phẩm mới
export const addProduct = createAsyncThunk(
  'adminProduct/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/api/admin/product', productData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Thêm sản phẩm thất bại");
    }
  }
);

// Sửa sản phẩm
export const updateProduct = createAsyncThunk(
  'adminProduct/updateProduct',
  async ({ id, ...rest }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/api/admin/product/${id}`, rest, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Cập nhật sản phẩm thất bại");
    }
  }
);

// Xóa sản phẩm
export const deleteProduct = createAsyncThunk(
  'adminProduct/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/product/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Xoá sản phẩm thất bại");
    }
  }
);

// ==== SLICE ====
const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProduct
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addProduct
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(prod => prod._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(prod => prod._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export default adminProductSlice.reducer;
