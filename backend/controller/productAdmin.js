import { productModel } from "../models/product.js";
import mongoose from "mongoose";

export const getProduct = async (req, res) => {
  try {
    const products = await productModel.find({})
    res.json(products)
  } catch (error) {
    console.log(error);
  
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" })
  }
}

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
    console.error("Lỗi khi thêm sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau!" });
  }
};
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("==== [EDIT PRODUCT] ====");
    console.log("ID sản phẩm:", id);
    console.log("Data FE gửi lên:", req.body);
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json("Id khong hop le");

    const body = req.body.product ? req.body.product : req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json("Khong tim thay san pham");

    // Trả về status 200 và object mới
    return res.status(200).json(updatedProduct);

  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("Id khong hop le")
    const product = await productModel.findById(id)
    if (!product) return res.status(400).json("Khong tim thay san pham")
    await productModel.findByIdAndDelete(id)
    res.status(201).json("Xoa thanh cong")
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
}

