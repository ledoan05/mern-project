import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      <div className="container mx-auto px-6 ">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">New Arrivals</h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-7xl  mx-auto"
        >
          <CarouselContent>
            {arrivals.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden rounded-lg shadow-lg">
                  <CardContent className="p-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-56 object-cover rounded-t-lg"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-4 ">
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-gray-600  ">{item.price}</p>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
