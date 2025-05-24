import { useDispatch, useSelector } from "react-redux";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import axios from "../untils/axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/redux/slices/cartSlice";


const formSchema = z.object({
  name: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ tối thiểu 5 ký tự"),
  city: z.string().min(2, "Thành phố tối thiểu 2 ký tự"),
});

const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const cartItems = cart?.cart?.products || [];
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("COD");


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const handleCheckout = async (data) => {
    if (!cartItems.length) return;

    const orderData = {
      orderItems: cartItems,
      shipAddress: data,
      paymentMethod: paymentMethod,
      amount: totalPrice,
      totalPrice,
    };

    const token = localStorage.getItem("token");
    try {
      if (paymentMethod === "COD") {
        const res = await axios.post("/api/order/create", orderData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 201) {
          dispatch(clearCart());
          navigate("/payment-success");
        }
      } else if (paymentMethod === "ZALOPAY") {
        const zaloRes = await axios.post("/api/order/create-order",orderData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
    <div className="mt-24 mx-auto p-6 flex flex-col md:flex-row gap-8 max-w-7xl">
   
      {/* Form thanh toán */}
      <form
        onSubmit={handleSubmit(handleCheckout)}
        className="md:w-2/4 space-y-6"
      >
        <h2 className="text-2xl font-bold">Thông tin thanh toán</h2>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input {...register("name")} placeholder="Nhập họ và tên" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input {...register("phone")} placeholder="Nhập số điện thoại" />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ</Label>
              <Input {...register("address")} placeholder="Nhập địa chỉ" />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Thành phố</Label>
              <Input {...register("city")} placeholder="Nhập thành phố" />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Xác nhận thanh toán 
        </Button>
      </form>
      {/* Giỏ hàng */}
      <div className="md:w-2/4 space-y-6">
        <h2 className="text-2xl font-bold">Giỏ hàng của bạn</h2>
        <Card>
          <CardContent className="p-6 space-y-4">
            {cartItems.length === 0 ? (
              <p>Giỏ hàng trống.</p>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <img
                    className="w-16 h-16 object-cover rounded"
                    src={item.images?.[0] || "/fallback-image.jpg"}
                    alt={item.name}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {item.price.toLocaleString()}₫
                    </p>
                  </div>
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

        {/* Phương thức thanh toán */}
        <h2 className="text-2xl font-bold">Phương thức thanh toán</h2>
        <div className="flex gap-4">
          <Button
            variant={paymentMethod === "COD" ? "default" : "outline"}
            onClick={() => setPaymentMethod("COD")}
          >
            COD
          </Button>
          <Button
            variant={paymentMethod === "ZALOPAY" ? "default" : "outline"}
            onClick={() => setPaymentMethod("ZALOPAY")}
          >
            ZaloPay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
