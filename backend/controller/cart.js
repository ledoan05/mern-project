import { cartModel } from "../models/cart.js"
import { productModel } from "../models/product.js"

// Lấy giỏ hàng theo userId hoặc guestId
export const getCart = async (userId, guestId) => {
  if (userId) {
    return await cartModel.findOne({ user: userId })
  } else if (guestId) {
    return await cartModel.findOne({ guestId: guestId })
  }
}
//Thêm sản phẩm vào giỏ hàng
export const addCart = async (req, res) => {
  // console.log("Dữ liệu nhận từ frontend:", req.body);
  const { productId, quantity, size, color, guestId, userId, images } = req.body;

  try {
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json("Không có sản phẩm trong giỏ hàng");

    let cart = await getCart(userId, guestId);
    if (!cart) {
      cart = new cartModel({
        user: userId || undefined,
        guestId: guestId || "guest_" + new Date().getTime(),
        products: [],
        totalPrice: 0,
      });
    }

    const existingProduct = cart.products.find(
      (item) => item.productId.equals(productId) && item.size === size && item.color === color
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({
        productId,
        name: product.name,
        price: product.price,
        size,
        color,
        quantity,
        images: images?.map(img => img.url) || product.images
      });
    }

    cart.totalPrice = Number(cart.products.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2));
    await cart.save();
    // console.log("Dữ liệu sản phẩm trước khi lưu:", JSON.stringify(cart.products, null, 2));
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
//Sửa sản phẩm trong giỏ hàng
export const editCart = async (req, res) => {
  try {
    // console.log("Body nhận từ client:", req.body);
    // console.log("Method:", req.method);
    // console.log("Headers:", req.headers);
    const { productId, quantity, size, color, guestId, userId } = req.body
    let cart = await getCart(userId, guestId)
    if (!cart) {
      return res.status(404).json("Sản phẩm không có trong giỏ hàng")
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
      res.status(404).json("Không tìm thấy sản phẩm trong giỏ hàng")
    }
  } catch (error) {
    console.log(error);
  }
}
//Xoá sản phẩm trong giỏ hàng
export const deleteCart = async (req, res) => {
  try {
    const { productId, size, color, guestId, userId } = req.body;
    // console.log(" Dữ liệu nhận từ client:", req.body);

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
      cart.totalPrice = Number(
        cart.products.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
      );
      await cart.save();

      // console.log("Sản phẩm đã xoá, giỏ hàng sau khi xoá:", cart);
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }
  } catch (error) {
    // console.error("Lỗi trong deleteCart:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
//Lấy danh sách sản phẩm trong giỏ hàng
export const getListCart = async (req, res) => {
  const { userId, guestId } = req.query
  try {
    const cart = await getCart(userId, guestId)
    if (cart) {
      return res.status(200).json(cart)
    } else {
      return res.status(404).json("Giỏ hàng không tồn tại")
    }
  } catch (error) {
    // console.log(error);
  }
}
//Hợp nhất giỏ hàng giữa guest và user
export const mergeCart = async (req, res) => {
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

      // 🔹 **Đảm bảo guestId không còn**
      userCart.guestId = null; // Hoặc delete userCart.guestId;
      await userCart.save();

      // 🛑 **Xóa giỏ hàng guest sau khi hợp nhất**
      await cartModel.deleteOne({ guestId });

      return res.status(200).json(userCart);
    } else {
      // 🆕 Nếu user chưa có giỏ hàng, chuyển giỏ hàng guest thành userCart
      const newCartData = { ...guestCart, user: req.user.id };
      delete newCartData._id;
      delete newCartData.guestId; // Xóa guestId

      const newCart = await cartModel.create(newCartData);
      await cartModel.deleteOne({ guestId });

      return res.status(200).json(newCart);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};





