import { cartModel } from "../models/cart.js"
import { productModel } from "../models/product.js"

const getCart = async (userId, guestId) => {
  if (userId) {
    return await cartModel.findOne({ user: userId })
  } else if (guestId) {
    return await cartModel.findOne({ guestId: guestId })
  }
}
export const addCart = async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body
  try {
    const product = await productModel.findById(productId)
    if (!product) return res.status(404).json("Khong co san pham trong gio hang ")

    let cart = await getCart(userId, guestId)
    if (!cart) {
      cart = new cartModel({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [],
        totalPrice: 0

      })
    }
    const existingProduct = cart.products.find(item => item.productId.equals(productId))
    if (existingProduct) {
      existingProduct.quantity += quantity
    } else {
      cart.products.push({
        productId,
        name: product.name,
        image: product.image,
        price: product.price,
        size,
        color,
        quantity: quantity
      })
    }
    cart.totalPrice = Number(cart.products.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2));


    await cart.save();
    res.status(200).json({ message: "Thêm sản phẩm vào giỏ hàng thành công", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
}

export const editCart = async (req, res) => {
  try {
    const { productId, quantity, size, color, guestId, userId } = req.body
    let cart = await getCart(userId, guestId)
    if (!cart) {
      return res.status(404).json("San pham khong ton tai")
    }
    const productIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color)
    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity
      } else {
        cart.products.splice(productIndex, 1)
      }
      cart.totalPrice = Number(cart.products.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2));
      await cart.save()
      res.status(200).json(cart)
    } else {
      res.status(404).json("Khong co san pham trong gi hang")
    }
  } catch (error) {
    console.log(error);
  }
}
export const deleteCart = async (req, res) => {
  try {
    const { productId, size, color, guestId, userId } = req.body;
    let cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }
    const productIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = Number(cart.products.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
      );
      await cart.save();
      return res.status(200).json({ message: "Đã xoá sản phẩm khỏi giỏ hàng", cart });
    } else {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const getListCart = async (req, res) => {
  const { userId, guestId } = req.query
  try {
    const cart = await getCart(userId, guestId)
    if (cart) {
      return res.status(200).json(cart)
    } else {
      return res.status(404).json("Giohang khong ton tai")
    }
  } catch (error) {
    console.log(error);

  }
}
export const mergeCart = async (req, res) => {
  // console.log("User from req:", req.user); // 
  // console.log("User ID:", req.user?.id); // 

  const { guestId } = req.body;
  if (!guestId) {
    return res.status(400).json({ message: "Thiếu guestId" });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
  }

  try {
    const guestCart = await cartModel.findOne({ guestId }).lean();
    if (!guestCart || guestCart.products.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng khách trống hoặc không tồn tại" });
    }

    let userCart = await cartModel.findOne({ user: req.user.id });

    if (userCart) {
      const updatedProducts = [...userCart.products];

      guestCart.products.forEach((guestProduct) => {
        const existingIndex = updatedProducts.findIndex(
          (item) =>
            item.productId.toString() === guestProduct.productId.toString() &&
            item.size === guestProduct.size &&
            item.color === guestProduct.color
        );

        if (existingIndex > -1) {
          updatedProducts[existingIndex].quantity += guestProduct.quantity;
        } else {
          updatedProducts.push(guestProduct);
        }
      });

      userCart.products = updatedProducts;
      userCart.totalPrice = updatedProducts.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      await userCart.save();
      await cartModel.deleteOne({ guestId });

      return res.status(200).json(userCart);
    } else {
      const newCartData = { ...guestCart, user: req.user.id };
      delete newCartData._id;
      delete newCartData.guestId;
      const newCart = await cartModel.create(newCartData);
      await cartModel.deleteOne({ guestId });
      return res.status(200).json(newCart);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};




