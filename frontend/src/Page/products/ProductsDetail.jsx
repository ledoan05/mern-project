import { useState } from "react";
import { Button } from "@/components/ui/button";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";

const product = {
  title: "Giày Sneaker Cao Cấp",
  price: "$120",
  discountPrice: "$110",
  description: "Giày sneaker thiết kế hiện đại, phong cách và bền bỉ.",
  images: [
    "https://picsum.photos/id/237/250",
    "/images/shoes2.jpg",
    "/images/shoes3.jpg",
    "https://picsum.photos/id/237/250",
  ],
  colors: [
    { name: "black", hex: "#000000" },
    { name: "white", hex: "#ffffff" },
    { name: "red", hex: "#ff0000" },
  ],
  sizes: ["39", "40", "41", "42", "43"],
};

const ProductDetail = () => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("39");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Hình ảnh sản phẩm */}
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full max-h-[400px] object-cover rounded-lg border"
            />
          </div>
          {/* Hiển thị ảnh nhỏ bên dưới khi responsive */}
          <div className="flex justify-center md:justify-start gap-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 md:w-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                  mainImage === img
                    ? "border-black scale-105"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="line-through font-semibold text-gray-500 mt-2">
            {product.discountPrice}
          </p>
          <p className="text-2xl text-red-500 font-semibold mt-1">
            {product.price}
          </p>
          <p className="text-gray-600 mt-4">{product.description}</p>

          {/* Chọn màu */}
          <div className="mt-4">
            <p className="font-semibold">Màu sắc:</p>
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>

          {/* Chọn size */}
          <div className="mt-4">
            <p className="font-semibold">Kích thước:</p>
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>

          {/* Chọn số lượng */}
          <div className="mt-5">
            <p className="font-semibold">Số lượng:</p>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-3">
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
              <Button className="w-full md:w-auto px-6">
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
