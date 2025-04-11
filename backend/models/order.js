import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  },
  name: { type: String, required: true },
  images: [{ type: String }], // Mảng các chuỗi hình ảnh
  price: { type: Number, required: true },
  size: String,
  color: String,
  quantity: { type: Number, required: true } 
}, { _id: false });

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  orderItems: [orderItemSchema],
  shipAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    
  },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"], 
    default: "pending"
  },
  paymentDetails: { type: mongoose.Schema.Types.Mixed }, 
  status: {
    type: String,
    enum: ["Cho xac nhan", "Cho lay hang", "Cho giao hang", "Da giao hang", "Huy"],
    default: "Cho xac nhan"
  }
}, { timestamps: true });

export const orderModel = mongoose.model("order", orderSchema);
