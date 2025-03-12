import React from 'react'
import Navbar from './Navbar'

const Header = () => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black text-white p-4 shadow-md z-50">
        <Navbar />
      </header>
    </>
  );
}

export default Header