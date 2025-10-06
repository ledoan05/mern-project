import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/App.css";

import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "sonner";
import UserRouter from "./router/UserRoute";
import AdminRouter from "./router/AdminRoute";
import Unauthorized from "./pages/Unauthorized"; 
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Các route public/client */}
          {UserRouter()}

          {/* Các route admin */}
          {AdminRouter()}

          {/* Route unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </Provider>
  );
}

export default App;
