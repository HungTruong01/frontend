import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdSearch, IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  return (
    <nav className="bg-white py-6 sticky top-0 z-50">
      <div className="container mx-auto w-[1248px] px-6 flex justify-between items-center">
        <div className="">
          <img
            src="https://hbsvietnam.com/wp-content/uploads/2023/04/logo-HBS-6.png"
            alt="Logo"
            className="h-12 object-contain"
          />
        </div>

        <div className="flex items-center gap-6 tracking-wide text-sm">
          <Link
            to="/"
            className="font-semibold uppercase hover:text-blue-600 transition duration-300"
          >
            Trang chủ
          </Link>
          <Link
            to="/about"
            className="font-semibold uppercase hover:text-blue-600 transition duration-300"
          >
            Về chúng tôi
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setProductDropdownOpen(true)}
            onMouseLeave={() => setProductDropdownOpen(false)}
          >
            <Link
              to="/products"
              className="flex items-center gap-1 font-semibold uppercase hover:text-blue-600 transition duration-300"
            >
              Sản phẩm
              <IoIosArrowDown />
            </Link>

            <AnimatePresence>
              {productDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg z-50"
                >
                  <Link
                    to="/imported-products"
                    className="block px-4 py-3 border-b border-gray-300 font-normal hover:bg-gray-100 text-gray-800 transition duration-300"
                  >
                    Sản Phẩm Nhập Khẩu
                  </Link>
                  <Link
                    to="/exported-products"
                    className="block px-4 py-3 border-b border-gray-300 font-normal hover:bg-gray-100 text-gray-800 transition duration-300"
                  >
                    Sản Phẩm Xuất Khẩu
                  </Link>

                  <Link
                    to="/exported-products"
                    className="block px-4 py-3 border-b border-gray-300 font-normal hover:bg-gray-100 text-gray-800 transition duration-300"
                  >
                    Tất Cả Sản Phẩm
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setServiceDropdownOpen(true)}
            onMouseLeave={() => setServiceDropdownOpen(false)}
          >
            <Link
              to="/service"
              className="flex items-center gap-1 font-semibold uppercase hover:text-blue-600 transition duration-300"
            >
              Dịch vụ
              <IoIosArrowDown />
            </Link>

            <AnimatePresence>
              {serviceDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg z-50"
                >
                  <Link
                    to="/imported-service"
                    className="block px-4 py-3 border-b border-gray-300 font-normal hover:bg-gray-100 text-gray-800 transition duration-300"
                  >
                    Dịch vụ nhập khẩu
                  </Link>
                  <Link
                    to="/exported-service"
                    className="block px-4 py-3 border-b border-gray-300 font-normal hover:bg-gray-100 text-gray-800 transition duration-300"
                  >
                    Dịch vụ xuất khẩu
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link
            to="/partners"
            className="font-semibold uppercase hover:text-blue-600 transition duration-300"
          >
            Đối tác
          </Link>
          <Link
            to="/news"
            className="font-semibold uppercase hover:text-blue-600 transition duration-300"
          >
            Tin tức
          </Link>
        </div>

        <div className="relative">
          <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-0 focus:outline-none"
            placeholder="Tìm kiếm..."
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
