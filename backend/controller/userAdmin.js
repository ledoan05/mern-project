import { userModel } from "../models/user.js";


export const getUser = async (req, res) => {
  try {
    const user = await userModel.find({})
    res.json(user)
  } catch (error) {
    console.log(error);
  }
}

export const addUser = async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    let user = await userModel.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }
    user = new userModel({
      name,
      email,
      password,
      role: role || "user"
    })
    await user.save()
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" })
  }
}

export const editUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id)
    if (user) {
      const { name, email, password, role } = req.body;

      // Cập nhật các trường thông tin
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;

      // Nếu có mật khẩu mới, băm mật khẩu trước khi lưu
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await user.save();

      // Tạo lại token mới
      const payLoad = { id: updatedUser._id, name: updatedUser.name, role: updatedUser.role };
      const token = Jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = Jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

      // Xóa mật khẩu khỏi kết quả trả về
      updatedUser.password = undefined;

      // Trả lại thông tin người dùng mới cùng token
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
        token,
        refreshToken
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (user) {
      // Xóa người dùng
      await user.deleteOne();

      // Trả lại phản hồi yêu cầu client xóa token
      res.status(200).json({
        message: "User deleted successfully. Please logout."
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


