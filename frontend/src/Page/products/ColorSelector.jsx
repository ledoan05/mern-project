const colorHexMap = {
  Black: "#000000",
  "Navy Blue": "#000080",
  Burgundy: "#800020",
};

const ColorSelector = ({ colors, selectedColor, setSelectedColor }) => {
  if (!colors || colors.length === 0) return <p>Không có màu sắc nào</p>;

  return (
    <div className="flex gap-2 mt-2">
      {colors.map((color) => (
        <div
          key={color} // ✅ Dùng màu làm key (vì là duy nhất)
          className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
            selectedColor === color ? "border-black" : "border-gray-300"
          }`}
          style={{ backgroundColor: colorHexMap[color] || "gray" }} // ✅ Dùng màu HEX từ map
          onClick={() => setSelectedColor(color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorSelector;
