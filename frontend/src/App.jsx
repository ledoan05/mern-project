import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Page/Home";
import AdminLayout from "./components/Layout/AdminLayout";
import UserLayout from "./components/Layout/UserLayout";
import Login from "./Page/Login";
import ProductsDetail from "./Page/products/ProductsDetail";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "sonner";
function App() {
  return (
    <Provider store={store}>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="dt" element={<ProductsDetail />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
