import React, { useEffect, useState } from "react";
import { FaTimes, FaSearch, FaPlus } from "react-icons/fa";
import AddProductModal from "./AddProductModal";
import { getAllProducts } from "@/api/productApi";
import { getAllProductUnits } from "@/api/productUnitApi";

const ProductSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedProducts,
  orderTypes,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [productUnits, setProductUnits] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts(0, 100, "id", "asc");
      setProducts(response.data.content);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductUnits = async () => {
    try {
      const response = await getAllProductUnits();
      setProductUnits(response.content);
    } catch (error) {
      console.log("Error fetching product units: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProductUnits();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductUnitName = (productUnitId) => {
    const unit = productUnits.find((unit) => unit.id === productUnitId);
    return unit ? unit.name : "Unknown";
  };

  const handleAddProduct = () => {
    setIsOpenAddProduct(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50">
      <AddProductModal
        isOpen={isOpenAddProduct}
        onClose={() => setIsOpenAddProduct(false)}
      />
      <div className="bg-white p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Chọn sản phẩm</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex justify-start items-center">
          {orderTypes === "Đơn hàng nhập" && (
            <button
              type="button"
              onClick={handleAddProduct}
              className="flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white text-sm mb-4 cursor-pointer "
            >
              <FaPlus className="mr-1" />
              Thêm mới sản phẩm
            </button>
          )}
        </div>

        <div className="mt-2 space-y-4">
          {filteredProducts.map((product) => {
            const isSelected = selectedProducts.some(
              (selected) => selected.id === product.id
            );

            return (
              <div
                key={product.id}
                className={`flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => onSelect(product)}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <span className="text-sm font-medium text-blue-600">
                      {product.price.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Số lượng: {product.quantity} </span>
                    <span>
                      Đơn vị: {getProductUnitName(product.productUnitId)}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <span className="ml-4 px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Đã chọn
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal;
