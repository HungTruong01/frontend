import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown, IoMdSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  // const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  // const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`bg-white py-3 md:py-4 lg:py-6 sticky top-0 z-50 ${scrolled ? "shadow-md" : ""}`}>
      <div className="container mx-auto px-4 lg:px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0 px-4">
          <img src={logo} alt="Logo" className="h-10 md:h-12 lg:h-16 object-contain" />
        </div>

        {/* Mo menu tren di dong */}
        <div className="flex lg:hidden items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="ml-2 p-2 text-gray-700 hover:text-blue-600">
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden lg:flex items-center gap-8 tracking-wide text-sm">
          <Link to="/" className="font-semibold uppercase hover:text-blue-600 transition duration-300">
            Trang chủ
          </Link>

          <Link to="/about" className="font-semibold uppercase hover:text-blue-600 transition duration-300">
            Về chúng tôi
          </Link>

          {/* dropdown san pham */}
          <div className="relative" onMouseEnter={() => setProductDropdownOpen(true)} onMouseLeave={() => setProductDropdownOpen(false)}>
            <Link to="/products" className="flex items-center gap-1 font-semibold uppercase hover:text-blue-600 transition duration-300">
              Sản phẩm <IoIosArrowDown />
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
                  <Link to="/imported-products" className="block px-4 py-3 border-b border-gray-300 font-normal hover:bg-gray-100 text-gray-800 transition duration-300">
                    Sản Phẩm Nhập Khẩu
                  </Link>
                  <Link to="/exported-products" className="block px-4 py-3 border-b border-gray-300 font-normal hover:bg-gray-100 text-gray-800 transition duration-300">
                    Sản Phẩm Xuất Khẩu
                  </Link>
                  <Link to="/all-products" className="block px-4 py-3 border-b border-gray-300 font-normal hover:bg-gray-100 text-gray-800 transition duration-300">
                    Tất Cả Sản Phẩm
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* <div
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
          </div> */}
          <Link to="/news" className="font-semibold uppercase hover:text-blue-600 transition duration-300">
            Tin tức
          </Link>
        </div>

        {/* <div className="hidden md:block relative">
          <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-0 focus:outline-none"
            placeholder="Tìm kiếm..."
          />
        </div> */}
      </div>

      {/* menu di dong */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t mt-3"
          >
            <div className="container mx-auto px-4 py-2">
              {/* <div className="relative mb-4 mt-2">
                <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="search"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-0 focus:outline-none"
                  placeholder="Tìm kiếm..."
                />
              </div> */}

              <div className="space-y-1">
                <Link
                  to="/"
                  className="block px-2 py-3 font-semibold border-b border-gray-100 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/about"
                  className="block px-2 py-3 font-semibold border-b border-gray-100 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Về chúng tôi
                </Link>

                <div className="border-b border-gray-100">
                  <button
                    className="flex justify-between items-center w-full px-2 py-3 font-semibold hover:text-blue-600"
                    onClick={() => setMobileProductOpen(!mobileProductOpen)}
                  >
                    <span>Sản phẩm</span>
                    <IoIosArrowDown
                      className={`transition-transform ${mobileProductOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileProductOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 pl-4"
                      >
                        <Link
                          to="/imported-products"
                          className="block px-2 py-3 border-b border-gray-100 hover:text-blue-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sản Phẩm Nhập Khẩu
                        </Link>
                        <Link
                          to="/exported-products"
                          className="block px-2 py-3 border-b border-gray-100 hover:text-blue-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sản Phẩm Xuất Khẩu
                        </Link>
                        <Link
                          to="/all-products"
                          className="block px-2 py-3 hover:text-blue-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Tất Cả Sản Phẩm
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* <div className="border-b border-gray-100">
                  <button
                    className="flex justify-between items-center w-full px-2 py-3 font-semibold hover:text-blue-600"
                    onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
                  >
                    <span>Dịch vụ</span>
                    <IoIosArrowDown
                      className={`transition-transform ${mobileServiceOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileServiceOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 pl-4"
                      >
                        <Link
                          to="/imported-service"
                          className="block px-2 py-3 border-b border-gray-100 hover:text-blue-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dịch vụ nhập khẩu
                        </Link>
                        <Link
                          to="/exported-service"
                          className="block px-2 py-3 hover:text-blue-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dịch vụ xuất khẩu
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div> */}

                {/* <Link
                  to="/partners"
                  className="block px-2 py-3 font-semibold border-b border-gray-100 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đối tác
                </Link> */}
                <Link to="/news" className="block px-2 py-3 font-semibold hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  Tin tức
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
