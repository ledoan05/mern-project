import express from 'express'
import { authMiddle } from '../middleware/authMiddleware.js';
import { paymentZaloRouter, callbackRouter, createOrder } from '../controller/order.js';

const route = express.Router();

route.post('/create', authMiddle, createOrder)
route.post('/create-order', authMiddle, paymentZaloRouter)
route.post('/callback', callbackRouter)

export default route