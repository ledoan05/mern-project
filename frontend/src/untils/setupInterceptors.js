// src/utils/setupInterceptors.js
import axiosInstance from "./axiosInstance";
import { logout } from "@/redux/slices/authSlice";
import store from "@/redux/store";
import { toast } from "sonner";

export const setupInterceptors = () => {
  axiosInstance.interceptors.response.use(null, async (err) => {
    const original = err.config;
    if (!err.response) {
      console.error("[Interceptor] No response from server");
      return Promise.reject(err);
    }

    if (original.url.includes("/api/user/refresh-token")) {
      return Promise.reject(err);
    }
    
    const status = err.response.status;
    const msg = err.response.data?.message;
    const isAccessExpired = (status === 401 || status === 403)
      || msg === "Access token đã hết hạn";

    if (isAccessExpired && !original._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");

        // Xóa token và logout
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        store.dispatch(logout());

        // Hoãn redirect để toast kịp hiển thị
        setTimeout(() => {
          window.location.replace("/login");
        }, 2500);

        return Promise.reject(err);
      }

      try {
        const res = await axiosInstance.post("/api/user/refresh-token", { refreshToken });
        const newToken = res.data.token;

        localStorage.setItem("token", newToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(original);
      } catch (refreshError) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        store.dispatch(logout());

        setTimeout(() => {
          window.location.replace("/login");
        }, 2500);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  });
};
