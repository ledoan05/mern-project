import UserLayout from "@/components/Layout/UserLayout";
import Chatbot from "@/pages/ChatBot";
import CheckoutPage from "@/pages/CheckoutPage";
import CollectionPage from "@/pages/ColletionPage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import OrderDetail from "@/pages/OrderDetail ";
import OrderPage from "@/pages/OrderPage";
import PaymentSuccess from "@/pages/PaymentSuccess";
import ProductsDetail from "@/pages/ProductsDetail";
import Register from "@/pages/Register";
import ShippingAddressPage from "@/pages/ShippingAddressPage";
import { Route } from "react-router-dom";



const UserRouter = () => {
  return (
    <Route path="/" element={<UserLayout />}>
      <Route index element={<Home />} />
      <Route path="collection" element={<CollectionPage />} />
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
