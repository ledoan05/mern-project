import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../untils/axiosInstance.js';

// Async thunk để lấy địa chỉ giao hàng
export const fetchShippingAddress = createAsyncThunk(
  'shippingAddress/fetchShippingAddress',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/user/shipping-address', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.shippingAddress;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy địa chỉ giao hàng');
    }
  }
);

// Async thunk để lưu địa chỉ giao hàng
export const saveShippingAddress = createAsyncThunk(
  'shippingAddress/saveShippingAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/user/shipping-address', addressData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.shippingAddress;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lưu địa chỉ giao hàng');
    }
  }
);

// Async thunk để xóa địa chỉ giao hàng
export const deleteShippingAddress = createAsyncThunk(
  'shippingAddress/deleteShippingAddress',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/user/shipping-address', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa địa chỉ giao hàng');
    }
  }
);

const shippingAddressSlice = createSlice({
  name: 'shippingAddress',
  initialState: {
    address: null,
    loading: false,
    error: null,
    saved: false
  },
  reducers: {
    clearShippingAddress: (state) => {
      state.address = null;
      state.error = null;
      state.saved = false;
    },
    setShippingAddress: (state, action) => {
      state.address = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch shipping address
      .addCase(fetchShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
        state.error = null;
      })
      .addCase(fetchShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save shipping address
      .addCase(saveShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
        state.saved = true;
        state.error = null;
      })
      .addCase(saveShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete shipping address
      .addCase(deleteShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShippingAddress.fulfilled, (state) => {
        state.loading = false;
        state.address = null;
        state.saved = false;
        state.error = null;
      })
      .addCase(deleteShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearShippingAddress, setShippingAddress } = shippingAddressSlice.actions;
export default shippingAddressSlice.reducer; 