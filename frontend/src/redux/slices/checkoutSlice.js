import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createCheckout = createAsyncThunk("checkout/createCheckout", async (data , {rejectWithValue}) => {
 try {
   const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`, data, {
     headers: {
       Authorization: `Bearer ${localStorage.getItem("token")}`
     }
   });
   return res.data;
 } catch (error) {
  return rejectWithValue(error.response.data);
 }
});

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        console.log(action.payload);
        
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Lỗi Checkout:", action.payload);
      })
  }
});

export default checkoutSlice.reducer;