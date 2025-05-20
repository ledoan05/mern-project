import { orderModel } from "../models/order.js";
import { cartModel } from "../models/cart.js";
import axios from "axios";
import moment from "moment";
import CryptoJS from "crypto-js";
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
// Thanh toán COD 
export const createOrder = async (req, res) => {
  const { orderItems, shipAddress, paymentMethod, totalPrice } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Bạn cần đăng nhập để tạo đơn hàng." });
  }

  const user = req.user;

  const order = new orderModel({
    orderItems,
    shipAddress,
    paymentMethod,
    totalPrice,
    user: user.id,
  });

  try {
    const createdOrder = await order.save();
    await cartModel.findOneAndDelete({ userId: user._id });

    res.status(201).json({
      message: "Đơn hàng đã được tạo và giỏ hàng đã được xóa.",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({ message: error.message });
  }
};
// Thanh toán ZaloPay
export const paymentZaloRouter = async (req, res) => {
  console.log("Dữ liệu nhận từ frontend:", req.body);
  const { amount, paymentMethod, bank_code, orderItems, shipAddress } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Số tiền thanh toán không hợp lệ. Vui lòng nhập số tiền dương." });
  }

  if (!paymentMethod || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ message: "Thiếu thông tin thanh toán hoặc danh sách sản phẩm." });
  }

  const transID = Math.floor(Math.random() * 1000000);
  const items = orderItems.map((item, index) => ({
    itemid: item._id || `item${index}`,
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
    amount,
    description: "Thanh toán",
    ...(bank_code && { bank_code }),
    callback_url: "https://00be-58-186-216-147.ngrok-free.app/api/order/callback",
  };

  const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const zaloRes = await axios.post(config.endpoint, null, { params: order });

    if (zaloRes.data?.order_url) {
      return res.status(200).json({ order_url: zaloRes.data.order_url });
    } else {
      return res.status(400).json({ message: "Không nhận được URL thanh toán từ ZaloPay.", error: zaloRes.data });
    }
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu thanh toán ZaloPay:", error);
    return res.status(500).json({ message: "Có lỗi xảy ra khi yêu cầu thanh toán ZaloPay.", error: error.message });
  }
};
// Xử lý callback từ ZaloPay sau khi thanh toán
export const callbackRouter = async (req, res) => {
  console.log("📥 Full callback body:", req.body);

  let result = {};

  try {
    const { data, mac: reqMac } = req.body;

    // Validate MAC
    const mac = CryptoJS.HmacSHA256(data, config.key2).toString();
    if (reqMac !== mac) {
      console.warn("⚠️ MAC không hợp lệ!");
      result.return_code = -1;
      result.return_message = "MAC không hợp lệ";
      return res.json(result);
    }

    const dataJson = JSON.parse(data);
    const embedData = JSON.parse(dataJson.embed_data || "{}");

    // Xử lý trường hợp thiếu return_code
    let returnCode = dataJson.return_code;
    if (returnCode === undefined) {
      console.warn("⚠️ Không có return_code trong callback. Gọi API kiểm tra trạng thái...");

      // Gọi API kiểm tra trạng thái đơn hàng
      const queryMac = CryptoJS.HmacSHA256(`${config.app_id}|${dataJson.app_trans_id}|${config.key1}`, config.key1).toString();
      const queryRes = await axios.post("https://sb-openapi.zalopay.vn/v2/query", null, {
        params: {
          app_id: config.app_id,
          app_trans_id: dataJson.app_trans_id,
          mac: queryMac,
        },
      });

      returnCode = queryRes.data.return_code;
      console.log("🔁 return_code từ query API:", returnCode);
    }

    const parsedReturnCode = parseInt(returnCode);
    const paymentStatus = parsedReturnCode === 1 ? "success" : "failed";

    const orderData = {
      user: embedData.userId,
      orderItems: embedData.orderItems,
      shipAddress: embedData.shippingAddress,
      paymentMethod: "ZaloPay",
      totalPrice: dataJson.amount,
      isPaid: parsedReturnCode === 1,
      paymentStatus,
      paidAt: parsedReturnCode === 1 ? new Date() : null,
    };

    const order = new orderModel(orderData);
    await order.save();

    console.log("✅ Đơn hàng đã lưu:", orderData);


    if (parsedReturnCode === 1) {
      await cartModel.deleteOne({ user: embedData.userId });
      console.log("🛒 Giỏ hàng đã được xóa sau khi thanh toán thành công.");
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

export const getOrder = async (req, res) => {
  try {
    const order = await orderModel.find({ user: req.user.id }).sort({
      createdAt: -1
    })
    res.json(order)
  } catch (error) {
    console.log(error);
  }
}
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id).populate("user", "name email")
    if (!order) {
      return res.status(401).json({ message: "Khong ton tai " })
    }
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
  }
}

