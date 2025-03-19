import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/sale`
        );
        setBestSeller(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
      }
    };
    fetchBestSeller();
  }, []); // ✅ Chạy 1 lần khi component mount

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        🔥 Best Sellers 🔥
      </h2>
      {bestSeller.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSeller.map((product) => (
            <Card
              key={product.id}
              className="shadow-md hover:shadow-lg transition-all"
            >
              <CardContent className="p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h2 className="text-lg font-semibold mt-3">{product.name}</h2>
                <p className="text-gray-500 text-sm">{product.category}</p>
                <p className="text-primary font-bold mt-2">${product.price}</p>
                <Button className="mt-3 w-full">Mua ngay</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Không có sản phẩm bán chạy nào.
        </p>
      )}
    </div>
  );
};

export default BestSeller;
