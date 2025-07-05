import { orderModel } from "../models/order.js";
import { cartModel } from "../models/cart.js";
import { productModel } from "../models/product.js";
import { userModel } from "../models/user.js";
import axios from "axios";
import moment from "moment";
import CryptoJS from "crypto-js";
import mongoose from "mongoose";

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

// ========================== ĐẶT HÀNG COD ==========================
export const createOrder = async (req, res) => {
  const { orderItems, shipAddress, paymentMethod, totalPrice } = req.body;
  if (!req.user) return res.status(401).json({ message: "Bạn cần đăng nhập để tạo đơn hàng." });
  const user = req.user;
  console.log("📝 Tạo đơn hàng COD cho user:", user.id);

  try {
    // Kiểm tra tồn kho từng sản phẩm
    for (const item of orderItems) {
      const product = await productModel.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Sản phẩm "${item.name}" không tồn tại.` });
      if (product.countInStock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm "${item.name}" chỉ còn ${product.countInStock} sản phẩm trong kho.` });
      }
    }

    // Trừ tồn kho từng sản phẩm (KHÔNG dùng transaction)
    for (const item of orderItems) {
      const product = await productModel.findById(item.productId);
      product.countInStock -= item.quantity;
      await product.save();
    }

    const order = new orderModel({
      orderItems,
      shipAddress,
      paymentMethod: "COD",
      totalPrice,
      user: user.id,
      isPaid: false,
      paymentStatus: "pending",
    });
    const createdOrder = await order.save();

    // Tự động lưu địa chỉ giao hàng cho user
    try {
      await userModel.findByIdAndUpdate(
        user.id,
        { 
          shippingAddress: {
            name: shipAddress.name,
            phone: shipAddress.phone,
            address: shipAddress.address,
            city: shipAddress.city
          }
        }
      );
      console.log("✅ Đã lưu địa chỉ giao hàng cho user:", user.id);
    } catch (error) {
      console.warn("⚠️ Không thể lưu địa chỉ giao hàng:", error.message);
    }

    const cartDeleted = await cartModel.findOneAndDelete({ userId: user._id });
    if (!cartDeleted) console.warn("⚠️ Không tìm thấy giỏ hàng để xoá sau khi tạo đơn COD cho:", user._id);
    else console.log("🧹 Giỏ hàng đã xoá sau khi đặt COD");

    res.status(201).json({ message: "Đơn hàng đã được tạo và giỏ hàng đã được xóa.", order: createdOrder });
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng COD:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========================== THANH TOÁN ZALOPAY ==========================
export const paymentZaloRouter = async (req, res) => {
  console.log("📥 Dữ liệu nhận từ frontend:", req.body);
  const { amount, paymentMethod, bank_code, orderItems, shipAddress } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) return res.status(400).json({ message: "Số tiền thanh toán không hợp lệ." });
  if (!paymentMethod || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0)
    return res.status(400).json({ message: "Thiếu thông tin thanh toán hoặc danh sách sản phẩm." });

  const transID = Math.floor(Math.random() * 1000000);
  const roundedAmount = Math.round(amount);
  const items = orderItems.map((item, index) => ({
    itemid: item.productId || item._id || `item${index}`,
    itemname: item.name,
    itemprice: item.price,
    itemquantity: item.quantity,
  }));

  const embed_data = {
    userId: req.user.id,
    orderItems,
    shippingAddress: shipAddress,
    redirecturl: "http://localhost:5173/payment-success?paymentMethod=zalopay&status=1",
  };

  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: req.user.id,
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: roundedAmount,
    description: "Thanh toán qua ZaloPay",
    ...(bank_code && { bank_code }),
    callback_url: "https://e944-42-118-62-100.ngrok-free.app/api/order/callback",
  };
  const dataString = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  order.mac = CryptoJS.HmacSHA256(dataString, config.key1).toString();

  try {
    const zaloRes = await axios.post(config.endpoint, null, { params: order });
    if (zaloRes.data?.order_url) return res.status(200).json({ order_url: zaloRes.data.order_url });
    else return res.status(400).json({ message: zaloRes.data.return_message || "Không nhận được URL thanh toán từ ZaloPay.", error: zaloRes.data });
  } catch (error) {
    console.error("❌ Lỗi gửi thanh toán ZaloPay:", error?.response?.data || error.message);
    return res.status(500).json({ message: "Có lỗi xảy ra khi gửi yêu cầu thanh toán đến ZaloPay.", error: error?.response?.data || error.message });
  }
};

