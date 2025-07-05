import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên không được để trống"],
    trim: true,
    minlength: [3, "Tên phải có ít nhất 3 ký tự"]
  },
  email: {
    type: String,
    required: [true, "Email không được để trống"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
  },
  password: {
    type: String,
    required: [true, "Mật khẩu không được để trống"],
    minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"]
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  shippingAddress: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true }
  }
}, { timestamps: true });

export const userModel = mongoose.model("User", userSchema);
