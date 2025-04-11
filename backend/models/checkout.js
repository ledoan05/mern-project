
import mongoose from "mongoose";

const checkoutItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity : {
    type  : Number,
    required  : true
  }
}, {
  _id: false
})

const checkoutSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  checkoutItems: [checkoutItemSchema],
  shipAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ["ZaloPay", "COD"], 
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  isFinalzed: {
    type: Boolean,
    default: false
  },
  finalzedAt: {
    type: Date
  },
},{
  timestamps : true
})
export const checkoutModel = mongoose.model('checkout',checkoutSchema)