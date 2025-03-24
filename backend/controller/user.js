import { userModel } from "../models/user.js"
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'

export const Register = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const check = await userModel.findOne({ email })
    if (check) return res.status(400).json({
      message: "Tai khoan da ton tai"
    })
    const hashPass = await bcrypt.hash(password, 10)
    const user = await new userModel({ name, email, password: hashPass }).save()
    user.password = undefined
    // const payLoad = { user: { id: user._id, name: user.name, role: user.role } }
    // const token = Jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.status(201).json({
      message: "Dang ky tai khoan thanh cong",
      data: user,
      // token: token,
    })

  } catch (error) {
    console.log(error);

    // res.status(500).send({
    //   message: "Failed"
    // })
  }
}

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