import express from 'express'
import { authMiddle } from '../middleware/authMiddleware.js'
import { addCheckout } from '../controller/checkout.js'

const route = express.Router()

route.post('/' , authMiddle , addCheckout)

export default route