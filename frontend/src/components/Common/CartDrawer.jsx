import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CartContent from "./CartContent";
import { Button } from "../ui/button";

const CartDrawer = ({ drawerOpen, toogleCartDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.cart);

  const userId = user ? user._id : null;
  useEffect(() => {
    if (drawerOpen) {
      toogleCartDrawer(false); 
    }
  }, [location.pathname]);

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div
      className={`w-3/4 fixed right-0 top-0 sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <CartContent cart={cart} userId={userId} guestId={guestId} />
      <div className="flex justify-end p-4 gap-4">
        <Button className="mt-4 px-4 py-2 rounded" onClick={toogleCartDrawer}>
          Quay lại
        </Button>
        <Button
          className="mt-4 text-white px-4 py-2 rounded"
          onClick={handleCheckout}
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default CartDrawer;
