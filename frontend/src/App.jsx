import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../src/styles/app.css";
import Home from "./pages/Home";
import AdminLayout from "./components/Layout/AdminLayout";
import Login from "./pages/Login";
import ProductsDetail from "./pages/ProductsDetail";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "sonner";
import Register from "./pages/Register";
import ColletionPage from "./pages/ColletionPage";
import CheckoutPage from "./pages/CheckOutPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderPage from "./pages/OrderPage";
import OrderDetail from "./pages/OrderDetail ";
import UserLayout from "./components/Layout/UserLayout";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
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
          </Route>
          <Route path="/admin" element={<AdminLayout />}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </Provider>
  );
}

export default App;
