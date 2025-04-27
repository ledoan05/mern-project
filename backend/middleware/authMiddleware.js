import jwt from 'jsonwebtoken'

export const authMiddle = async (req, res, next) => {
  let token = req.headers.authorization
  if (!token) return res.status(401).json({
    message: "Ban chua dang nhap"
  })
  try {
    token = token.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    // console.log(" Thông tin user từ token:", req.user);
    next()
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Token không hợp lệ!kđkjfkdjfdkfjd" });
  }
}

export const admin = async (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next()
  } else {
    res.status(403).json({ message: "Ban khong co quyen admin!" });
  }

}