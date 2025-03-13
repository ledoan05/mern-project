import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="py-24" style={{backgroundImage : "url('')"}}>
      <div className="container mx-auto px-6 text-center">
       
        <h1 className={cn("text-4xl md:text-6xl font-bold text-gray-900")}>
          Build Your Dream Website
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Create stunning websites with our powerful and easy-to-use tools.
        </p>

        <div className="mt-6">
          <Button className="px-6 py-3 text-lg">Get Started</Button>
        </div>
      </div>
    </section>
  );
}
