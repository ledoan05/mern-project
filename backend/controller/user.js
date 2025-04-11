import { userModel } from "../models/user.js"
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'


export const Register = async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Kiểm tra input hợp lệ
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  try {
    // ✅ Kiểm tra xem email đã tồn tại chưa
    const check = await userModel.findOne({ email });
    if (check) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại!" });
    }      

    // ✅ Mã hóa mật khẩu
    const hashPass = await bcrypt.hash(password, 10);

    // ✅ Tạo user mới
    const user = new userModel({ name, email, password: hashPass });
    await user.save();

    user.password = undefined; // Không trả về mật khẩu

    // ✅ Tạo token
    const payLoad = {  id: user._id, name: user.name, role: user.role  };
    const token = Jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // ✅ Trả về phản hồi với token
    return res.status(201).json({
      message: "Đăng ký tài khoản thành công!",
      data: user,
      token: token, // Trả về token để frontend có thể lưu
    });

  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
  }
};


export const Login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await userModel.findOne({ email })
    if (!user) return res.status(400).json({
      message: "Email khong ton tai"
    })
    const checkPass = await bcrypt.compare(password, user.password)
    if (!checkPass) return res.status(400).json({
      message: "Mat khau khong dung111"     
    })
    const payLoad = { id: user._id, name: user.name, role: user.role  }
    const token = Jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: "1h" })
    // console.log("🔹 Giải mã token:", Jwt.decode(token));
   
    user.password = undefined
    res.status(201).json({
      message: "Dang nhap thanh cong",
      data: user,
      token: token,
    })
  } catch (error) {
    console.log(error);
    // res.status(500).send({
    //   message: "Failed"
    // })
  }
}