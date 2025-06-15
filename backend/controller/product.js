import mongoose from "mongoose";
import { productModel } from "../models/product.js";


export const listProduct = async (req, res) => {
  try {
    const { collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit } = req.query
    let query = {}

    // Fillter 
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category
    }
    if (material) {
      query.material = { $in: material.split(",") }

    }
    if (brand) {
      query.brand = { $in: brand.split(",") }
    }
    if (size) {
      query.size = { $in: size.split(",") }
    }
    if (color) {
      query.colors = { $in: [color] }
    }
    if (gender) {
      query.gender = gender
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }
    // Sort 
    let sort = {}
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 }
          break;
        case "priceDesc":
          sort = { price: -1 }
          break;
        case "popularity":
          sort = { rating: -1 }
          break;
        default:
          break;
      }
    }
    // Paginate
    const products = await productModel.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
}
export const saleProduct = async (req, res) => {
  try {
    const saleProducts = await productModel.find({ discountPrice: { $gt: 0 } }).limit(8);
    if (!saleProducts.length) {
      return res.status(404).json({ message: "Không có sản phẩm đang giảm giá" });
    }
    res.status(200).json(saleProducts);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm sale:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const newArrival = async (req, res) => {
  try {
    const newArrival = await productModel.find().sort({ createdAt: -1 }).limit(8)
    res.status(200).json(newArrival);
  } catch (error) {
    console.log(error);
  }
}
export const listProductDetail = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("Id khong hop le")
    const product = await productModel.findById(id)
    if (!product) {
      return res.status(404).json("San pham khong ton tai")
    } else {
      return res.status(202).json(product)
    }
  } catch (error) {
    console.log(error);
  }
}
export const similarProducts = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    const similarProducts = await productModel.find({
      _id: { $ne: id },
      category: product.category,
      gender: product.gender,
    }).limit(19);

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}
