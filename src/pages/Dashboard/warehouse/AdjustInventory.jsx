import React, { useEffect, useState } from "react";
import {
  getAllInventoryAdjustment,
  deleteInventoryAdjustment,
} from "@/api/inventoryAdjustmentApi";
import { getWarehouseById } from "@/api/warehouseApi";
import { getProductById } from "@/api/productApi";
import { getInventoryAdjustmentTypeById } from "@/api/inventoryAdjustmentTypesApi";
import {
  FaSearch,
  FaRegTrashAlt,
  FaEye,
  FaEdit,
  FaFileExport,
} from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ToggleInventoryAdjustment from "@/components/Dashboard/warehouse/ToggleInventoryAdjustment";
import { exportExcel } from "@/utils/exportExcel";
import { Pagination } from "@/utils/pagination";

const AdjustInventory = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const navigate = useNavigate();

  const displayColumns = [
    { key: "id", label: "Mã" },
    { key: "quantity", label: "Số lượng" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "adjustmentTypeName", label: "Lý do điều chỉnh" },
    { key: "productName", label: "Tên sản phẩm" },
    { key: "warehouseName", label: "Kho bãi" },
  ];

  const fetchData = async () => {
    try {
      const response = await getAllInventoryAdjustment(0, 100, "id", "asc");
      const adjustmentData = response.content || [];

      const enrichedAdjustments = await Promise.all(
        adjustmentData.map(async (adjustment) => {
          try {
            let warehouse = null;
            try {
              warehouse = await getWarehouseById(adjustment.warehouseId);
              if (!warehouse || !warehouse.name) {
                console.error(
                  "Warehouse missing or no name property:",
                  warehouse
                );
              }
            } catch (warehouseErr) {
              console.error(
                `Error fetching warehouse ID ${adjustment.warehouseId}:`,
                warehouseErr
              );
            }

            let product = null;
            try {
              product = await getProductById(adjustment.productId);
              if (!product || !product.name) {
                console.error("Product missing or no name property:", product);
              }
            } catch (productErr) {
              console.error(
                `Error fetching product ID ${adjustment.productId}:`,
                productErr
              );
            }
            const adjustmentTypeId = adjustment.inventoryAdjustmentTypeId;
            let adjustmentType = null;
            try {
              adjustmentType = await getInventoryAdjustmentTypeById(
                adjustmentTypeId
              );
              if (!adjustmentType || !adjustmentType.name) {
                console.error(
                  "Adjustment type missing or no name property:",
                  adjustmentType
                );
              }
            } catch (typeErr) {
              console.error(
                `Error fetching adjustment type ID ${adjustmentTypeId}:`,
                typeErr
              );
            }

            return {
              ...adjustment,
              warehouseName:
                warehouse && warehouse.name
                  ? warehouse.name
                  : `Kho ${adjustment.warehouseId}`,
              productName:
                product && product.name
                  ? product.name
                  : `Sản phẩm ${adjustment.productId}`,
              adjustmentTypeName:
                adjustmentType && adjustmentType.name
                  ? adjustmentType.name
                  : `Loại ${adjustmentTypeId}`,
            };
          } catch (innerErr) {
            console.error(
              `Lỗi khi lấy thông tin chi tiết điều chỉnh ${adjustment.id}:`,
              innerErr
            );
            return {
              ...adjustment,
              warehouseName: `Kho ${adjustment.warehouseId}`,
              productName: `Sản phẩm ${adjustment.productId}`,
              adjustmentTypeName: `Loại ${
                adjustment.inventoryAdjustmentTypeId ||
                adjustment.adjustmentTypeId
              }`,
            };
          }
        })
      );

      setAdjustments(enrichedAdjustments);
      setFilteredData(enrichedAdjustments);
    } catch (error) {
      console.error("Main fetch error:", error);
      toast.error("Không thể tải danh sách điều chỉnh tồn kho");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSearch = () => {
    const filtered = adjustments.filter((item) =>
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
      setFilteredData(adjustments);
      setCurrentPage(1);
    }
  };

  const handleAddNew = async () => {
    setIsAddModalOpen(false);
    await fetchData();
    toast.success("Thêm mới điều chỉnh tồn kho thành công");
  };

  const handleViewDetail = (adjustmentId) => {
    navigate(`/dashboard/warehouse/adjust-inventory/${adjustmentId}`);
  };

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    setIsEditModalOpen(false);
    setCurrentEditItem(null);
    await fetchData();
    toast.success("Cập nhật điều chỉnh tồn kho thành công");
  };

  const handleDelete = async (item) => {
    if (window.confirm("Bạn có chắc muốn xóa điều chỉnh này?")) {
      try {
        await deleteInventoryAdjustment(item.id);
        await fetchData();
        toast.success("Xóa điều chỉnh thành công");
      } catch (error) {
        console.error("Lỗi khi xóa điều chỉnh:", error);
        toast.error("Lỗi khi xóa điều chỉnh");
      }
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map((adjustment) => ({
      STT: adjustment.id,
      "Số lượng": adjustment.quantity,
      "Ngày tạo": formatDate(adjustment.createdAt),
      "Lý do điều chỉnh": adjustment.adjustmentTypeName,
      "Tên sản phẩm": adjustment.productName,
      "Kho bãi": adjustment.warehouseName,
    }));

    exportExcel({
      data: exportData,
      fileName: "Danh sách điều chỉnh tồn kho",
      sheetName: "Điều chỉnh tồn kho",
      autoWidth: true,
      zebraPattern: true,
    });
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {isEditModalOpen && currentEditItem && (
        <ToggleInventoryAdjustment
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentEditItem(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={currentEditItem}
          isEditing={true}
        />
      )}

      {isAddModalOpen && (
        <ToggleInventoryAdjustment
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddNew}
          isEditing={false}
        />
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách điều chỉnh tồn kho
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow w-64">
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
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaFileExport className="h-5 w-5 mr-2" />
                Xuất file
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <GoPlus className="h-5 w-5 mr-2" />
                Thêm mới
              </button>
            </div>
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
                <th className="py-3 px-4 font-semibold text-center">
                  Hành động
                </th>
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
                        {col.key === "createdAt"
                          ? formatDate(row[col.key])
                          : row[col.key] || "N/A"}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleViewDetail(row.id)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Xem"
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Sửa"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        {/* <button
                          onClick={() => handleDelete(row)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Xóa"
                        >
                          <FaRegTrashAlt className="h-5 w-5" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={displayColumns.length + 1}
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

export default AdjustInventory;
