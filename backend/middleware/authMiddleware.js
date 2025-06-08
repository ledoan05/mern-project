import jwt from 'jsonwebtoken';

// Middleware để xác thực người dùng
export const authMiddle = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token đã hết hạn" }); 
    }
    // console.error("Lỗi xác thực:", error.message);
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};
// Middleware để kiểm tra quyền admin
export const admin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Bạn không có quyền admin!" });
};
