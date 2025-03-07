import express from 'express'
import { addCart, deleteCart, editCart, getListCart, mergeCart } from '../controller/cart.js'
import { authMiddle } from '../middleware/authMiddleware.js'

const route = express.Router()

route.get("/" , getListCart)
route.post("/" , addCart)
route.put("/" , editCart)
route.delete("/", deleteCart)
route.post("/merge" , authMiddle, mergeCart)


export default route