import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QuantitySelector = ({ quantity, setQuantity, max = 100, disabled }) => {
  const outOfStock = disabled || max === 0;

  // Chỉ tăng nếu còn hàng
  const increase = () => {
    if (!outOfStock) setQuantity((q) => Math.min(Number(q) + 1, max));
  };

  const decrease = () => {
    if (!outOfStock) setQuantity((q) => Math.max(1, Number(q) - 1));
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (value === "") {
        setQuantity("");
      } else {
        let num = Math.max(1, Math.min(Number(value), max));
        setQuantity(num);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={decrease}
        disabled={outOfStock || quantity <= 1}
        aria-label="Giảm"
      >
        −
      </Button>
      <Input
        type="text"
        value={outOfStock ? "" : quantity}
        onChange={handleChange}
        className="w-16 text-center"
        min={1}
        max={max}
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Số lượng"
        disabled={outOfStock}
        placeholder={outOfStock ? "0" : undefined}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={increase}
        disabled={outOfStock || quantity >= max}
        aria-label="Tăng"
      >
        +
      </Button>
      <span className="text-xs text-gray-500 ml-2">
        {outOfStock ? (
          <span className="text-red-500 font-medium">Hết hàng</span>
        ) : (
          `(Còn ${max} sản phẩm có thể thêm)`
        )}
      </span>
    </div>
  );
};

export default QuantitySelector;
