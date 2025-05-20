import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // nếu bạn dùng Redux
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { clearCart } from "@/redux/slices/cartSlice";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paymentMethod = searchParams.get("paymentMethod");
  const status = searchParams.get("status");

  useEffect(() => {
    if (paymentMethod === "zalopay" && status === "1") {
      dispatch(clearCart());
      localStorage.removeItem("cart");

      console.log("🧹 Đã xoá giỏ hàng sau khi thanh toán ZaloPay thành công.");
    }
  }, [paymentMethod, status, dispatch]);

  const getPaymentMessage = () => {
    switch (paymentMethod) {
      case "cod":
        return "Đơn hàng của bạn sẽ được giao và thanh toán khi nhận hàng.";
      case "zalopay":
        return "Thanh toán qua ZaloPay đã hoàn tất. Cảm ơn bạn!";
      default:
        return "Cảm ơn bạn đã mua hàng.";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg bg-green-100 border border-green-300 shadow-lg rounded-lg p-6">
        <CardContent className="text-center">
          <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800">
            Thanh toán thành công!
          </h2>
          <p className="mt-4 text-gray-600">{getPaymentMessage()}</p>
          <Separator className="my-4" />
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => navigate("/")}
          >
            Quay lại trang chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
