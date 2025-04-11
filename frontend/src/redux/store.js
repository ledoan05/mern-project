import { configureStore } from "@reduxjs/toolkit"
import authReducer from './slices/authSlice.js'
import productReducer from './slices/productsSlice.js'
import cartReducer from './slices/cartSlice.js'
import checkoutReducer from './slices/checkoutSlice.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer
  },
  devTools: import.meta.env.MODE !== "production",
})
export default store                             