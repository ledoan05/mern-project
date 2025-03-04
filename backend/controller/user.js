import { userModel } from "../models/User.js"
import userValidate from "../validate/user.js"
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'

export const Register = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const { error } = userValidate.validate({ username, email, password }, { abortEarly: false })
    if (error) return res.status(400).json({
      message: error.details.map(item => item.message)
    })
    const check = await userModel.findOne({ email })
    if (check) return res.status(400).json({
      message: "Tai khoan da ton tai"
    })
    const hashPass = await bcrypt.hash(password, 10)
    const user = await new userModel({ username, email, password: hashPass }).save()
    const payLoad = { user: { id: user._id, username: user.username, role: user.role } }
    const token = Jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.status(201).json({
      message: "Dang ky tai khoan thanh cong",
      data: user,
      token: token
    })

  } catch (error) {
    console.log(error);
    
    // res.status(500).send({
    //   message: "Failed"
    // })
  }
}

export const Login = async (req, res) => {

}