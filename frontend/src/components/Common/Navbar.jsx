import React from 'react'
import { Link } from 'react-router-dom'
import Search from './Search';

const Navbar = () => {
  return (
    <>
      <nav className="flex items-center justify-between bg-red-500 h-10">
        <div>
          <Link to={"/"}>TQD</Link>
        </div>
        <div className="flex space-x-2">
          <Link to={"#"}>MEN</Link>
          <Link to={"#"}>WOMMEN</Link>
          <Link to={"#"}>TOP WEAR</Link>
          <Link to={"#"}>BOTTOM WEAR</Link>
        </div>
        <div className="flex space-x-3">
          <button className="">Login</button>
          <button className="">Register</button>
          <Search/>
        </div>
      </nav>
      
    </>
  );
}

export default Navbar