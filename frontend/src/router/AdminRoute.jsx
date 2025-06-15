import AdminLayout from "@/components/Layout/AdminLayout";
import AdminRoute from "@/components/Router/AdminRoute";
import OrderAdminPage from "@/pages/OrderAdminPage";
import ProductAdmin from "@/pages/ProductAdmin";
import UserAdminPage from "@/pages/UserAdminPage";
import { Route } from "react-router-dom";


const AdminRouter = () => {
  return (
    <Route
      path="/admin/dashboard"
      element={
        <AdminRoute>
          {" "}
          <AdminLayout />{" "}
        </AdminRoute>
      }
    >
      <Route path="products" element={<ProductAdmin />} />
      <Route path="users" element={<UserAdminPage />} />
      <Route path="order" element={<OrderAdminPage />} />
    </Route>
  );
};

export default AdminRouter;
