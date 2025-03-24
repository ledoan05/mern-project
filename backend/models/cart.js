import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  },
  name: String,
  images: [String ], 
  price: Number,
  size: String,
  color: String,
  quantity : {
    type  : Number,
    default : 1
  }
},{
  _id : false
})

const cartSchema = mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user",
  },
  guestId : {
    type :String
  },
  products : [cartItemSchema],
  totalPrice : {
    type : Number,
    required : true,
    default : 0
  }
},{
  timestamps : true
})

export const cartModel = mongoose.model("cart" , cartSchema)