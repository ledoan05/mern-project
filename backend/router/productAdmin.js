import express from 'express';
import { admin, authMiddle } from '../middleware/authMiddleware.js';
import { getProduct } from '../controller/productAdmin.js';

const router = express.Router();

router.get('/' , authMiddle , admin , getProduct)

export default router;