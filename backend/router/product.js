import express from 'express'
import { addProduct, deleteProduct, editProduct } from '../controller/product.js'

const router = express.Router()

router.get("/")
router.post("/", addProduct)
router.get("/:id")
router.put("/:id" , editProduct)
router.delete("/:id" , deleteProduct)

export default router