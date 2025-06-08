import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getAllInventoryWarehouse } from "@/api/inventoryWarehouseApi";
import { getAllWarehouse } from "@/api/warehouseApi";
import { getAllProducts } from "@/api/productApi";
import { toast } from "react-toastify";
import { Pagination } from "@/utils/pagination";

const InventoryProduct = () => {
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [warehouses, setWarehouses] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const displayColumns = [
    { key: "id", label: "Mã tồn kho" },
    { key: "warehouseName", label: "Tên kho" },
    { key: "productName", label: "Tên sản phẩm" },
    { key: "quantity", label: "Số lượng" },
  ];

  const fetchInventoryProducts = async () => {
    setIsLoading(true);
    try {
      const [inventoryRes, warehouseRes, productRes] = await Promise.all([
        getAllInventoryWarehouse(0, 100, "id", "asc"),
        getAllWarehouse(0, 100, "id", "asc"),
        getAllProducts(0, 100, "id", "asc"),
      ]);
      setWarehouses(warehouseRes.content);
      const inventories = inventoryRes.content || [];
      const warehouseList = warehouseRes.content || [];
      const productList = productRes.data.content || [];

      const warehouseMap = warehouseList.reduce((acc, w) => {
        acc[w.id] = w.name;
        return acc;
      }, {});

      const productMap = productList.reduce((acc, p) => {
        acc[p.id] = p.name;
        return acc;
      }, {});

      const enriched = inventories.map((item) => ({
        ...item,
        warehouseName: warehouseMap[item.warehouseId] || "Kho không rõ",
        productName: productMap[item.productId] || `SP${item.productId}`,
      }));

      setInventoryProducts(enriched);
      setFilteredData(enriched);
    } catch (error) {
      console.error("Lỗi khi tải tồn kho:", error);
      toast.error("Không thể tải danh sách tồn kho");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryProducts();
  }, []);

  useEffect(() => {
    const filtered = inventoryProducts.filter((item) => {
      const matchesSearch = item.productName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase());

      const matchesWarehouse =
        selectedWarehouse === "all" ||
        item.warehouseId === parseInt(selectedWarehouse);

      return matchesSearch && matchesWarehouse;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchValue, selectedWarehouse, inventoryProducts]);

  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tồn kho</h1>
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select
              value={selectedWarehouse}
              onChange={handleWarehouseChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[180px]"
            >
              <option value="all">Tất cả kho</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="bg-gray-50 min-h-screen w-auto p-6">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          ) : (
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
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} của{" "}
            {filteredData.length} bản ghi
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

export default InventoryProduct;
