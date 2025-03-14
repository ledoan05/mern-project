const ColorSelector = ({ colors, selectedColor, setSelectedColor }) => {
  return (
    <div className="flex gap-2 mt-2">
      {colors.map((color) => (
        <div
          key={color.name}
          className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
            selectedColor === color.name ? "border-black" : "border-gray-300"
          }`}
          style={{ backgroundColor: color.hex }}
          onClick={() => setSelectedColor(color.name)}
        ></div>
      ))}
    </div>
  );
};

export default ColorSelector;
