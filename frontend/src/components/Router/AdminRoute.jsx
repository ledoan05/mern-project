import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (token === null || user === null) {
    // Trường hợp đang logout hoặc chưa load xong auth info
    return null; // Hoặc loading spinner nếu muốn
  }

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
export default AdminRoute;
