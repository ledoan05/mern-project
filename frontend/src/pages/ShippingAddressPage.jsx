import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  fetchShippingAddress,
  saveShippingAddress,
  deleteShippingAddress,
} from "@/redux/slices/shippingAddressSlice";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ tối thiểu 5 ký tự"),
  city: z.string().min(2, "Thành phố tối thiểu 2 ký tự"),
});

const ShippingAddressPage = () => {
  const shippingAddress = useSelector((state) => state.shippingAddress);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    dispatch(fetchShippingAddress());
  }, [dispatch]);

  useEffect(() => {
    if (shippingAddress.address && !isEditing) {
      setValue("name", shippingAddress.address.name);
      setValue("phone", shippingAddress.address.phone);
      setValue("address", shippingAddress.address.address);
      setValue("city", shippingAddress.address.city);
    }
  }, [shippingAddress.address, setValue, isEditing]);

  const handleSaveAddress = async (data) => {
    try {
      await dispatch(saveShippingAddress(data)).unwrap();
      setIsEditing(false);
      toast.success("Lưu địa chỉ giao hàng thành công!");
    } catch (error) {
      toast.error(error || "Không thể lưu địa chỉ giao hàng");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (shippingAddress.address) {
      setValue("name", shippingAddress.address.name);
      setValue("phone", shippingAddress.address.phone);
      setValue("address", shippingAddress.address.address);
      setValue("city", shippingAddress.address.city);
    } else {
      reset();
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteShippingAddress()).unwrap();
      reset();
      toast.success("Đã xóa địa chỉ giao hàng");
    } catch (error) {
      toast.error(error || "Không thể xóa địa chỉ giao hàng");
    }
  };

  return (
    <div className="mt-24 mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Địa chỉ giao hàng</h1>
          <p className="text-gray-600 mt-2">
            Quản lý địa chỉ giao hàng của bạn để thuận tiện cho các lần mua sau
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin địa chỉ</CardTitle>
          </CardHeader>
          <CardContent>
            {shippingAddress.address && !isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Họ và tên
                    </Label>
                    <p className="mt-1">{shippingAddress.address.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Số điện thoại
                    </Label>
                    <p className="mt-1">{shippingAddress.address.phone}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Địa chỉ
                  </Label>
                  <p className="mt-1">{shippingAddress.address.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Thành phố
                  </Label>
                  <p className="mt-1">{shippingAddress.address.city}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleEdit} variant="outline">
                    Chỉnh sửa
                  </Button>
                  <Button onClick={handleDelete} variant="destructive">
                    Xóa địa chỉ
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(handleSaveAddress)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên</Label>
                    <Input {...register("name")} placeholder="Nhập họ và tên" />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <Input
                      {...register("phone")}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
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
                    <p className="text-sm text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={shippingAddress.loading}>
                    {shippingAddress.loading ? "Đang lưu..." : "Lưu địa chỉ"}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                    >
                      Hủy
                    </Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {shippingAddress.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{shippingAddress.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressPage;
