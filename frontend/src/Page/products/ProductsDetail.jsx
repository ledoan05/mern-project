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
    <div className="container mx-auto mt-24 p-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start ">
        <div className="flex gap-4 ml-48">
          <div className="flex flex-col gap-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16  object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                  mainImage === img
                    ? "border-black scale-105"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="flex-1 ">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full  object-cover rounded-lg border"
            />
          </div>
        </div>
        <div className="">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="line-through font-semibold mt-2">
            {product.discountPrice}
          </p>
          <p className="text-2xl text-red-500 font-semibold mt-2">
            {product.price}
          </p>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <div className="mt-4">
            <p className="font-semibold">Màu sắc:</p>
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>
          <div className="mt-4">
            <p className="font-semibold">Kích thước:</p>
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>
          <div className="mt-5">
            <p className="font-semibold">Số lượng:</p>
            <div className=" flex mt-3 gap-3">
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
              <Button className="w-full md:w-auto  px-6">
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
