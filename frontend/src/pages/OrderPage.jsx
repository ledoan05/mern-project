import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { fetchOrderUser } from "@/redux/slices/order";

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderUser());
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 mt-28">
      <h2 className="text-3xl font-bold mb-6 text-center">Đơn hàng của bạn</h2>

      {loading ? (
        <div className="animate-pulse bg-gray-300 h-6 w-48 rounded mx-auto"></div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : order.length === 0 ? (
        <div className="text-center text-gray-600">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-6">
          {order.map((item) => (
            <Card
              key={item._id}
              onClick={() => navigate(`/order/${item._id}`)}
              className="cursor-pointer border hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
            >
              <CardContent className="flex p-6 gap-6 items-center">
                {/* Ảnh sản phẩm */}
                <img
                  src={item.orderItems[0]?.images[0] || "/fallback-image.jpg"}
                  alt="Ảnh sản phẩm đầu tiên"
                  className="w-20 h-20 object-cover rounded-md border"
                />

                {/* Thông tin đơn hàng */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2 text-gray-700 text-sm">
                    <p>
                      <span className="font-semibold">Mã đơn:</span> {item._id}
                    </p>
                    <p>
                      <span className="font-semibold">Địa chỉ:</span>{" "}
                      {item.shipAddress?.city}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                    <p>
                      <span className="font-semibold">Số lượng:</span>{" "}
                      {item.orderItems.reduce(
                        (acc, curr) => acc + curr.quantity,
                        0
                      )}
                    </p>
                    <p>
                      <span className="font-semibold">Trạng thái:</span>
                      <span
                        className={`ml-1 px-2 py-1 rounded-full text-white text-xs ${
                          item.status === "Cho xac nhan"
                            ? "bg-yellow-500"
                            : item.status === "Cho lay hang"
                            ? "bg-blue-500"
                            : item.status === "Cho giao hang"
                            ? "bg-purple-500"
                            : item.status === "Da giao hang"
                            ? "bg-green-500"
                            : item.status === "Huy"
                            ? "bg-red-500"
                            : "bg-gray-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-6 text-gray-700 text-sm">
                    <p>
                      <span className="font-semibold">Ngày đặt:</span>{" "}
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                    <p>
                      <span className="font-semibold">Tổng tiền:</span>{" "}
                      {item.totalPrice.toLocaleString()}₫
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
