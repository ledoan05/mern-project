import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

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

  const resetFilters = () => {
    const defaultFilters = {
      category: "",
      color: [],
      gender: "",
      minPrice: 0,
      maxPrice: 100,
    };

    setFilters(defaultFilters);
    setSearchParams({}); // Xóa toàn bộ params trên URL
  };

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
    if (newFilters.minPrice === 0 && newFilters.maxPrice === 100) {
      delete updatedParams.minPrice;
      delete updatedParams.maxPrice;
    } else {
      updatedParams.minPrice = newFilters.minPrice;
      updatedParams.maxPrice = newFilters.maxPrice;
    }

    setSearchParams(updatedParams);
  };
  const handleColorClick = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let newColors = [...filters.color];

    if (newColors.includes(value)) {
      newColors = newColors.filter((c) => c !== value);
    } else {
      newColors.push(value);
    }

    updateFilters({ ...filters, [name]: newColors });
  };

  const handleSliderChange = (value) => {
    updateFilters({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const handleSelectChange = (name) => (value) => {
    updateFilters({ ...filters, [name]: value });
  };

  return (
    <Card className="p-4 w-72 mt-6">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Bộ lọc sản phẩm</h2>

        {/* Danh mục */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Danh mục</label>
          <Select
            value={filters.category}
            onValueChange={handleSelectChange("category")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Danh mục</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Màu sắc */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Màu sắc</label>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                name="color"
                value={color}
                onClick={handleColorClick}
                className={`w-6 h-6 rounded-full border-2 ${
                  filters.color.includes(color)
                    ? "ring-2 ring-black"
                    : "border-gray-300"
                } transition hover:scale-105`}
                style={{ backgroundColor: color.toLowerCase() }}
              ></button>
            ))}
          </div>
        </div>

        {/* Giới tính */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Giới tính</label>
          <Select
            value={filters.gender}
            onValueChange={handleSelectChange("gender")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Giới tính</SelectLabel>
                {genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Khoảng giá */}
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

        <Button
          onClick={resetFilters}
          className="w-full mt-4 text-white font-semibold py-2 px-4 rounded"
        >
          Xóa bộ lọc
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
