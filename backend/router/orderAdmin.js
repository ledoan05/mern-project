import express from 'express';
import { admin, authMiddle } from '../middleware/authMiddleware.js';
import { deleteOrder, getOrder, updateOrder } from '../controller/orderAdmin.js';

const router = express.Router();

router.get('/', authMiddle, admin, getOrder)
router.put('/:id', authMiddle, admin, updateOrder)
router.delete('/:id', authMiddle, admin, deleteOrder)


export default router;

