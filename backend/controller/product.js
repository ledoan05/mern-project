import mongoose from "mongoose";
import { productModel } from "../models/product.js";

//Thêm sản phẩm
export const addProduct = async (req, res) => {
  try {
 
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tag,
      dimensions,
      weight,
    } = req.body;
    if (!name || !price || !countInStock || !category || !brand) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc!" });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Người dùng không xác thực!" });
    }

    const product = new productModel({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tag,
      dimensions,
      weight,
      user: req.user.id,
    });

    await product.save();

    return res.status(201).json({ message: "Sản phẩm đã được thêm thành công!", product });
  } catch (error) {
    // console.error("Lỗi khi thêm sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau!" });
  }
};

//Cập nhật sản phẩm
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("Id khong hop le")
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      image,
      isFeatured,
      isPublished,
      tag,
      dimensions,
      weight,
    } = req.body;

    const product = await productModel.findById(id)
    if (!product) return res.status(400).json("Khong tim thay san pham")
    const newProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true })
    return res.status(201).json(newProduct)
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
}
//Xoá sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("Id khong hop le")
    const product = await productModel.findById(id)
    if (!product) return res.status(400).json("Khong tim thay san pham")
    await productModel.findByIdAndDelete(id)
    res.status(201).json("Xoa thanh cong")
  } catch (error) {
    // console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
}
//Lấy danh sách sản phẩm
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
    // console.log(error);
  }
}
//Lấy danh sách sản phẩm giảm giá
export const saleProduct = async (req, res) => {
  try {
    const saleProducts = await productModel.find({ discountPrice: { $gt: 0 } }).limit(8);
    if (!saleProducts.length) {
      return res.status(404).json({ message: "Không có sản phẩm đang giảm giá" });
    }
    res.status(200).json(saleProducts);
  } catch (error) {
    // console.error("Lỗi khi lấy sản phẩm sale:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
//Lấy danh sách sản phẩm mới
export const newArrival = async (req, res) => {
  try {
    const newArrival = await productModel.find().sort({ createdAt: -1 }).limit(8)
    res.status(200).json(newArrival);
  } catch (error) {
    // console.log(error);
  }
}
//Lấy danh sách sản phẩm chi tiết
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
    // console.log(error);
  }
}
//Lấy danh sách sản phẩm liên quan
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
