import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { login } from "@/redux/slices/authSlice";
import { toast } from "sonner";

// Schema validate
const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true); 
    try {
      const resultAction = await dispatch(login(data)); 

      if (login.fulfilled.match(resultAction)) {
        toast.success("Đăng nhập thành công!", {
          description: `Chào mừng ${data.email}`,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Lỗi đăng nhập!", {
          description: "Sai email hoặc mật khẩu.",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!", {
        description: "Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-24 p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="Nhập email"
              disabled={loading} // Disable khi đang loading
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Mật khẩu</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Nhập mật khẩu"
              disabled={loading} // Disable khi đang loading
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
