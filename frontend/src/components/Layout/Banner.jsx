import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      className="py-72"
      style={{
        backgroundImage:
          "url('https://cdn.dribbble.com/userupload/13118950/file/original-cfaebacb75910a02e08e618b7ab2a067.jpg?resize=752x&vertical=center')",
        backgroundSize: "cover",
      
        width: "100%",
      }}
    >
      <div className="container mx-auto px-6 text-center">
        


        <div className="mt-6">
          <Button className="px-6 py-3 text-xl">Get Started</Button>
        </div>
      </div>
    </section>
  );
}
