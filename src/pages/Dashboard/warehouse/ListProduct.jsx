import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaRegTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import AddProductModal from "../../../components/Dashboard/product/AddProductModal";
import EditProductModal from "../../../components/Dashboard/product/EditProductModal";
import ProductDetailModal from "../../../components/Dashboard/product/ProductDetailModal";

const ListProduct = () => {
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchName, setSearchName] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      id: "SP006",
      name: "Trứng gà",
      description: "Trứng gà ta tươi ngon, giàu dinh dưỡng",
      price: 35000,
      stock: 80,
      type: "Thực phẩm",
      unit: "Vỉ",
    },
    {
      id: "SP007",
      name: "Nước mắm Phú Quốc 40 độ đạm",
      description: "Nước mắm truyền thống được ủ từ cá cơm tươi",
      price: 95000,
      stock: 150,
      type: "Thực phẩm",
      unit: "Chai",
    },
    {
      id: "SP008",
      name: "Mì ăn liền Hảo Hảo",
      description: "Mì tôm chua cay thơm ngon, thương hiệu nổi tiếng",
      price: 5000,
      stock: 150,
      type: "Thực phẩm",
      unit: "Gói",
    },
    {
      id: "SP009",
      name: "Sữa tươi Vinamilk không đường",
      description: "Sữa tươi thanh trùng tốt cho sức khỏe",
      price: 32000,
      stock: 300,
      type: "Thực phẩm",
      unit: "Hộp",
    },
    {
      id: "SP010",
      name: "Dầu ăn cao cấp Tường An",
      description: "Dầu ăn nguyên chất từ cây mè, tốt cho sức khỏe",
      price: 85000,
      stock: 0,
      type: "Thực phẩm",
      unit: "Chai",
    },
  ]);

  const productTypes = ["Thực phẩm"];
  const productStatuses = ["Còn hàng", "Hết hàng"];

  const filteredProducts = products.filter((product) => {
    const matchStatus = searchStatus === "" || product.status === searchStatus;
    const matchType = searchType === "" || product.type === searchType;
    const matchName =
      searchName === "" ||
      product.name.toLowerCase().includes(searchName.toLowerCase());
    return matchStatus && matchType && matchName;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedData = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (newProduct) => {
    setProducts([
      ...products,
      {
        ...newProduct,
        id: `SP${String(products.length + 1).padStart(3, "0")}`,
      },
    ]);
    setIsAddModalOpen(false);
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setIsEditModalOpen(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        product={selectedProduct}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách sản phẩm
          </h1>
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
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Loại sản phẩm</option>
                {productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1">
                    <span>Mã sản phẩm</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1">
                    <span>Tên sản phẩm</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  <div className="flex items-center justify-end space-x-1">
                    <span>Giá tiền</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Tồn kho</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1">
                    <span>Loại sản phẩm</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1">
                    <span>Đơn vị tính</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
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
                        className="text-green-500 hover:text-green-700 transition-colors"
                        title="Sửa"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Xóa"
                      >
                        <FaRegTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} của{" "}
            {filteredProducts.length} bản ghi
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              Trước
            </button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
