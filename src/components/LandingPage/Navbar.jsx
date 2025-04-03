import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown, IoMdSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Products = [
  { "id": 1, "name": "Rau Củ Tươi", "link": "/fresh-vegetables" },
  { "id": 2, "name": "Thịt Tươi", "link": "/fresh-meat" },
  { "id": 3, "name": "Hải Sản Tươi", "link": "/fresh-seafood" },
  { "id": 4, "name": "Trái Cây Tươi", "link": "/fresh-fruits" },
  { "id": 5, "name": "Sữa và Sản Phẩm Sữa", "link": "/dairy-products" },
  { "id": 6, "name": "Thực Phẩm Chế Biến Sẵn", "link": "/processed-foods" }
]

const Navbar = () => {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`bg-white py-3 md:py-4 lg:py-6 sticky top-0 z-50 ${scrolled ? "shadow-md" : ""}`}>
      <div className="container mx-auto px-4 lg:px-6 flex justify-between items-center">
        <div className="flex-shrink-0 px-4">
          <img src={logo} alt="Logo" className="h-10 md:h-12 lg:h-16 object-contain" />
        </div>

        <div className="flex lg:hidden items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="ml-2 p-2 text-gray-700 hover:text-blue-600">
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden lg:flex items-center gap-8 tracking-wide text-sm">
          <Link to="/" className="font-semibold uppercase hover:text-blue-600">Trang chủ</Link>
          <Link to="/about" className="font-semibold uppercase hover:text-blue-600">Về chúng tôi</Link>

          {/* Dropdown sản phẩm */}
          <div
            className="relative"
            onMouseEnter={() => setProductDropdownOpen(true)}
            onMouseLeave={() => setProductDropdownOpen(false)}
          >
            <Link to="/products" className="flex items-center gap-1 font-semibold uppercase hover:text-blue-600">
              Sản phẩm <IoIosArrowDown />
            </Link>

            <AnimatePresence>
              {productDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg"
                >
                  {Products.map((product) => (
                    <Link
                      key={product.id}
                      to={product.link}
                      className="block px-4 py-3 border-b border-gray-100 hover:text-blue-600"
                    >
                      {product.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/news" className="font-semibold uppercase hover:text-blue-600">Tin tức</Link>
        </div>

        {/* Menu di động */}
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
                <Link to="/" className="block px-2 py-3 font-semibold border-b border-gray-100 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
                <Link to="/about" className="block px-2 py-3 font-semibold border-b border-gray-100 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Về chúng tôi</Link>

                {/* Mobile Dropdown Sản phẩm */}
                <div className="border-b border-gray-100">
                  <button
                    className="flex justify-between items-center w-full px-2 py-3 font-semibold hover:text-blue-600"
                    onClick={() => setMobileProductOpen(!mobileProductOpen)}
                  >
                    <span>Sản phẩm</span>
                    <IoIosArrowDown className={`transition-transform ${mobileProductOpen ? "rotate-180" : ""}`} />
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
                        {Products.map((product) => (
                          <Link
                            key={product.id}
                            to={product.link}
                            className="block px-2 py-3 border-b border-gray-100 hover:text-blue-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {product.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;