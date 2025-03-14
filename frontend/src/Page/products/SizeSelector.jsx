const SizeSelector = ({ sizes, selectedSize, setSelectedSize }) => {
  return (
    <div className="flex gap-2 mt-2">
      {sizes.map((size) => (
        <button
          key={size}
          className={`px-4 py-2 border rounded-md cursor-pointer ${
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
