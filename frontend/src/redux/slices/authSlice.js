import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


const userFromStrorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
const initialGuest = localStorage.getItem("guest") || `guest_${new Date().getTime()}`
localStorage.setItem("guest", initialGuest)

const initialState = {
  user: userFromStrorage,
  guest: initialGuest,
  loading: false,
  error: null
}

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, data)
    localStorage.setItem("user", JSON.stringify(res.data.data));
    localStorage.setItem("token", res.data.token)
    return res.data.data
  } catch (error) {
    return rejectWithValue(error.response.data); 
  }
})


export const register = createAsyncThunk("auth/register", async (data, { rejectWidthValue }) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, data)
    localStorage.setItem("user", JSON.stringify(res.data.data));
    localStorage.setItem("token", res.data.token)
    return res.data.data
  } catch (error) {
    return rejectWidthValue(error.data.data)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null,
        state.guest = `guest_${new Date().getTime()}`,
        localStorage.removeItem("user"),
        localStorage.removeItem("token"),
        localStorage.setItem("guest", state.guest)
    },
    generateNewGuest : (state)=>{
      state.guest = `guest_${new Date().getTime()}`,
      localStorage.setItem("guest" , state.guest)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
          state.error = null
      })
      .addCase(login.fulfilled,(state,action)=>{
        state.loading = false
        state.error = action.payload
      })
      .addCase(login.rejected, (state, action)=>{
        state.loading = false
        state.error = action.payload.message
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
  }
})

export const { logout, generateNewGuest } = authSlice.actions
export default authSlice.reducer