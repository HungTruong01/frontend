import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaEdit, FaFileExport } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import {
  getAllWarehouseTransaction,
  deleteWarehouseTransaction,
  getWarehouseTransactionById,
} from "@/api/warehouseTransactionApi";
import { getOrderById } from "@/api/orderApi";
import { getDeliveryStatusById } from "@/api/deliveryStatusApi";
import { getWarehouseById } from "@/api/warehouseApi";
import { getWarehouseTransactionTypeById } from "@/api/warehouseTransactionTypeApi";
import ToggleWarehouseTransaction from "@/components/Dashboard/warehouse/ToggleWarehouseTransaction";
import { toast } from "react-toastify";
import { exportExcel } from "@/utils/exportExcel";
import { Pagination } from "@/utils/pagination";

const WarehouseTransaction = () => {
  const [warehouseTransaction, setWarehouseTransaction] = useState([]);
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
    { key: "orderCode", label: "Mã đơn hàng" },
    { key: "statusName", label: "Trạng thái" },
    { key: "transactionTypeName", label: "Loại giao dịch" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "warehouseName", label: "Kho bãi" },
  ];

  const fetchWarehouseTransaction = async () => {
    try {
      const response = await getAllWarehouseTransaction(0, 100, "id", "desc");
      const transactions = response.content;

      const enrichedTransactions = await Promise.all(
        transactions.map(async (tran) => {
          try {
            const [warehouse, order, status, type] = await Promise.all([
              getWarehouseById(tran.warehouseId),
              getOrderById(tran.orderId),
              getDeliveryStatusById(tran.statusId),
              getWarehouseTransactionTypeById(tran.transactionTypeId),
            ]);

            return {
              ...tran,
              warehouseName: warehouse?.name || "Kho không rõ",
              orderCode: order?.code || `DH${tran.orderId}`,
              statusName: status?.name || "Trạng thái không rõ",
              transactionTypeName: type?.name || "Loại không rõ",
            };
          } catch (error) {
            console.error(`Lỗi khi enrich giao dịch ${tran.id}:`, error);
            return {
              ...tran,
              warehouseName: "Lỗi kho",
              orderCode: "Lỗi đơn hàng",
              statusName: "Lỗi trạng thái",
              transactionTypeName: "Lỗi loại giao dịch",
            };
          }
        })
      );

      setWarehouseTransaction(enrichedTransactions);
      setFilteredData(enrichedTransactions);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giao dịch kho:", error);
      toast.error("Không thể tải danh sách giao dịch kho");
    }
  };

  useEffect(() => {
    fetchWarehouseTransaction();
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
    const filtered = warehouseTransaction.filter((item) =>
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
      setFilteredData(warehouseTransaction);
    }
  };

  const handleAddNew = async () => {
    setIsAddModalOpen(false);
    await fetchWarehouseTransaction();
  };

  const handleViewDetail = (id) => {
    navigate(`/dashboard/warehouse/warehouse-transaction-detail/${id}`);
  };

  const handleEdit = (item) => {
    if (item.statusName === "Đã hoàn thành") {
      toast.info("Không thể chỉnh sửa giao dịch đã hoàn thành");
      return;
    }
    setCurrentEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedItem) => {
    setIsEditModalOpen(false);
    setCurrentEditItem(null);
    await fetchWarehouseTransaction();
  };

  // const handleDelete = async (item) => {
  //   if (window.confirm("Bạn có chắc muốn xóa giao dịch này?")) {
  //     try {
  //       await deleteWarehouseTransaction(item.id);
  //       await fetchWarehouseTransaction();
  //       toast.success("Xóa giao dịch kho thành công");
  //     } catch (error) {
  //       console.error("Lỗi khi xóa giao dịch:", error);
  //       toast.error("Lỗi khi xóa giao dịch kho");
  //     }
  //   }
  // };

  const handleExportExcel = () => {
    const exportData = filteredData.map((transaction) => ({
      STT: transaction.id,
      "Mã đơn hàng": transaction.orderCode,
      "Trạng thái": transaction.statusName,
      "Loại giao dịch": transaction.transactionTypeName,
      "Ngày tạo": formatDate(transaction.createdAt),
      "Kho bãi": transaction.warehouseName,
    }));

    exportExcel({
      data: exportData,
      fileName: "Danh sách giao dịch kho",
      sheetName: "Giao dịch kho",
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
        <ToggleWarehouseTransaction
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentEditItem(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={currentEditItem}
          mode="edit"
        />
      )}

      {isAddModalOpen && (
        <ToggleWarehouseTransaction
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddNew}
          mode="add"
        />
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Giao dịch kho</h1>
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
                          className={`${
                            row.statusName === "Đã hoàn thành"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-500 hover:text-blue-700"
                          } transition-colors`}
                          title={
                            row.statusName === "Đã hoàn thành"
                              ? "Không thể chỉnh sửa"
                              : "Sửa"
                          }
                          disabled={row.statusName === "Đã hoàn thành"}
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

export default WarehouseTransaction;
