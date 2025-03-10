import { checkoutModel } from "../models/checkout.js"

export const addCheckout = async (req, res) => {
  const { checkoutItems, shipAddress, paymentMethod, totalPrice } = req.body
  if (!checkoutItems || checkoutItems.length == 0) {
    return res.status(400).json({ message: "Khong co san pham" })
  }
  try {
    const newCheckout = await checkoutModel.create({
      user: req.user.id,
      checkoutItems: checkoutItems,
      shipAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false
    })
    console.log(req.user.id);
    res.status(200).json(newCheckout)
  } catch (error) {
    console.log(error);
  }
}