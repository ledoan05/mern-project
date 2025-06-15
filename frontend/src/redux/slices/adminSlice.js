import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/untils/axiosInstance";

// Thunks
export const fetchUser = createAsyncThunk('admin/fetchUser', async () => {
  const res = await axiosInstance.get('/api/admin/user', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.data;
});

export const addUser = createAsyncThunk('admin/addUser', async (userData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/api/admin/user', userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data.message || "Lỗi không xác định");
  }
});

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/admin/user/${id}`,
        { name, email, role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra");
    }
  }
);

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/api/admin/user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Không thể xoá người dùng");
  }
});

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addUser
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default adminSlice.reducer;
