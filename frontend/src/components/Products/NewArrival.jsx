import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NewArrival() {
  const [newArrivals, setNewArrivals] = useState([]); 

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/new-arrivals`
        );

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
          New Arrivals
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
                  <Card className="overflow-hidden rounded-lg shadow-lg">
                    <CardContent className="p-0">
                      <img
                        src={item.images?.[0]?.url}
                        
                        className="w-full h-56 object-cover rounded-t-lg"
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-600">${item.price}</p>
                      </div>
                    </CardFooter>
                  </Card>
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
