import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    requied: true
  },
  email: {
    type: String,
    requied: true,
    unique: true
  },
  password: {
    type: String,
    requied: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
}, {
  timestamps: true
})

export const userModel = mongoose.model('user', userSchema)