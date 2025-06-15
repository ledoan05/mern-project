import {
  Home,
  Users,
  Package,
  Settings,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "sonner";

const links = [
  {
    name: "Dashboard",
    to: "/admin/dashboard",
    icon: <Home className="w-4 h-4" />,
  },
  {
    name: "Users",
    to: "/admin/dashboard/users",
    icon: <Users className="w-4 h-4" />,
  },
  {
    name: "Order",
    to: "/admin/dashboard/order",
    icon: <Users className="w-4 h-4" />,
  },
  {
    name: "Products",
    to: "/admin/dashboard/product",
    icon: <Package className="w-4 h-4" />,
  },
];

const AdminSidebar = () => {
  const dispatch = useDispatch()

  const user = {
    name: "Alicia Koch",
    email: "alicia@email.com",
    
  };

  const handleLogout = () => {
    // Xóa toàn bộ thông tin đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    toast.success("Đăng xuất thành công!");
    // Reload tới trang client/public, giải phóng toàn bộ context/layout cũ
    window.location.href = "/"
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen px-4 py-6 bg-muted text-white border-r border-border justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          {/* <Avatar className="w-9 h-9">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              <UserIcon className="w-4 h-4" />
            </AvatarFallback>
          </Avatar> */}
          <div>
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-gray-800 text-muted-foreground"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="border-t border-border pt-4 mt-6">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full flex items-center gap-2 text-sm justify-start px-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
