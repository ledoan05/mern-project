import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useSearchParams } from "react-router-dom";

const categories = ["Top Wear", "Quần", "Giày", "Phụ kiện"];
const colors = ["Red", "Blue", "Yellow"];
const genders = ["Men", "Women"];

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: "",
    color: [],
    gender: "",
    minPrice: 0,
    maxPrice: 100,
  });

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color ? params.color.split(",") : [],
      size: params.size ? params.size.split(",") : [],
      minPrice: params.minPrice ? Number(params.minPrice) : 0,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : 100,
    });
  }, [searchParams]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);

    const updatedParams = {
      ...Object.fromEntries([...searchParams]),
      ...newFilters,
    };

    if (!newFilters.category) delete updatedParams.category;
    if (!newFilters.gender) delete updatedParams.gender;
    if (!newFilters.color.length) delete updatedParams.color;
    if (!newFilters.minPrice === 0 && newFilters.maxPrice === 100) {
      delete updatedParams.minPrice;
      delete updatedParams.maxPrice;
    }

    setSearchParams(updatedParams);
  
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      newFilters[name] = checked
        ? [...newFilters[name], value]
        : newFilters[name].filter((item) => item !== value);
    } else {
      newFilters[name] = value;
    }

    updateFilters(newFilters);
  };

  const handleSliderChange = (value) => {
    updateFilters({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  return (
    <Card className="p-4 w-72">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Bộ lọc sản phẩm</h2>
        <div className="mb-4">
          <label className="block font-medium mb-2">Danh mục</label>
          <select
            className="w-full p-2 border rounded-md"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Màu sắc</label>
          <div>
            {colors.map((color) => (
             <button key={color} name="color" value={color} onClick ={handleFilterChange} className="w-8 h-8 rounded-full boder border-gray-300 cursor-pointer transition hover:scale-105" style={{backgroundColor : color.toLocaleLowerCase()}}></button>
      
            ))}
          </div>
        </div>  
        <div className="mb-4">
          <label className="block font-medium mb-2">Giới tính</label>
          <select
            className="w-full p-2 border rounded-md"
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Khoảng giá</label>
          <Slider
            min={0}
            max={100}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handleSliderChange}
          />
          <div className="flex justify-between text-sm mt-2">
            <span>{filters.minPrice.toLocaleString()}đ</span>
            <span>{filters.maxPrice.toLocaleString()}đ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
