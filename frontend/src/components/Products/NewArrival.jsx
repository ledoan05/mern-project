import {  CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import axios from "../../untils/axiosInstance.js";
import { Link } from "react-router-dom";

export default function NewArrival() {
  const [newArrivals, setNewArrivals] = useState([]); 

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(`/api/product/new-arrivals`);

        // console.log(res);

        setNewArrivals(res.data);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      }
    };

    fetchNewArrivals();
  }, []); 

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Sản Phẩm Mới
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent>
            {newArrivals.length > 0 ? (
              newArrivals.map((item) => (
                <CarouselItem
                  key={item._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Link to={`/product/${item._id}`}>
                    <CardContent className="p-4">
                      <img
                        src={item.images?.[0]?.url}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <h2 className="text-lg font-semibold mt-3">
                        {item.name}
                      </h2>
                      <p className="text-gray-500 text-sm">{item.category}</p>
                      <p className="text-primary font-bold mt-2">
                        ${item.price}
                      </p>
                      <Button className="mt-3 w-full">Xem chi tiết</Button>
                    </CardContent>
                  </Link>
                </CarouselItem>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No new arrivals found.
              </p>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
