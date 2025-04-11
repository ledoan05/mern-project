import { X } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import CartContent from "./CartContent";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ drawerOpen, toogleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.cart);
  console.log("Dữ liệu trong giỏ hàng:", cart);
  const userId = user ? user._id : null;
   const handleCheckout = () => {
     if (!user) {
       alert("Bạn cần đăng nhập trước khi thanh toán!");
       navigate("/login");
       return;
     }
     navigate("/checkout");
   };
  return (
    <div
      className={`w-3/4 fixed  right-0 top-0 sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <CartContent cart={cart} userId={userId} guestId={guestId} />
      <div className="flex justify-end p-4 ">
        <button onClick={toogleCartDrawer}>
          <X />
        </button>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleCheckout()}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default CartDrawer;
