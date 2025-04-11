import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/redux/slices/cartSlice";

const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.cart?.products || [];
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cartItems.length) return;

    const orderData = {
      orderItems: cartItems,
      shipAddress: formData,
      paymentMethod: paymentMethod,
      amount: totalPrice,
      totalPrice,
    };

    const token = localStorage.getItem("token");

    try {
      if (paymentMethod === "COD") {
        const res = await axios.post(
          "http://localhost:3000/api/order/create",
          orderData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 201) {
          dispatch(clearCart());
          navigate("/payment-success");
        }
      } else if (paymentMethod === "ZALOPAY" ) {
        const zaloRes = await axios.post(
          "http://localhost:3000/api/order/create-order",
          orderData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Phản hồi từ ZaloPay:", zaloRes.data);
        if (zaloRes.data?.order_url) {
          window.location.href = zaloRes.data.order_url;
        } else {
          console.error("Không nhận được URL ZaloPay");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Thông tin thanh toán</h2>
      <Card>
        <CardContent  className="p-4 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled />
          </div>
          <div>
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nhập họ và tên"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="address">Địa chỉ giao hàng</Label>
            <Input
              id="address"
              name="address"
              placeholder="Nhập địa chỉ cụ thể"
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="city">Thành phố</Label>
            <Input
              id="city"
              name="city"
              placeholder="Nhập thành phố"
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold">Sản phẩm trong giỏ hàng</h2>
      <Card>
        <CardContent className="p-4 space-y-4">
          {cartItems.length === 0 ? (
            <p>Giỏ hàng trống.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={item.id || index} className="flex justify-between py-2">
                <span>
                  <img
                    className="w-16"
                    src={item.images?.[0] || "/fallback-image.jpg"}
                    alt={item.name}
                  />
                </span>
                <span>{item.name}</span>
                <span className="font-bold">
                  {item.quantity} x {item.price}₫
                </span>
              </div>
            ))
          )}
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng:</span>
            <span>{totalPrice.toLocaleString()}₫</span>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
      <div className="flex gap-4">
        <Button
          variant={paymentMethod === "COD" ? "default" : "outline"}
          onClick={() => setPaymentMethod("COD")}
        >
          Thanh toán khi nhận hàng (COD)
        </Button>
        <Button
          variant={paymentMethod === "ZALOPAY" ? "default" : "outline"}
          onClick={() => setPaymentMethod("ZALOPAY")}
        >
          Thanh toán qua ZaloPay
        </Button>
      </div>

      <Button className="w-full mt-4" onClick={handleCheckout}>
        Xác nhận thanh toán
      </Button>
    </div>
  );
};

export default CheckoutPage;
