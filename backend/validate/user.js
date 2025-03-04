import Joi from "joi";

const userValidate =  Joi.object({
  username : Joi.string().required().trim().messages({
    "any.required" : "Bat buoc nhap",
    "string.empty" : "Khong duoc de trong"
  }),
  email : Joi.string().required().trim().email().messages({
    "any.required": "Bat buoc nhap",
    "string.empty": "Khong duoc de trong",
    "string.email" : "Khong dung dinh dang",
  }),
  password: Joi.string().required().trim().min(6).messages({
    "any.required": "Bat buoc nhap",
    "string.empty": "Khong duoc de trong",
    "string.min": "Mat khau khong duoi 6 ky tu",
  }),
})

export default userValidate