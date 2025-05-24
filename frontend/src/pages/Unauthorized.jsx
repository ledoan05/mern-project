import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 px-6 py-12">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
          <AlertCircle className="text-red-600 dark:text-red-400 w-12 h-12" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-red-700 dark:text-red-300">
          403 - Truy cập bị từ chối
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài
          khoản admin hoặc quay lại trang chủ.
        </p>

        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            Trang chủ
          </Button>
          <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
