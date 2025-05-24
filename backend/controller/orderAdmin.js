import { orderModel } from "../models/order.js"


export const getOrder  = async (req, res) => {
  try {
    const order = await orderModel.find({}).populate("user", "name email")
    res.json(order)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" })
  }
}

export const updateOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id)
    if(order) {
      order.status = req.body.status || order.status
      order.isDelivered = req.body.status === "Cho xac nhan" ? true : order.isDelivered
      order.isDelivered = req.body.status === "Cho xac nhan" ? Date.now() : order.isDelivered
      const updatedOrder = await order.save()
      res.json({
        message: "Cập nhật đơn hàng thành công",
        order: updatedOrder
      })
    }
    else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" }) 
  }
}

export const deleteOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id)
    if(order){
      await order.deleteOne()
      res.status(200).json({ message: "Xóa đơn hàng thành công" })
    }else{
      res.status(404).json({ message: "Không tìm thấy đơn hàng" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" }) 
  }
}