import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import { List, ShoppingCart, User, X } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearCart } from "@/redux/slices/cartSlice";
import { logout } from "@/redux/slices/authSlice";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth); 
  const { cart } = useSelector((state) => state.cart);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toogleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toogleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clearCart()); 
    navigate("/"); 
  };

  return (
    <>
      <nav className="flex items-center justify-between py-4 px-6">
        <div>
          <Link className="text-red-700 font-bold" to={"/"}>
            DLC
          </Link>
        </div>
        <div className="hidden md:flex space-x-6 ml-48">
          <Link className=" text-sm font-medium" to={"/collection"}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">MEN</Button>
              </HoverCardTrigger>
            </HoverCard>
          </Link>
          <Link className=" text-sm font-medium" to={"/collection"}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">WOMEN</Button>
              </HoverCardTrigger>
            </HoverCard>
          </Link>
          <Link className=" text-sm font-medium" to={"/collection"}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">TOP WEAR</Button>
              </HoverCardTrigger>
            </HoverCard>
          </Link>
          <Link className=" text-sm font-medium" to={"/collection"}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">BOTTOM WEAR</Button>
              </HoverCardTrigger>
            </HoverCard>
          </Link>
        </div>
        <div className="flex w-48 gap-5">
          {user ? (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <User />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Tài khoản : {user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Lịch sử mua hàng
                    <DropdownMenuShortcut>📦</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={handleLogout}>Đăng xuất</button>
                    <DropdownMenuShortcut>🚪</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <User />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <Link to={"/login"}>
                    <DropdownMenuItem>
                      Đăng nhập
                      <DropdownMenuShortcut>🔐</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                  <Link to={"/register"}>
                    <DropdownMenuItem>
                      Đăng Ký
                      <DropdownMenuShortcut>📝</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <button onClick={toogleCartDrawer} className="h-6 relative">
            <ShoppingCart />
            {cartItemCount > 0 && (
              <span className="absolute bg-red-700 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          <Search />
          <button onClick={toogleNavDrawer} className="md:hidden">
            <List />
          </button>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toogleCartDrawer={toogleCartDrawer} />

      {/* Mobile Menu */}
      <div
        className={`w-3/4 fixed left-0 top-0 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toogleNavDrawer}>
            <X />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl mb-4 font-bold">Menu</h2>
          <div className="space-y-3">
            <Link className=" text-sm font-medium block" to={"#"}>
              MEN
            </Link>
            <Link className=" text-sm font-medium block" to={"#"}>
              WOMEN
            </Link>
            <Link
              className="text-gray-700 hover:text-black text-sm font-medium block"
              to={"#"}
            >
              TOP WEAR
            </Link>
            <Link
              className="text-gray-700 hover:text-black text-sm font-medium block"
              to={"#"}
            >
              BOTTOM WEAR
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
