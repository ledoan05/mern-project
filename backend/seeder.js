import mongoose from "mongoose";
import dotenv from 'dotenv'
import bcrypt from "bcryptjs";
import products from "./data/product.js";
import { productModel } from "./models/product.js";
import { userModel } from "./models/user.js";
import { cartModel } from "./models/cart.js";

dotenv.config()

mongoose.connect(process.env.MONGOOSE_URI)

const seedData = async () => {
  try {
    await productModel.deleteMany()
    await userModel.deleteMany()
    await cartModel.deleteMany()

    const createdUser = await userModel.create({
      name: "admin",
      email: "admin@123.com",
      password: bcrypt.hashSync("123456", 10),  
      role: "admin"
    })

    const sampleProducts = products.map((product) => ({
      ...product,
      user: createdUser._id,
    }));

    await productModel.insertMany(sampleProducts);
    process.exit()
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.connection.close();
    process.exit(1)
  }
}
seedData()