import React from "react";
import { useDispatch } from "react-redux";
import {
  removeItemCart,
  updateCartItemQuantity,
} from "@/redux/slices/cartSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash } from "lucide-react";

const CartContent = ({ cart, userId }) => {
  let guestId = localStorage.getItem("guest") || null;
  const dispatch = useDispatch();
  const products = cart?.products || [];

  console.log("Products:", products);

  

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          userId,
          guestId,
          color,
          size,
        })
      );
    }
  };

  const handleRemoveCart = (productId, size, color) => {
    dispatch(removeItemCart({ productId, size, color, guestId, userId }));
  };

  return (
    <div className="p-4 space-y-4">
      {products?.length > 0 ? (
        products.map((item) => (
          <Card
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex items-center p-4"
          >
            <img
              src={item.images?.[0] || "/fallback-image.jpg"}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />

            <CardContent className="flex-1 ml-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {item.size} | Color: {item.color}
              </p>
              <div className="flex items-center mt-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    handleAddToCart(
                      item.productId,
                      -1,
                      item.quantity,
                      item.size,
                      item.color
                    )
                  }
                >
                  <Minus size={16} />
                </Button>
                <span className="mx-2 text-lg">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    handleAddToCart(
                      item.productId,
                      1,
                      item.quantity,
                      item.size,
                      item.color
                    )
                  }
                >
                  <Plus size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="ml-auto"
                  onClick={() =>
                    handleRemoveCart(item.productId, item.size, item.color)
                  }
                >
                  <Trash size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartContent;
