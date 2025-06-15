import express from 'express';
import { admin, authMiddle } from '../middleware/authMiddleware.js';
import { addProduct, deleteProduct, editProduct, getProduct } from '../controller/productAdmin.js';

const router = express.Router();

router.get('/' , authMiddle , admin , getProduct)
router.post('/', authMiddle, admin, addProduct)
router.put('/:id', authMiddle, admin, editProduct)
router.delete('/:id', authMiddle, admin, deleteProduct)


export default router;