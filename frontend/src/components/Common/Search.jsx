import React, { useState } from "react";

const Search = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const clickButtonSeach = ()=>{
    setIsOpen(true)
  }
  const handleSearch = ()=>{
    console.log(1234);
    setIsOpen(false)
    
  }
  return (
    <div>
      {isOpen ? (
        <form onSubmit={handleSearch}>
          <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} />
        </form>
      ) : (
        <button onClick={clickButtonSeach}>Search</button>
      )}
    </div>
  );
};

export default Search;
