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

const links = [
  {
    name: "Dashboard",
    to: "/admin/dashboard",
    icon: <Home className="w-4 h-4" />,
  },
  { name: "Users", to: "/admin/users", icon: <Users className="w-4 h-4" /> },
  {
    name: "Products",
    to: "/admin/products",
    icon: <Package className="w-4 h-4" />,
  },
  {
    name: "Settings",
    to: "/admin/settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

const AdminSidebar = () => {
  const user = {
    name: "Alicia Koch",
    email: "alicia@email.com",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // TODO: add logout logic here
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
