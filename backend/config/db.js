import mongoose from "mongoose"

const connectDB = async()=>{
  try {
    await mongoose.connect(process.env.MONGOOSE_URI)
    console.log("Ket noi thanh cong");
  } catch (error) {
    console.log("Ket no that bai");
    
  }
}

export default connectDB