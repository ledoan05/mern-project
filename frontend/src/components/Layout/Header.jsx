import React from "react";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full p-4 shadow-md z-50 bg-gray-100 ">
        <Navbar />
      </header>
    </>
  );
};

export default Header;
