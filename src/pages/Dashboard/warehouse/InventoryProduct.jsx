import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getAllInventoryWarehouse } from "@/api/inventoryWarehouseApi";
import { getWarehouseById } from "@/api/warehouseApi";
import { getProductById } from "@/api/productApi";
import { toast } from "react-toastify";
const InventoryProduct = () => {
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const displayColumns = [
    { key: "id", label: "Mã tồn kho" },
    { key: "warehouseName", label: "Tên kho" },
    { key: "productName", label: "Tên sản phẩm" },
    { key: "quantity", label: "Số lượng" },
  ];

  const fetchInventoryProducts = async () => {
    try {
      const response = await getAllInventoryWarehouse();
      const products = response.content || [];

      const enrichedProducts = await Promise.all(
        products.map(async (item) => {
          try {
            const [warehouse, product] = await Promise.all([
              getWarehouseById(item.warehouseId),
              getProductById(item.productId),
            ]);

            return {
              ...item,
              warehouseName: warehouse?.name || "Kho không rõ",
              productName: product?.name || `SP${item.productId}`,
            };
          } catch (innerErr) {
            console.error(`Lỗi khi enrich sản phẩm ${item.id}:`, innerErr);
            return {
              ...item,
              warehouseName: "Lỗi kho",
              productName: "Lỗi sản phẩm",
            };
          }
        })
      );

      setInventoryProducts(enrichedProducts);
      setFilteredData(enrichedProducts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tồn kho:", error);
      toast.error("Không thể tải danh sách tồn kho");
    }
  };

  useEffect(() => {
    fetchInventoryProducts();
  }, []);

  const handleSearch = () => {
    const filtered = inventoryProducts.filter((item) =>
      displayColumns.some((col) => {
        const value = item[col.key]?.toString().toLowerCase() || "";
        return value.includes(searchValue.toLowerCase());
      })
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === "") {
      setFilteredData(inventoryProducts);
      setCurrentPage(1);
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm tạo danh sách các nút trang hiển thị
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return {
      pages,
      showFirst: startPage > 1,
      showLast: endPage < totalPages,
    };
  };

  const { pages, showFirst, showLast } = getPageNumbers();

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sản phẩm tồn kho</h1>
          <div className="relative w-64 ml-auto">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <FaSearch className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {displayColumns.map((col) => (
                  <th
                    key={col.key}
                    className="py-3 px-4 font-semibold whitespace-nowrap text-left"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    {displayColumns.map((col) => (
                      <td
                        key={col.key}
                        className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-left"
                      >
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={displayColumns.length}
                    className="py-8 text-center text-gray-500"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} của{" "}
            {filteredData.length} bản ghi
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Trước
            </button>
            <div className="flex items-center space-x-2">
              {showFirst && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    1
                  </button>
                  {pages[0] > 2 && <span className="text-gray-600">...</span>}
                </>
              )}
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}
              {showLast && (
                <>
                  {pages[pages.length - 1] < totalPages - 1 && (
                    <span className="text-gray-600">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryProduct;
