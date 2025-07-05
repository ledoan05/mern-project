import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "../untils/axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/redux/slices/cartSlice";
import {
  fetchShippingAddress,
  saveShippingAddress,
} from "@/redux/slices/shippingAddressSlice";

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
  const cartItems = cart?.cart?.products || [];
  const user = useSelector((state) => state.auth.user);
  const shippingAddress = useSelector((state) => state.shippingAddress);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  // Lấy địa chỉ đã lưu khi component mount
  useEffect(() => {
    if (user) {
      dispatch(fetchShippingAddress());
    }
  }, [dispatch, user]);

  // Tự động điền form nếu có địa chỉ đã lưu và user chọn sử dụng
  useEffect(() => {
    if (useSavedAddress && shippingAddress.address) {
      setValue("name", shippingAddress.address.name);
      setValue("phone", shippingAddress.address.phone);
      setValue("address", shippingAddress.address.address);
      setValue("city", shippingAddress.address.city);
    }
  }, [useSavedAddress, shippingAddress.address, setValue]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const handleCheckout = async (data) => {
    if (!cartItems.length) return;

    // Lưu địa chỉ mới nếu user chọn
    if (saveNewAddress && !useSavedAddress) {
      try {
        await dispatch(saveShippingAddress(data)).unwrap();
      } catch (error) {
        console.error("Không thể lưu địa chỉ:", error);
      }
    }

    const orderData = {
      orderItems: cartItems,
      shipAddress: data,
      paymentMethod,
      amount: totalPrice,
      totalPrice,
    };

    const token = localStorage.getItem("token");

    try {
      if (paymentMethod === "COD") {
        const res = await axios.post("/api/order/create", orderData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 201) {
          dispatch(clearCart());
          navigate("/payment-success");
        }
      } else if (paymentMethod === "ZaloPay") {
        const zaloRes = await axios.post("/api/order/create-order", orderData, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
      <form
        onSubmit={handleSubmit(handleCheckout)}
        className="md:w-2/4 space-y-6"
      >
        <h2 className="text-2xl font-bold">Thông tin thanh toán</h2>

        {/* Hiển thị địa chỉ đã lưu nếu có */}
        {shippingAddress.address && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="useSavedAddress"
                  checked={useSavedAddress}
                  onCheckedChange={setUseSavedAddress}
                />
                <Label htmlFor="useSavedAddress" className="font-medium">
                  Sử dụng địa chỉ đã lưu
                </Label>
              </div>
              {useSavedAddress && (
                <div className="ml-6 space-y-1 text-sm">
                  <p>
                    <strong>Họ tên:</strong> {shippingAddress.address.name}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {shippingAddress.address.phone}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {shippingAddress.address.address}
                  </p>
                  <p>
                    <strong>Thành phố:</strong> {shippingAddress.address.city}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Form nhập địa chỉ mới */}
        {(!useSavedAddress || !shippingAddress.address) && (
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
                <Input
                  {...register("phone")}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ</Label>
                <Input {...register("address")} placeholder="Nhập địa chỉ" />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Thành phố</Label>
                <Input {...register("city")} placeholder="Nhập thành phố" />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              {/* Checkbox lưu địa chỉ mới */}
              {!useSavedAddress && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveNewAddress"
                    checked={saveNewAddress}
                    onCheckedChange={setSaveNewAddress}
                  />
                  <Label htmlFor="saveNewAddress">
                    Lưu địa chỉ này cho lần mua sau
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full">
          Xác nhận thanh toán
        </Button>
      </form>

      {/* Giỏ hàng và chọn phương thức */}
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

        <h2 className="text-2xl font-bold">Phương thức thanh toán</h2>
        <div className="flex gap-4">
          <Button
            variant={paymentMethod === "COD" ? "default" : "outline"}
            onClick={() => setPaymentMethod("COD")}
          >
            COD
          </Button>
          <Button
            variant={paymentMethod === "ZaloPay" ? "default" : "outline"}
            onClick={() => setPaymentMethod("ZaloPay")}
          >
            ZaloPay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
