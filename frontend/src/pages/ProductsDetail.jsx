import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ColorSelector from "../components/ColorSelector";
import SizeSelector from "../components/Products/SizeSelector";
import QuantitySelector from "../assets/QuantitySelector";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productsDetail, similarProduct } from "@/redux/slices/productsSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import ProductsSimilar from "@/components/ProductsSimilar";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectedProduct,
    similarProducts = [],
    loading,
    error,
  } = useSelector((state) => state.product);
  const user = useSelector((state) => state.auth.user);

  const [mainImage, setMainImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    if (id) {
      dispatch(productsDetail(id));
      dispatch(similarProduct({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
    if (selectedProduct?.colors?.length > 0) {
      setSelectedColor(selectedProduct.colors[0]);
    }
    if (selectedProduct?.sizes?.length > 0) {
      setSelectedSize(selectedProduct.sizes[0]);
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    const userId = user?._id || null;
    let guestId = localStorage.getItem("guest");

    dispatch(
      addToCart({
        productId: selectedProduct._id,
        name: selectedProduct.title,
        price: selectedProduct.price,
        size: selectedSize,
        color: selectedColor,
        quantity,
        userId,
        guestId,
        images: selectedProduct.images,
      })
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading product.</p>;
  if (!selectedProduct) return <p>Product not found.</p>;

  return (
    <div className="container mx-auto mt-24  px-4 md:px-8 lg:px-16 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full max-h-[400px] object-cover rounded-lg border"
            />
          </div>
          <div className="flex justify-center md:justify-start gap-2">
            {selectedProduct?.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 md:w-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                  mainImage === img.url
                    ? "border-black scale-105"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold">{selectedProduct.title}</h1>
          <p className="line-through font-semibold text-gray-500 mt-2">
            {selectedProduct.discountPrice}
          </p>
          <p className="text-2xl text-red-500 font-semibold mt-1">
            {selectedProduct.price}
          </p>
          <p className="text-gray-600 mt-4">{selectedProduct.description}</p>

          {/* Chọn màu */}
          {}
          <div className="mt-4">
            <p className="font-semibold">Màu sắc:</p>
            <ColorSelector
              colors={selectedProduct?.colors || []}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>

          {/* Chọn size */}
          <div className="mt-4">
            <p className="font-semibold">Kích thước:</p>
            <SizeSelector
              sizes={selectedProduct.sizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>

          {/* Chọn số lượng */}
          <div className="mt-5">
            <p className="font-semibold">Số lượng:</p>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-3">
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
              <Button
                onClick={handleAddToCart}
                className="w-full md:w-auto px-6 text-white"
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ProductsSimilar
        products={similarProducts}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ProductDetail;
