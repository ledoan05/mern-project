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
    const product = await productModel.findById(id)
    if (!product) return res.status(400).json("Khong tim thay san pham")
    await productModel.findByIdAndDelete(id)
    res.status(201).json("Xoa thanh cong")
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
}
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
    const saleProduct = await productModel.findOne().sort({ rating: -1 })
    if (!saleProduct) {
      return res.status(404).json({ message: "Không có sản phẩm được sale" });
    }
    res.status(200).json(saleProduct);
  } catch (error) {
    console.log(error);

  }
}
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

    // Tìm sản phẩm tương tự (cùng category & gender nhưng khác ID)
    const similarProducts = await productModel.find({
      _id: { $ne: id }, // ID khác với sản phẩm đang xem
      category: product.category,
      gender: product.gender,
    }).limit(4);

    res.status(200).json({
      product,
      similarProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}
