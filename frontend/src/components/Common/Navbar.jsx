import React, { useState } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import { List, ShoppingCart, User, X } from "lucide-react";
import CartDrawer from "../Layout/CartDrawer";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setnavDrawerOpen] = useState(false);

  const toogleNavDrawer = () => {
    setnavDrawerOpen(!navDrawerOpen);
  };
  const toogleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <>
      <nav className="flex items-center justify-between py-4 px-6 ">
        <div>
          <Link className="text-red-700 font-bold" to={"/"}>
            DLC
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link
            className="text-gray-700 hover:text-black text-sm font-medium"
            to={"#"}
          >
            MEN
          </Link>
          <Link
            className="text-gray-700 hover:text-black text-sm font-medium"
            to={"#"}
          >
            WOMMEN
          </Link>
          <Link
            className="text-gray-700 hover:text-black text-sm font-medium "
            to={"#"}
          >
            TOP WEAR
          </Link>
          <Link
            className="text-gray-700 hover:text-black text-sm font-medium "
            to={"#"}
          >
            BOTTOM WEAR
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link to={"/"}>
            <User />
          </Link>
          <button onClick={toogleCartDrawer} className="h-6">
            <ShoppingCart />
            <span className="absolute top-7 bg-red-700 text-white text-xs rounded-full px-2 py-0.5">
              1
            </span>
          </button>
          <Search />
          <button onClick={toogleNavDrawer} className="md:hidden">
            <List />
          </button>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toogleCartDrawer={toogleCartDrawer} />

      <div
        className={`w-3/4 fixed  left-0 top-0 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }   `}
      >
        <div className="flex justify-end p-4">
          <button onClick={toogleNavDrawer}>
            <X />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl mb-4 font-bold">Menu</h2>
          <div className="space-y-3">
            <div className="block">
              <Link
                className="text-gray-700 hover:text-black text-sm font-medium"
                to={"#"}
              >
                MEN
              </Link>
            </div>
            <div className="block">
              <Link
                className="text-gray-700 hover:text-black text-sm font-medium"
                to={"#"}
              >
                WOMMEN
              </Link>
            </div>
            <div className="block">
              <Link
                className="text-gray-700 hover:text-black text-sm font-medium"
                to={"#"}
              >
                TOP WEAR
              </Link>
            </div>
            <div className="block">
              <Link
                className="text-gray-700 hover:text-black text-sm font-medium"
                to={"#"}
              >
                BOTTOM WEAR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
