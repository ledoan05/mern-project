import mongoose from "mongoose";
import { productModel } from "../models/product.js";

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
      image,
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
      image,
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
    console.error("Lỗi khi thêm sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau!" });
  }
};

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

export const deleteProduct = async (req, res) => {
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
    await productModel.findByIdAndDelete(id, req.body, { new: true })
    return res.status(201).json("Xoa thanh cong")
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
}
