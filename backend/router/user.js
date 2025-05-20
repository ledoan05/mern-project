import express from 'express'
import { Login, refreshToken, Register } from '../controller/user.js'

const router = express.Router()

router.post('/register', Register)
router.post('/login', Login)
router.post('/refresh-token', refreshToken);

export default router