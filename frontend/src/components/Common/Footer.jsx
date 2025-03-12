import React from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 ">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-white text-xl font-bold mb-3">DLC Store</h2>
          <p className="text-sm">
            Chúng tôi cung cấp sản phẩm thời trang chất lượng cao, giúp bạn thể
            hiện phong cách riêng.
          </p>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Liên kết</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-white">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Liên hệ</h3>
          <p className="text-sm">Email: ledoan05@gmail.com</p>
          <p className="text-sm">Số điện thoại: +84 87 847 654</p>

          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-white">
              <Facebook />
            </a>
            <a href="#" className="hover:text-white">
              <Instagram />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter />
            </a>
            <a href="#" className="hover:text-white">
              <Mail />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-6 border-t border-gray-700 pt-4">
        &copy; 2025 DLC Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
