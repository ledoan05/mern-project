import express from 'express'
import { addProduct, deleteProduct, editProduct, listProduct, listProductDetail, newArrival, saleProduct, similarProducts } from '../controller/product.js'
import { admin, authMiddle } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/", listProduct);
router.post("/", authMiddle, admin, addProduct);
router.get("/new-arrivals", newArrival);
router.get("/sale", saleProduct);
router.get("/similar/:id", similarProducts);
router.get("/:id", listProductDetail);
router.put("/:id", authMiddle, admin, editProduct);
router.delete("/:id", authMiddle, admin, deleteProduct);



export default router