import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  discountPrice: {
    type: Number,
  },
  countInStock: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String
  },
  sizes: {
    type: [String],
    required: true
  },
  colors: {
    type: [String],
    required: true
  },
  collections: {
    type: String,
    required: true
  },
  material: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Men", "Wommen", "Unisex"]
  },
  image: [
    {
      url: {
        type: String,
        required: true
      },
      alt: {
        type: String
      }
    }
  ],
  isFeatured : {
    type : Boolean,
    default : false
  },
  isPublished : {
    type: Boolean,
    default: false
  },
  rating : {
    type  : Number,
    default : 0
  },
  numReviews : {
    type : Number,
    default : 0
  },
  tag : [String],
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user",
    required : true
  },
  metaTitle : {
    type: String,
  },
  metaDescription : {
    type : String
  },
  metaKeywords: {
    type: String
  }, 
  dimensions : {
    length : Number,
    width: Number,
    height : Number
  },
  weight  : Number
},{
  timestamps : true,
})

export const productModel = mongoose.model("product" , productSchema)