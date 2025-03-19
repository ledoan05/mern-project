import { configureStore } from "@reduxjs/toolkit"
import authReducer from './slices/authSlice.js'
import productReducer from './slices/productsSlice.js'

const store = configureStore({
  reducer: {
    auth : authReducer,
    product : productReducer,
  }
})
export default store