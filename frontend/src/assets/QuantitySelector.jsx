import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QuantitySelector = ({ quantity, setQuantity }) => {
  const increase = () => setQuantity(quantity + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
   const handleChange = (e) => {
     const value = e.target.value;
     // Chỉ cập nhật nếu giá trị là số hoặc rỗng (để cho phép xóa)
     if (/^\d*$/.test(value)) {
       setQuantity(value === "" ? "" : Math.max(1, Number(value)));
     }
   };

  return (
    <div className="flex items-center gap-2 ">
      <Button variant="outline" size="icon" onClick={decrease}>
        −
      </Button>
      <Input
      type = "text"
        value={quantity} 
        onChange={handleChange}
        className="w-16 text-center"
      />
      <Button variant="outline" size="icon" onClick={increase}>
        +
      </Button>
    </div>
  );
};

export default QuantitySelector;
