import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import UserRouter from './router/user.js'
import ProductRoute from './router/product.js'



const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

const port = process.env.PORT || 9000

connectDB()

app.use("/api/user", UserRouter)
app.use("/api/product",  ProductRoute)


app.listen(port, () => {
  console.log(`End point : http://localhost:${port}`);
})