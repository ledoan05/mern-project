import express from 'express'
import { Login, refreshToken, Register, saveShippingAddress, getShippingAddress, deleteShippingAddress } from '../controller/user.js'
import { authMiddle } from '../middleware/authMiddleware.js' 

const router = express.Router()

router.post('/register', Register)
router.post('/login', Login)
router.post('/refresh-token', refreshToken);
router.post('/shipping-address', authMiddle, saveShippingAddress);
router.get('/shipping-address', authMiddle, getShippingAddress);
router.delete('/shipping-address', authMiddle, deleteShippingAddress);

export default router