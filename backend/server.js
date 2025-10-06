import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import UserRouter from './router/user.js'
import ProductRoute from './router/product.js'
import CartRoute from './router/cart.js'
import uploadRoute from './router/upload.js'
import orderRoute from './router/order.js'
import userAdminRoute from './router/userAdmin.js'
import productAdminRoute from './router/productAdmin.js'
import orderAdminRoute from './router/orderAdmin.js'
import chatRoute from './router/chatbot.js'

dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use("/api/user", UserRouter)
app.use("/api/product", ProductRoute)
app.use("/api/cart", CartRoute)
app.use("/api/order", orderRoute)
app.use("/api/upload", uploadRoute)
app.use("/api/chat", chatRoute)

// admin
app.use("/api/admin/user", userAdminRoute)
app.use("/api/admin/product", productAdminRoute)
app.use("/api/admin/order", orderAdminRoute)

app.get('/', (req, res) => {
  res.send('✅ Backend is running successfully on Vercel!')
})

// ❌ KHÔNG DÙNG app.listen()
// ✅ Thay vào đó export cho Vercel
export default app
