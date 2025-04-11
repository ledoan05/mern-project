import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import UserRouter from './router/user.js'
import ProductRoute from './router/product.js'
import CartRoute from './router/cart.js'
// import checkoutRoute from './router/checkout.js'
import orderRoute from './router/order.js'



const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
dotenv.config()

const port = process.env.PORT || 9000

connectDB()

app.use("/api/user", UserRouter)
app.use("/api/product", ProductRoute)
app.use("/api/cart", CartRoute)
// app.use("/api/checkout", checkoutRoute)
app.use("/api/order", orderRoute)
app.listen(port, () => {
  console.log(`End point : http://localhost:${port}`);
})