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
import { login } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { mergeCart } from "@/redux/slices/cartSlice";

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  

const onSubmit = async (data) => {
  setLoading(true);
  try {
    let guestId = localStorage.getItem("guest");
    console.log("🔥 Guest ID trước khi mergeCart:", guestId);

    const res = await dispatch(login({ ...data, guestId }));
    console.log("🔥 Kết quả login:", res);

    if (res.payload) {
      toast.success("Đăng nhập thành công!", {
        description: `Chào mừng ${data.email}`,
      });

      if (guestId) {
        console.log("🛒 Bắt đầu mergeCart...");

        await dispatch(mergeCart({ guestId, userId: res.payload._id }));

        console.log("🔥 Merge cart thành công!");

        // ❌ XÓA `guestId` TRONG LOCAL STORAGE
        localStorage.removeItem("guest");

        // ✅ XÓA `guestId` TRONG CART
        let cart = JSON.parse(localStorage.getItem("cart")) || {};
        delete cart.guestId;
        localStorage.setItem("cart", JSON.stringify(cart));

        console.log("🔥 guestId đã bị xóa khỏi cart:", cart);
      }

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } else {
      toast.error("Lỗi đăng nhập!", {
        description: "Sai email hoặc mật khẩu.",
      });
    }
  } catch (error) {
    console.log("❌ Lỗi trong đăng nhập:", error);
    toast.error("Có lỗi xảy ra!", {
      description: "Vui lòng thử lại sau.",
    });
  }
  setLoading(false);
};





  return (
    <Card className="max-w-md mx-auto mt-24 p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Login;
