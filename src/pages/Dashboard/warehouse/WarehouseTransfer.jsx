import React, { useEffect, useState } from "react";
import {
  getAllWarehouseTransfer,
  deleteWarehouseTransfer,
} from "@/api/warehouseTransferApi";
import { getAllWarehouse } from "@/api/warehouseApi";
import { getAllProducts } from "@/api/productApi";
import { getAllDeliveryStatus } from "@/api/deliveryStatusApi";
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
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const [transferRes, warehouseRes, productRes, statusRes] =
        await Promise.all([
          getAllWarehouseTransfer(0, 100, "id", "asc"),
          getAllWarehouse(0, 100, "id", "asc"),
          getAllProducts(0, 100, "id", "asc"),
          getAllDeliveryStatus(0, 100, "id", "asc"),
        ]);

      const warehouseList = warehouseRes.content || [];
      const productList = productRes.data.content || [];
      const statusList = statusRes.data.content || [];

      const warehouseMap = warehouseList.reduce((acc, w) => {
        acc[w.id] = w.name;
        return acc;
      }, {});

      const productMap = productList.reduce((acc, p) => {
        acc[p.id] = p.name;
        return acc;
      }, {});

      const statusMap = statusList.reduce((acc, s) => {
        acc[s.id] = s.name;
        return acc;
      }, {});

      const transfers = transferRes.content.map((transfer) => ({
        ...transfer,
        sourceWarehouseName:
          warehouseMap[transfer.sourceWarehouseId] || "Kho xuất không rõ",
        destinationWarehouseName:
          warehouseMap[transfer.destinationWarehouseId] || "Kho nhập không rõ",
        productName:
          productMap[transfer.productId] || `Sản phẩm ${transfer.productId}`,
        statusName: statusMap[transfer.statusId] || "Trạng thái không rõ",
      }));

      setWarehouseTransfer(transfers);
      setFilteredData(transfers);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = warehouseTransfer.filter((item) => {
      const matchesSearch = item.productName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || item.statusId === parseInt(selectedStatus);

      return matchesSearch && matchesStatus;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchValue, selectedStatus, warehouseTransfer]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
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
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[180px]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="1">Đã hoàn thành</option>
              <option value="2">Đang xử lý</option>
            </select>

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
                          {row.statusName === "Đã hoàn thành" ? (
                            <FaEdit
                              className="h-5 w-5 text-gray-400 cursor-not-allowed"
                              title="Không thể sửa khi đã hoàn thành"
                            />
                          ) : (
                            <button
                              onClick={() => handleEdit(row)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="Sửa"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                          )}
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
          )}
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
