import { Route } from "react-router-dom";
import UserLayout from "../components/Layout/UserLayout";
import Home from "../pages/Home";
import ColletionPage from "../pages/ColletionPage";
import ProductsDetail from "../pages/ProductsDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CheckoutPage from "../pages/CheckOutPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import OrderPage from "../pages/OrderPage";
import OrderDetail from "../pages/OrderDetail ";
import Chatbot from "@/pages/ChatBot";
import ShippingAddressPage from "@/pages/ShippingAddressPage";

const UserRouter = () => {
  return (
    <Route path="/" element={<UserLayout />}>
      <Route index element={<Home />} />
      <Route path="collection" element={<ColletionPage />} />
      <Route path="product/:id" element={<ProductsDetail />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="payment-success" element={<PaymentSuccess />} />
      <Route path="order" element={<OrderPage />} />
      <Route path="order/:orderId" element={<OrderDetail />} />
      <Route path="chat" element={<Chatbot />} />
      <Route path="shipping-address" element={<ShippingAddressPage />} />
    </Route>
  );
};

export default UserRouter;
