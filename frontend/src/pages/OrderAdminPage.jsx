import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import {
  deleteOrder,
  fetchOrders,
  updateOrder,
} from "@/redux/slices/orderAdminSlice";

// Trạng thái đồng bộ với enum từ schema Mongoose
const STATUS_OPTIONS = [
  "Cho xac nhan",
  "Cho lay hang",
  "Cho giao hang",
  "Da giao hang",
  "Huy",
];

export default function OrderAdminPage() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrder);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (order, status) => {
    if (order.status === status) return;
    try {
      const result = await dispatch(
        updateOrder({ id: order._id, status })
      ).unwrap();
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      dispatch(fetchOrders());
      setSelectedOrder((prev) =>
        prev && prev._id === order._id ? { ...prev, ...result.order } : prev
      );
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  useEffect(() => {
    if (selectedOrder && orders.length > 0) {
      const latest = orders.find((o) => o._id === selectedOrder._id);
      if (latest) setSelectedOrder(latest);
    }
  }, [orders]);
  
  

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteOrder(id)).unwrap();
      toast.success("Xoá đơn hàng thành công!");
      dispatch(fetchOrders());
    } catch (err) {
      console.error(err);
      toast.error("Xoá thất bại!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý đơn hàng</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã ĐH</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>
                {order.user?.name || "Ẩn"}
                <br />
                <span className="text-xs text-gray-500">
                  {order.user?.email || ""}
                </span>
              </TableCell>
              <TableCell>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("vi-VN")
                  : ""}
              </TableCell>
              <TableCell>
                <Button
                  className="mr-2"
                  onClick={() => {
                    setSelectedOrder(order);
                    setDetailOpen(true);
                  }}
                >
                  Xem
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(order._id)}
                >
                  Xoá
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Dialog chi tiết đơn hàng */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogTrigger asChild />
        <DialogContent>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          {selectedOrder && (
            <div className="space-y-3 mt-3">
              <div>
                <strong>Khách hàng:</strong> {selectedOrder.user?.name || "Ẩn"}{" "}
                - {selectedOrder.user?.email}
              </div>
              <div>
                <strong>Địa chỉ:</strong> {selectedOrder.shipAddress?.address},{" "}
                {selectedOrder.shipAddress?.city}
              </div>
              <div>
                <strong>Phương thức thanh toán:</strong>{" "}
                {selectedOrder.paymentMethod}
              </div>
              <div>
                <strong>Trạng thái thanh toán:</strong>{" "}
                {selectedOrder.paymentStatus}
              </div>
              <div>
                <strong>Tổng tiền:</strong>{" "}
                {selectedOrder.totalPrice?.toFixed(2)} đ
              </div>

              <div>
                <strong>Trạng thái đơn hàng:</strong>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) =>
                    handleStatusChange(selectedOrder, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <strong>Sản phẩm:</strong>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ảnh</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Màu</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Giá</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.orderItems.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            "Không có"
                          )}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.size || "-"}</TableCell>
                        <TableCell>{item.color || "-"}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price?.toFixed(2)} đ</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
