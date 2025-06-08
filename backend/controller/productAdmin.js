import { productModel } from "../models/product.js";


export const getProduct = async (req, res) => {
  try {
    const products = await productModel.find({})
    res.json(products)
  } catch (error) {
    console.log(error);
  
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" })
  }
}

