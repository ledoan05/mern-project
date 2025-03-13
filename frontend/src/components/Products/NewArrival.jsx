import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const arrivals = [
  {
    id: 1,
    title: "Modern Sneakers",
    price: "$120",
    image: "/images/arrival1.jpg",
  },
  {
    id: 2,
    title: "Classic Jacket",
    price: "$180",
    image: "/images/arrival2.jpg",
  },
  {
    id: 3,
    title: "Stylish Backpack",
    price: "$90",
    image: "/images/arrival3.jpg",
  },
  {
    id: 4,
    title: "Elegant Watch",
    price: "$250",
    image: "/images/arrival4.jpg",
  },
];

export default function NewArrival() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">New Arrivals</h2>
        <Swiper>
          {arrivals.map((item) => (
            <SwiperSlide key={item.id}>
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-60 object-cover"
                  />
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.price}</p>
                  </div>
                  <Button>Add to Cart</Button>
                </CardFooter>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
