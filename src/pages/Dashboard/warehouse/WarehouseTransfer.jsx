import React, { useEffect, useState } from "react";
import {
  getAllWarehouseTransfer,
  deleteWarehouseTransfer,
} from "@/api/warehouseTransferApi";
import { getWarehouseById } from "@/api/warehouseApi";
import { getProductById } from "@/api/productApi";
import {
  getAllDeliveryStatus,
  getDeliveryStatusById,
} from "@/api/deliveryStatusApi";
import { FaSearch, FaEye, FaEdit, FaFileExport } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { toast } from "react-toastify";
import ToggleWarehouseTransfer from "@/components/Dashboard/warehouse/ToggleWarehouseTransfer";
import { useNavigate } from "react-router-dom";
import { exportExcel } from "@/utils/exportExcel";
import { Pagination } from "@/utils/pagination";
import { formatDate } from "@/utils/formatter";

const WarehouseTransfer = () => {
  const [warehouseTransfer, setWarehouseTransfer] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const navigate = useNavigate();

  const displayColumns = [
    { key: "id", label: "Mã" },
    { key: "quantity", label: "Số lượng" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "statusName", label: "Trạng thái" },
    { key: "productName", label: "Tên sản phẩm" },
    { key: "sourceWarehouseName", label: "Kho xuất" },
    { key: "destinationWarehouseName", label: "Kho nhập" },
  ];

  const fetchData = async () => {
    try {
      const response = await getAllWarehouseTransfer(0, 100, "id", "asc");
      const transfers = response.content || [];
      const enrichedTransfers = await Promise.all(
        transfers.map(async (transfer) => {
          try {
            const [sourceWarehouse, destinationWarehouse, product, status] =
              await Promise.all([
                getWarehouseById(transfer.sourceWarehouseId),
                getWarehouseById(transfer.destinationWarehouseId),
                getProductById(transfer.productId),
                getDeliveryStatusById(transfer.statusId),
              ]);

            return {
              ...transfer,
              sourceWarehouseName: sourceWarehouse?.name || "Kho xuất không rõ",
              destinationWarehouseName:
                destinationWarehouse?.name || "Kho nhập không rõ",
              productName: product?.name || `Sản phẩm ${transfer.productId}`,
              statusName: status?.name || "Trạng thái không rõ",
            };
          } catch (error) {
            console.error(
              `Lỗi khi lấy thông tin chi tiết chuyển kho ${transfer.id}:`,
              error
            );
            return {
              ...transfer,
              sourceWarehouseName: "Lỗi kho xuất",
              destinationWarehouseName: "Lỗi kho nhập",
              productName: "Lỗi sản phẩm",
              statusName: "Lỗi trạng thái",
            };
          }
        })
      );

      setWarehouseTransfer(enrichedTransfers);
      setFilteredData(enrichedTransfers);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách điều chỉnh tồn kho:", error);
      toast.error("Không thể tải danh sách điều chỉnh tồn kho");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = warehouseTransfer.filter((item) =>
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
      setFilteredData(warehouseTransfer);
    }
  };

  const handleAddNew = async () => {
    setIsAddModalOpen(false);
    await fetchData();
  };

  const handleViewDetail = (transferId) => {
    navigate(`/dashboard/warehouse/warehouse-transfer/${transferId}`);
  };

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedData) => {
    setIsEditModalOpen(false);
    setCurrentEditItem(null);
    await fetchData();
  };

  const handleDelete = async (item) => {
    if (window.confirm("Bạn có chắc muốn xóa chuyển kho này?")) {
      try {
        await deleteWarehouseTransfer(item.id);
        await fetchData();
        toast.success("Xóa chuyển kho thành công");
      } catch (error) {
        console.error("Lỗi khi xóa chuyển kho:", error);
        toast.error("Lỗi khi xóa chuyển kho");
      }
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map((transfer) => ({
      STT: transfer.id,
      "Số lượng": transfer.quantity,
      "Ngày tạo": formatDate(transfer.createdAt),
      "Trạng thái": transfer.statusName,
      "Tên sản phẩm": transfer.productName,
      "Kho xuất": transfer.sourceWarehouseName,
      "Kho nhập": transfer.destinationWarehouseName,
    }));

    exportExcel({
      data: exportData,
      fileName: "Danh sách đơn hàng nội bộ",
      sheetName: "Đơn hàng nội bộ",
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
        <ToggleWarehouseTransfer
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentEditItem(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={currentEditItem}
          isEdit={true}
        />
      )}

      <ToggleWarehouseTransfer
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddNew}
        isEdit={false}
      />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách đơn hàng nội bộ
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
                          : row[col.key]}
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
        <div className="flex justify-between mt-4 space-x-2">
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

export default WarehouseTransfer;
