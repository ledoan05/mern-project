
import { Link} from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProductsSimilar = ({products , loading }) => {
  return (
    <>
      <div className="lg:col-span-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Bộ Sưu Tập
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    <p className="text-gray-500 text-sm">{product.category}</p>
                    <p className="text-primary font-bold mt-2">
                      {product.price.toLocaleString()} đ
                    </p>
                    <Link to={`/product/${product._id}`}>
                      <Button className="mt-3 w-full text-white">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </CardContent>
                </Link>   
              </Card>
            ))}
          </div>
        )}
      </div>
      ;
    </>
  );
}

export default ProductsSimilar