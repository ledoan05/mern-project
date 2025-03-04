import express from 'express'
import { Register } from '../controller/user.js'

const router = express.Router()

router.post('/register' , Register)
router.post('/login')

export default router