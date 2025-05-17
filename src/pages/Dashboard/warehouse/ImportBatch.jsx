import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { getAllImportBatches } from "@/api/importBatch";
import { getAllProducts } from "@/api/productApi";
import { getAllWarehouse } from "@/api/warehouseApi";
import { getAllWarehouseTransaction } from "@/api/warehouseTransactionApi";

const ImportBatch = () => {
  const [importBatches, setImportBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseTransaction, setWarehouseTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    warehouse: "all",
    product: "all",
    startDate: "",
    endDate: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "importDate",
    direction: "desc",
  });

  const [itemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          batchesResponse,
          productsResponse,
          warehousesResponse,
          warehouseTransactionRes,
        ] = await Promise.all([
          getAllImportBatches(0, 1000, "importDate", "desc"),
          getAllProducts(0, 1000, "id", "asc"),
          getAllWarehouse(0, 1000, "id", "asc"),
          getAllWarehouseTransaction(0, 1000, "id", "asc"),
        ]);
        setImportBatches(batchesResponse.data.content || []);
        setProducts(productsResponse.data.content || []);
        setWarehouses(warehousesResponse.content || []);
        setWarehouseTransaction(warehouseTransactionRes.content || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    // Reset to first page when filter changes
    setCurrentPage(1);
  };

  const filteredBatches = importBatches
    .filter((batch) => {
      const matchesSearch =
        batch.id.toString().includes(searchTerm) ||
        batch.productId.toString().includes(searchTerm);

      const matchesWarehouse =
        filters.warehouse === "all" ||
        batch.warehouseId === parseInt(filters.warehouse);

      const matchesProduct =
        filters.product === "all" ||
        batch.productId === parseInt(filters.product);

      const matchesDate =
        (!filters.startDate ||
          new Date(batch.importDate) >= new Date(filters.startDate)) &&
        (!filters.endDate ||
          new Date(batch.importDate) <= new Date(filters.endDate));

      return matchesSearch && matchesWarehouse && matchesProduct && matchesDate;
    })
    .sort((a, b) => {
      if (sortConfig.key === "importDate" || sortConfig.key === "expireDate") {
        return sortConfig.direction === "asc"
          ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
          : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
      }

      return sortConfig.direction === "asc"
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    });

  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const paginatedData = filteredBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen w-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Danh sách lô hàng
          </h2>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã lô hoặc mã sản phẩm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.warehouse}
              onChange={(e) => handleFilterChange("warehouse", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả kho</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
            <select
              value={filters.product}
              onChange={(e) => handleFilterChange("product", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả sản phẩm</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-hidden">
            <thead>
              <tr className="bg-gray-200 border-b border-gray-200">
                <th
                  className="py-3 px-4 font-semibold text-gray-700 text-left cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center gap-2">
                    Mã
                    <FaSort />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-left">
                  Sản phẩm
                </th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-left">
                  Kho
                </th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-left">
                  Giá nhập
                </th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-left">
                  SL nhập
                </th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-left">
                  SL còn lại
                </th>

                <th
                  className="py-3 px-4 font-semibold text-gray-700 text-left cursor-pointer"
                  onClick={() => handleSort("importDate")}
                >
                  <div className="flex items-center gap-2">
                    Ngày nhập
                    <FaSort />
                  </div>
                </th>
                <th
                  className="py-3 px-4 font-semibold text-gray-700 text-left cursor-pointer"
                  onClick={() => handleSort("expireDate")}
                >
                  <div className="flex items-center gap-2">
                    Ngày hết hạn
                    <FaSort />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-left">
                  Giao dịch kho
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-gray-600">{batch.id}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {products.find((p) => p.id === batch.productId)?.name ||
                      "Không xác định"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {warehouses.find((w) => w.id === batch.warehouseId)?.name ||
                      "Không xác định"}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-right">
                    {batch.unitCost.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-right">
                    {batch.importQuantity}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-right">
                    {batch.remainQuantity}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(batch.importDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(batch.expireDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {`GD#${batch.warehouseTransactionId}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị{" "}
            {filteredBatches.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{" "}
            đến {Math.min(currentPage * itemsPerPage, filteredBatches.length)}{" "}
            của {filteredBatches.length} bản ghi
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
              disabled={currentPage === totalPages || totalPages === 0}
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

export default ImportBatch;
