import AdminLayout from "@/components/Layout/AdminLayout";
import AdminRoute from "@/components/Router/AdminRoute";
import ProductAdmin from "@/pages/ProductAdmin";
import { Route } from "react-router-dom";


const AdminRouter = () => {
  return (
    <Route path="/admin/dashboard" element={<AdminRoute> <AdminLayout /> </AdminRoute>} >
     
      <Route path="products" element={<ProductAdmin/>} />
      
   

    </Route>
  );
};

export default AdminRouter;
