const SizeSelector = ({ sizes, selectedSize, setSelectedSize }) => {
  if (!sizes || sizes.length === 0) return <p>Không có kích thước nào</p>;

  return (
    <div className="flex gap-2 mt-2">
      {sizes.map((size) => (
        <button
          key={size} // ✅ Key duy nhất
          className={`px-4 py-2 border rounded ${
            selectedSize === size ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedSize(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
