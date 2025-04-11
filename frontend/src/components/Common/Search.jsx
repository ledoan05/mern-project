import { productsByFilter, setFilter } from "@/redux/slices/productsSlice";
import { SearchIcon, X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const clickButtonSeach = () => {
    setIsOpen(true);
  };
  const handleSearchToogle = () => {
    setIsOpen(false);
  };
  const handleSearch = (e)=>{
     e.preventDefault();
     dispatch(setFilter({search  : search}))
     dispatch(productsByFilter({search  : search}))
     navigate(`collection?search=${search}`)
     setIsOpen(false)
  }
  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen
          ? "absolute top-0 -left-5 h-24 z-50 w-full bg-slate-50  "
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          className="relative flex items-center justify-center w-full"
          onSubmit={handleSearch}
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 pl-10 pr-12 rounded-lg border border-gray-400 focus:outline-none w-full"
            />
            <button
              type="submit"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <SearchIcon />
            </button>
          </div>
          <button className="right-7" onClick={handleSearchToogle} type="button">
            <X />
          </button>
        </form>
      ) : (
        <button onClick={clickButtonSeach}>
          <SearchIcon />
        </button>
      )}
    </div>
  );
};

export default Search;
