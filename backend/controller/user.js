import { userModel } from "../models/user.js";
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';

//Đăng ký tài khoản
export const Register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }
  try {
    const check = await userModel.findOne({ email });
    if (check) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại!" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashPass });
    await user.save();

    user.password = undefined;
    const payLoad = { id: user._id, name: user.name, role: user.role };
    const token = Jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = Jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      message: "Đăng ký tài khoản thành công!",
      data: user,
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
  }
};
//Đăng nhập tài khoản
export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) return res.status(400).json({ message: "Mật khẩu không đúng" });

    const payLoad = { id: user._id, name: user.name, role: user.role };
    const token = Jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = Jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    user.password = undefined;

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: user,
      token,
      refreshToken,
    });
  } catch (error) {
    // console.log("Lỗi đăng nhập:", error);
    return res.status(500).json({ message: "Đăng nhập thất bại" });
  }
};
//Tạo refresh token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Thiếu refresh token' });
  }

  try {
    const decoded = Jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newToken = Jwt.sign(
      { id: decoded.id, name: decoded.name, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token: newToken });
  } catch (error) {
    // console.error("Lỗi refresh token:", error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token đã hết hạn' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Refresh token không hợp lệ' });
    }
    return res.status(500).json({ message: 'Lỗi server khi xác minh refresh token' });
  }
};

//Lưu địa chỉ giao hàng
export const saveShippingAddress = async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;
    const userId = req.user.id;

    if (!name || !phone || !address || !city) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin địa chỉ!" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { shippingAddress: { name, phone, address, city } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    return res.status(200).json({
      message: "Lưu địa chỉ giao hàng thành công!",
      shippingAddress: user.shippingAddress
    });
  } catch (error) {
    console.error("Lỗi lưu địa chỉ:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
  }
};

//Lấy địa chỉ giao hàng
export const getShippingAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    return res.status(200).json({
      shippingAddress: user.shippingAddress || null
    });
  } catch (error) {
    console.error("Lỗi lấy địa chỉ:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
  }
};

//Xóa địa chỉ giao hàng
export const deleteShippingAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $unset: { shippingAddress: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    return res.status(200).json({
      message: "Xóa địa chỉ giao hàng thành công!"
    });
  } catch (error) {
    console.error("Lỗi xóa địa chỉ:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
  }
};
