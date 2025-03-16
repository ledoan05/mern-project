import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const productsByFilter = createAsyncThunk("products/productsByFilter" ,async ({
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

export const productsDetail = createAsyncThunk("products/productsDetail" , async(id)=>{
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`)
  return res.data
})