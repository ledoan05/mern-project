import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchOrderDetail } from "@/redux/slices/order";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrderDetail = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { orderDetail, loading, error } = useSelector((state) => state.order);

  

useEffect(() => {
  console.log("Order ID từ URL là:", orderId);
  if (orderId) {
    dispatch(fetchOrderDetail(orderId));
  }
}, [dispatch, orderId]);
  if (loading)
    return <div className="text-center py-10 mt-36">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!orderDetail)
    return (
      <div className="text-center py-10 mt-36">Không tìm thấy đơn hàng.</div>
    );
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 mt-20">
      <h2 className="text-3xl font-bold mb-6">Order Details</h2>

      <Card className="shadow-md">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                Order ID:{" "}
                <span className="text-gray-600">#{orderDetail._id}</span>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(orderDetail.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <span
                className={`ml-1 px-2 py-1 rounded-full text-white text-xs ${
                  orderDetail.status === "Cho xac nhan"
                    ? "bg-yellow-500"
                    : orderDetail.status === "Cho lay hang"
                    ? "bg-blue-500"
                    : orderDetail.status === "Cho giao hang"
                    ? "bg-purple-500"
                    : orderDetail.status === "Da giao hang"
                    ? "bg-green-500"
                    : orderDetail.status === "Huy"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
              >
                {orderDetail.status}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-1">Thông tin thanh toán</h4>
              <p>Phương thức: {orderDetail.paymentMethod}</p>
              <p className="flex items-center gap-2">
                Trạng thái:
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs ${
                    orderDetail.isPaid ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {orderDetail.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Thông tin vận chuyển</h4>
              <p>Địa chỉ: {orderDetail.shipAddress?.city}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mt-6 mb-2">Products</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded">
                <thead className="bg-gray-100 text-sm">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-center">Giá</th>
                    <th className="px-4 py-2 text-center">Số lượng</th>
                    <th className="px-4 py-2 text-right">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail.orderItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <img
                          src={item.images}
                          alt={item.name}
                          className="w-12 h-12 object-cover border rounded"
                        />
                        <span>{item.name}</span>
                      </td>
                      <td className="px-4 py-2 text-center">${item.price}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 text-sm">
            <Link to="/order">
              <Button> ← Back to My Orders</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
