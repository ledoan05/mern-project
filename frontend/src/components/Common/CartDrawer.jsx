import { X } from "lucide-react";
import React from "react";

const CartDrawer = ({ drawerOpen, toogleCartDrawer }) => {
  return (
    <div
      className={`w-3/4 fixed  right-0 top-0 sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4 ">
        <button onClick={toogleCartDrawer}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default CartDrawer;
