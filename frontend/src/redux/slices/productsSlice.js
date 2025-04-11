import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const productsByFilter = createAsyncThunk("products/productsByFilter", async ({
  collection,
  size,
  color,
  gender,
  minPrice,
  maxPrice,
  sortBy,
  search,
  category,
  material,
  brand,
  limit
}) => {
  const query = new URLSearchParams();
  if (collection) query.append("collection", collection)
  if (size) query.append("size", size)
  if (color) query.append("color", color)
  if (gender) query.append("gender", gender)
  if (minPrice) query.append("minPrice", minPrice)
  if (maxPrice) query.append("maxPrice", maxPrice)
  if (sortBy) query.append("sortBy", sortBy)
  if (search) query.append("search", search)
  if (category) query.append("category", category)
  if (material) query.append("material", material)
  if (brand) query.append("brand", brand)
  if (limit) query.append("limit", limit)

  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product?${query.toString()}`)
  return res.data
})

export const productsDetail = createAsyncThunk("products/productsDetail", async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`)
  return res.data
  
})

export const updateProduct = createAsyncThunk("porducts/updateProduct", async ({ id, productData }) => {
  const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`, productData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`
    }
  })
  return res.data
})

export const similarProduct = createAsyncThunk("product/similarProduct", async ({ id }) => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/similar/${id}`)
  console.log(res.data);
  
  return res.data
})

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    filters: {
      category: "",
      color: "",
      size: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: ""
    }

  },

  reducers: {
      setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilter: (state) => {
      state.filters = {
        category: "",
        color: "",
        size: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: ""
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(productsByFilter.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(productsByFilter.fulfilled, (state, action) => {
        state.loading = false
        state.products = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(productsByFilter.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(productsDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(productsDetail.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload
        
      })
      .addCase(productsDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
    
      })
    

      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updateProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product.id === updateProduct.id
        )
        if (index !== -1) {
          state.products[index] = updateProduct
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false,
          state.error = action.error.message
      })

      .addCase(similarProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(similarProduct.fulfilled, (state, action) => {
        state.loading = false
        state.similarProducts = action.payload
      })
      .addCase(similarProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { setFilter, clearFilter } = productSlice.actions
export default productSlice.reducer