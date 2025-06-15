import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productsByFilter } from "@/redux/slices/productsSlice";
import { Card, CardContent } from "@/components/ui/card";

import { X, Filter } from "lucide-react"; 
import FilterSidebar from "@/components/Products/FilterSidebar";
import { Button } from "@/components/ui/button";

const CollectionPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {products,loading  } = useSelector((state) => state.product);

  const queryParams = Object.fromEntries([...searchParams]);

  useEffect(() => {
    dispatch(productsByFilter({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex lg:hidden justify-end mb-4">
        <Button
          className="flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 mt-14"
          onClick={() => setShowSidebar(true)}
        >
          <Filter size={20} />
          Bộ lọc
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar />
        </div>

        {showSidebar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="w-3/4 max-w-xs bg-white h-full relative">
              <button
                className="absolute top-4 right-4 text-gray-700"
                onClick={() => setShowSidebar(false)}
              >
                <X size={24} />
              </button>
              <FilterSidebar />
            </div>
          </div>
        )}

        <div className="lg:col-span-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Bộ Sưu Tập
          </h1>

          {loading ? (
            <p className="text-center text-gray-500 mt-10">
              Đang tải sản phẩm...
            </p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              Không có sản phẩm nào.
            </p>
          ) : (
            <div className=" mt-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden border"
                >
                  <Link to={`/product/${product._id}`}>
                    <CardContent className="p-4">
                      <img
                        src={product.images[0]?.url || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-52 object-cover rounded-lg transition-transform transform hover:scale-105"
                      />
                      <h2 className="text-lg font-semibold mt-3 text-gray-900">
                        {product.name}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {product.category}
                      </p>
                      <p className="text-primary font-bold mt-2">
                        {product.price.toLocaleString()} đ
                      </p>

                      <Button className="mt-3 w-full text-white">
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