// ========================== CALLBACK THANH TOÁN ZALOPAY ==========================
export const callbackRouter = async (req, res) => {
  console.log("📥 Full callback body:", req.body);

  let result = {};
  try {
    const { data, mac: reqMac } = req.body;
    const mac = CryptoJS.HmacSHA256(data, config.key2).toString();

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "MAC không hợp lệ";
      return res.json(result);
    }

    const dataJson = JSON.parse(data);
    const embedData = JSON.parse(dataJson.embed_data || "{}");
    const shippingAddress = {
      address: embedData.shippingAddress?.address,
      city: embedData.shippingAddress?.city,
    };
    const fixedOrderItems = embedData.orderItems.map(item => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
    }));
    const appTransId = dataJson.app_trans_id;
    let returnCode = dataJson.return_code;

    if (returnCode === undefined) {
      // Gọi API kiểm tra trạng thái đơn hàng
      const queryMac = CryptoJS.HmacSHA256(`${config.app_id}|${dataJson.app_trans_id}|${config.key1}`, config.key1).toString();
      const queryRes = await axios.post("https://sb-openapi.zalopay.vn/v2/query", null, {
        params: { app_id: config.app_id, app_trans_id: appTransId, mac: queryMac },
      });
      returnCode = queryRes.data.return_code;
      console.log("🔁 Gửi query check trạng thái đơn hàng, return_code:", returnCode);
    }

    const isPaid = parseInt(returnCode) === 1;
    const paymentStatus = isPaid ? "success" : "failed";
    const existingOrder = await orderModel.findOne({ app_trans_id: appTransId });
    if (existingOrder) return res.json({ return_code: 1, return_message: "Đơn hàng đã xử lý trước đó." });

    const orderData = {
      user: embedData.userId,
      orderItems: fixedOrderItems,
      shipAddress: shippingAddress,
      paymentMethod: "ZaloPay",
      totalPrice: dataJson.amount,
      isPaid,
      paymentStatus,
      paidAt: isPaid ? new Date() : null,
      app_trans_id: appTransId
    };

    // Lưu đơn hàng
    try {
      const order = new orderModel(orderData);
      const validateErr = order.validateSync();
      if (validateErr) {
        console.error("❌ Lỗi xác thực đơn hàng:", validateErr);
        return res.json({ return_code: 0, return_message: "Lỗi dữ liệu đơn hàng", error: validateErr.message });
      }
      const saved = await order.save();
      console.log("✅ Đơn hàng ZaloPay đã lưu thành công:", saved);

      // --- TRỪ TỒN KHO SAU KHI THANH TOÁN ---
      if (isPaid) {
        for (const item of fixedOrderItems) {
          const product = await productModel.findById(item.productId);
          if (!product) {
            console.warn(`Không tìm thấy sản phẩm với ID ${item.productId} để trừ kho`);
            continue;
          }
          if (product.countInStock < item.quantity) {
            console.warn(`Sản phẩm "${product.name}" không đủ tồn kho khi thanh toán ZaloPay!`);
            continue;
          }
          product.countInStock -= item.quantity;
          await product.save();
        }
        // Xóa giỏ hàng
        try {
          const cartDel = await cartModel.findOneAndDelete({
            user: new mongoose.Types.ObjectId(embedData.userId),
          });
          if (!cartDel)
            console.warn("⚠️ Không tìm thấy giỏ hàng để xoá cho user:", embedData.userId);
          else
            console.log("🧹 Giỏ hàng đã được xoá sau thanh toán ZaloPay.");
        } catch (delErr) {
          console.error("❌ Lỗi khi xoá giỏ hàng:", delErr);
        }
      }
    } catch (saveErr) {
      console.error("❌ Lỗi khi lưu đơn hàng:", saveErr);
      return res.json({ return_code: 0, return_message: "Lỗi lưu đơn hàng", error: saveErr.message });
    }

    result.return_code = 1;
    result.return_message = "Thanh toán và lưu đơn hàng thành công";
  } catch (error) {
    console.error("❌ Lỗi xử lý callback:", error);
    result.return_code = 0;
    result.return_message = error.message;
  }
  res.json(result);
};

// ========================== LẤY ĐƠN HÀNG THEO USER ==========================
// Lấy danh sách đơn hàng của người dùng
export const getOrder = async (req, res) => {
  try {
    const order = await orderModel.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(order);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Không thể lấy đơn hàng" });
  }
};

// ========================== LẤY CHI TIẾT ĐƠN HÀNG ==========================
// Lấy thông tin đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ message: "Không thể lấy chi tiết đơn hàng" });
  }
};
