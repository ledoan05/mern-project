import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { mergeCart } from "@/redux/slices/cartSlice";

const registerSchema = z.object({
  name: z.string().trim().min(3, { message: "Tên phải có ít nhất 3 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

const Register = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

const onSubmit = async (data) => {
  setLoading(true);
  try {
    let guestId = localStorage.getItem("guest");
    console.log("🔥 Guest ID trước khi mergeCart:", guestId);

    // ✅ Gọi API đăng ký
    const res = await dispatch(register({ ...data, guestId })).unwrap(); // Dùng unwrap() để lấy lỗi chính xác
    console.log("🔥 Kết quả đăng ký:", res);

    if (res) {
      toast.success("Đăng ký thành công!", {
        description: `Chào mừng ${data.email}`,
      });

      // ✅ Xử lý merge giỏ hàng nếu có guestId
      if (guestId) {
        console.log("🛒 Bắt đầu mergeCart...");

        await dispatch(mergeCart({ guestId, userId: res._id }));

        console.log("🔥 Merge cart thành công!");

        // ❌ XÓA `guestId` TRONG LOCAL STORAGE
        localStorage.removeItem("guest");

        // ✅ XÓA `guestId` TRONG CART
        let cart = JSON.parse(localStorage.getItem("cart")) || {};
        delete cart.guestId;
        localStorage.setItem("cart", JSON.stringify(cart));

        console.log("🔥 guestId đã bị xóa khỏi cart:", cart);
      }
    }
  } catch (error) {
    console.log("❌ Lỗi trong đăng ký:", error);

    // ✅ Kiểm tra lỗi từ Redux (email đã tồn tại, lỗi server,...)
    let errorMessage = "Có lỗi xảy ra! Vui lòng thử lại sau.";
    if (typeof error === "string") {
      errorMessage = error; // Redux đã trả về message lỗi
    }

    toast.error("Lỗi đăng ký!", {
      description: errorMessage,
    });
  }
  setLoading(false);
};


  return (
    <Card className="max-w-md mx-auto mt-24 p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Đăng ký</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nhập họ tên"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Nhập email"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Register;
