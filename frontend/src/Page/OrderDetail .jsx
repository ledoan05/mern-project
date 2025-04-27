import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchOrderDetail } from "@/redux/slices/order";
import { Card, CardContent } from "@/components/ui/card";

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


  // Nếu đang tải
  if (loading)
    return <div className="text-center py-10 mt-36">Đang tải...</div>;

  // Nếu có lỗi
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  // Nếu không có orderDetail
  if (!orderDetail)
    return (
      <div className="text-center py-10 mt-36">Không tìm thấy đơn hàng.</div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 mt-96">
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
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  orderDetail.status === "Approved"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {orderDetail.status}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-1">Payment Info</h4>
              <p>Phương thức: {orderDetail.paymentMethod}</p>
              <p>
                Trạng thái:{" "}
                {orderDetail.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Shipping Info</h4>
              <p>Phương thức: {orderDetail.shippingMethod || "Standard"}</p>
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
                    <th className="px-4 py-2 text-center">Unit Price</th>
                    <th className="px-4 py-2 text-center">Quantity</th>
                    <th className="px-4 py-2 text-right">Total</th>
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
                        <span className="text-blue-600">{item.name}</span>
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
            <Link to="/order" className="text-blue-600 hover:underline">
              ← Back to My Orders
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
