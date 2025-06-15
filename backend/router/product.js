import express from 'express'
import { listProduct, listProductDetail, newArrival, saleProduct, similarProducts } from '../controller/product.js'

const router = express.Router()

router.get("/", listProduct);
router.get("/new-arrivals", newArrival);
router.get("/sale", saleProduct);
router.get("/similar/:id", similarProducts);
router.get("/:id", listProductDetail);



export default router