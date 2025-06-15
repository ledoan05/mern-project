import express from 'express'
import { authMiddle } from '../middleware/authMiddleware.js';
import { paymentZaloRouter, callbackRouter, createOrder, getOrder, getOrderById } from '../controller/order.js';
import { updateOrder } from '../controller/orderAdmin.js';

const route = express.Router();

route.post('/create', authMiddle, createOrder)
route.post('/create-order', authMiddle, paymentZaloRouter)
route.post('/callback', callbackRouter)
route.get('/my-order', authMiddle, getOrder)
route.get('/my-order/:id', authMiddle , getOrderById)

export default route