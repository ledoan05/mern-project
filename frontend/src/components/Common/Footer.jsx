import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-xl font-semibold">Stay Connected</h2>
        <p className="mt-2 text-gray-400">Follow us for the latest updates</p>

        <div className="mt-4 flex justify-center gap-4">
          <Button variant="ghost">Facebook</Button>
          <Button variant="ghost">Twitter</Button>
          <Button variant="ghost">Instagram</Button>
        </div>

        <div className="mt-6 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
