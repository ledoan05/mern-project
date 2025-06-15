import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CollectionSection = () => {
  const images = [
    "https://bizweb.dktcdn.net/100/340/361/products/awet0013l10e846d22eb5944a6b418-93704238-d571-4e36-a6f4-16eb6e2627dc.jpg?v=1734494142593",
    "https://product.hstatic.net/1000312752/product/awdt128-8m-1_f08a79072f334f19884ac69b962a76f2.jpg",
    "https://bizweb.dktcdn.net/100/340/361/products/awet0013l10e846d22eb5944a6b418-93704238-d571-4e36-a6f4-16eb6e2627dc.jpg?v=1734494142593",
  ];
  return (
    <section className="py-10 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Bộ Sưu Tập</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    
            <div
              className="overflow-hidden rounded-lg shadow-lg bg-cover bg-center transition-transform duration-300 hover:scale-105"
              style={{
                backgroundImage: `url(${images[0]})`,
              }}
            >
              
            </div>
   
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={images[1]}
              className=" object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={images[2]}
              className=" object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
