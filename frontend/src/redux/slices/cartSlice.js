import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../untils/axiosInstance.js"

const saveCartToStrorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart))
}

export const fetchCart = createAsyncThunk("cart/fetchCart", async ({ userId, guestId }, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      params: { userId, guestId }
    })
    return res.data
  } catch (error) {
    console.log(error);
    return rejectWithValue(error.res.data)
  }
})

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color, userId, images }, { rejectWithValue }) => {
    try {
      let guestId = localStorage.getItem("guest");
      console.log("📌 Dữ liệu trước khi gửi API:", { productId, quantity, size, color, userId, guestId, images }); 
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, { productId, quantity, size, color, userId, guestId, images });
     console.log("sdsdsdsd" ,  res);
      return res.data;
    } catch (error) {
      console.error(" Lỗi API addToCart:", error);
      return rejectWithValue(error.response?.data || "Lỗi khi thêm vào giỏ hàng");
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        productId, quantity, size, color, userId, guestId
      });
      return res.data;
    } catch (error) {
      console.error(" Lỗi updateCartItemQuantity:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Lỗi không xác định");
    }
  }
);


export const removeItemCart = createAsyncThunk(
  "cart/removeItemCart",
  async ({ productId, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        data: { productId, size, color, userId, guestId },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi xoá sản phẩm");
    }
  }
);

export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ guestId, userId }, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth?.token;
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
      { guestId, userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(" mergeCart thất bại:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || { message: "Lỗi không xác định" });
  }
});
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: JSON.parse(localStorage.getItem("cart")) || { products: [] },
    loading: false,
    error: null
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] }
      localStorage.removeItem("cart")
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStrorage(action.payload)
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "That bai"
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStrorage(action.payload)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "That bai"
      })


      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        console.log("🛒 State Redux sau update:", state.cart);
        saveCartToStrorage(action.payload)
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Thất bại"
      })

      .addCase(removeItemCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeItemCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStrorage(action.payload)
      })
      .addCase(removeItemCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "That bai"
      })
      .addCase(mergeCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        console.log("🔥 Dữ liệu mergeCart trả về:", action.payload);
        state.loading = false
        state.cart = action.payload
        saveCartToStrorage(action.payload)
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "That bai"
      })
  }
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer