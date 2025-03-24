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
import Register from "./Page/Register";
import ColletionPage from "./Page/ColletionPage";
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
          </Route>
          <Route path="/admin" element={<AdminLayout />}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </Provider>
  );
}

export default App;
