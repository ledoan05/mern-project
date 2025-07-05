import { configureStore } from "@reduxjs/toolkit"
import authReducer from './slices/authSlice.js'
import productReducer from './slices/productsSlice.js'
import cartReducer from './slices/cartSlice.js'
import orderReducer from './slices/order.js'
import adminReducer from './slices/adminSlice.js'
import adminProductReducer from './slices/productAdminSlice.js'
import adminOrderReducer from './slices/orderAdminSlice.js'
import shippingAddressReducer from './slices/shippingAddressSlice.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    admin: adminReducer,
    adminProduct: adminProductReducer,
    adminOrder: adminOrderReducer,
    shippingAddress: shippingAddressReducer,
  },
  devTools: import.meta.env.MODE !== "production",
})
export default store                             