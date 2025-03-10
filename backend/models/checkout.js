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
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
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
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
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
  }
},{
  timestamps : true
})
export const checkoutModel = mongoose.model('checkout',checkoutSchema)