import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;
