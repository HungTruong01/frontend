import React, { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { FaRegTrashAlt, FaEye, FaEdit, FaPlus, FaSort } from "react-icons/fa";
import ToggleProductModal from "@/components/Dashboard/product/ToggleProductModal";
import ProductDetailModal from "@/components/Dashboard/product/ProductDetailModal";
import {
  getAllProducts,
  getProductById,
  deleteProduct,
  getProductsByProductTypeId,
} from "@/api/productApi";
import { getAllProductTypes } from "@/api/productTypeApi";
import { getAllProductUnits } from "@/api/productUnitApi";
import { toast } from "react-toastify";
import { Pagination } from "@/utils/pagination";
import { formatCurrency } from "@/utils/formatter";

const ListProduct = () => {
  const [itemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchName, setSearchName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mode, setMode] = useState("add");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [productUnits, setProductUnits] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [typesRes, unitsRes] = await Promise.all([
          getAllProductTypes(0, 100, "id", "asc"),
          getAllProductUnits(0, 100, "id", "asc"),
        ]);
        setProductTypes(typesRes.data.content);
        setProductUnits(unitsRes.data.content);
      } catch (error) {
        toast.error("Không thể tải loại sản phẩm hoặc đơn vị tính.");
        console.error(error);
      }
    };
    fetchInitialData();
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (searchType) {
        response = await getProductsByProductTypeId(
          0,
          100,
          "id",
          "asc",
          searchType
        );
        setProducts(response.content);
      } else {
        response = await getAllProducts(0, 100, "id", "asc");
        setProducts(response.data.content);
      }
      setImageErrors({});
    } catch (error) {
      toast.error("Không thể lấy danh sách sản phẩm.");
      console.error(error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchType]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductTypeName = (productTypeId) => {
    const type = productTypes.find((type) => type.id === productTypeId);
    return type ? type.name : "Không xác định";
  };

  const getProductUnitName = (productUnitId) => {
    const unit = productUnits.find((unit) => unit.id === productUnitId);
    return unit ? unit.name : "Không xác định";
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const filteredProducts = products
    .filter((product) => {
      const matchStatus =
        searchStatus === "" || product.status === searchStatus;
      const matchName =
        searchName === "" ||
        product.name.toLowerCase().includes(searchName.toLowerCase());
      return matchStatus && matchName;
    })
    .sort((a, b) => {
      if (sortConfig.key === "exportPrice" || sortConfig.key === "quantity") {
        return sortConfig.direction === "asc"
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? a[sortConfig.key].localeCompare(b[sortConfig.key])
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      }
      return sortConfig.direction === "asc"
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedData = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddClick = () => {
    setMode("add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setMode("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleReloadProducts = () => {
    fetchProducts();
  };

  const handleViewDetail = async (product) => {
    try {
      const response = await getProductById(product.id);
      setSelectedProduct(response);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error(
        "Không thể xem chi tiết sản phẩm:",
        error.response?.data || error.message
      );
      toast.error("Không thể xem chi tiết sản phẩm. Vui lòng thử lại.");
    }
  };

  const handleImageError = (productId) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    return `${url}?t=${Date.now()}`;
  };
  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <ToggleProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        mode={mode}
        onSubmit={handleReloadProducts}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
        productTypes={productTypes}
        productUnits={productUnits}
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách sản phẩm
          </h1>
          <div className="flex items-center space-x-4 mr-2">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span>Ít</span>
              <div
                className="w-4 h-4 bg-red-600"
                title="Số lượng nhỏ hơn 10"
              ></div>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span>Vừa</span>
              <div
                className="w-4 h-4 bg-green-600"
                title="Số lượng từ 10 đến 500"
              ></div>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span>Nhiều</span>
              <div
                className="w-4 h-4 bg-yellow-600"
                title="Số lượng lớn hơn 500"
              ></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="w-48">
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Loại sản phẩm</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddClick}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="h-5 w-5 mr-2" />
              Thêm mới
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          {isLoading ? (
            <div className="bg-gray-50 min-h-screen w-auto p-6">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Mã</span>
                      <FaSort />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Hình ảnh</span>
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tên sản phẩm</span>
                      <FaSort />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-right text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("exportPrice")}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Giá bán</span>
                      <FaSort />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Số lượng</span>
                      <FaSort />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Loại sản phẩm</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Đơn vị tính</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    <div className="flex items-center justify-center space-x-1">
                      <span>Hành động</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap text-left">
                      <div className="text-sm text-gray-900">{product.id}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                        {product.thumbnail && !imageErrors[product.id] ? (
                          <img
                            src={getImageUrl(product.thumbnail)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(product.id)}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            Chưa có ảnh
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-left">
                      <div className="text-sm text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(product.exportPrice)}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <div
                        className={`text-sm font-medium ${
                          product.quantity < 10
                            ? "text-red-600"
                            : product.quantity > 500
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.quantity}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 text-left">
                        {getProductTypeName(product.productTypeId)}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 text-left">
                        {getProductUnitName(product.productUnitId)}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleViewDetail(product)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Xem chi tiết"
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Sửa"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} của{" "}
            {filteredProducts.length} bản ghi
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxPagesToShow={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
