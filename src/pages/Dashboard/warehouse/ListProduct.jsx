import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaRegTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import AddProductModal from "@/components/Dashboard/product/AddProductModal";
import EditProductModal from "@/components/Dashboard/product/EditProductModal";
import ProductDetailModal from "@/components/Dashboard/product/ProductDetailModal";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/productApi";
import { getAllProductTypes } from "@/api/productTypeApi";
import { getAllProductUnits } from "@/api/productUnitApi";
import { toast } from "react-toastify";

const ListProduct = () => {
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchName, setSearchName] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [productUnits, setProductUnits] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts(0, 100, "id", "asc");
      console.log("product data", response.data.content);
      setProducts(response.data.content);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await getAllProductTypes();
      setProductTypes(response.content);
    } catch (error) {
      console.log("Error fetching product types:", error);
    }
  };

  const fetchProductUnits = async () => {
    try {
      const response = await getAllProductUnits();
      setProductUnits(response.content);
    } catch (error) {
      console.log("Error fetching product units:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
    fetchProductUnits();
  }, []);

  const getProductTypeName = (productTypeId) => {
    const type = productTypes.find((type) => type.id === productTypeId);
    return type ? type.name : "Unknown";
  };

  const getProductUnitName = (productUnitId) => {
    const unit = productUnits.find((unit) => unit.id === productUnitId);
    return unit ? unit.name : "Unknown";
  };

  const filteredProducts = products.filter((product) => {
    const matchStatus = searchStatus === "" || product.status === searchStatus;
    const matchType = searchType === "" || product.productTypeId === searchType;
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

  const handleAddSubmit = async (newProduct) => {
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        productTypeId: Number(newProduct.productTypeId),
        productUnitId: Number(newProduct.productUnitId),
      };

      const response = await createProduct(productData);
      toast.success("Thêm sản phẩm mới thành công");
      setProducts((prev) => [...prev, response]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.log("Không thể thêm sản phẩm. Vui lòng thử lại.", error);
      toast.error("Không thể thêm sản phẩm. Vui lòng thử lại.");
    }
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

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedProduct) => {
    try {
      const productData = {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: Number(updatedProduct.price),
        quantity: Number(updatedProduct.quantity),
        productTypeId: Number(updatedProduct.productTypeId),
        productUnitId: Number(updatedProduct.productUnitId),
      };

      const response = await updateProduct(updatedProduct.id, productData);
      toast.success("Cập nhật sản phẩm thành công");
      setProducts((prev) =>
        prev.map((product) =>
          product.id === updatedProduct.id ? response : product
        )
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        "Không thể cập nhật sản phẩm:",
        error.response?.data || error.message
      );
      toast.error("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(productId);
        toast.success("Xóa sản phẩm thành công");
        setProducts((prev) =>
          prev.filter((product) => product.id !== productId)
        );
      } catch (error) {
        console.error(
          "Không thể xóa sản phẩm:",
          error.response?.data || error.message
        );
        toast.error("Không thể xóa sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
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
        productTypes={productTypes}
        productUnits={productUnits}
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
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1">
                    <span>STT</span>
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
                    <span>Số lượng</span>
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
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="text-sm text-gray-900">{product.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="text-sm text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {product.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 text-left">
                      {getProductTypeName(product.productTypeId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 text-left">
                      {getProductUnitName(product.productUnitId)}
                    </div>
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
                        onClick={() => handleDeleteProduct(product.id)}
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
