import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaPlus,
  FaSearch,
  FaFileExport,
  FaSort,
} from "react-icons/fa";
import InvoiceDetailModal from "@/components/Dashboard/invoice/InvoiceDetailModal";
import AddInvoiceModal from "@/components/Dashboard/invoice/AddInvoiceModal";
import EditInvoiceModal from "@/components/Dashboard/invoice/EditInvoiceModal";
import {
  getAllInvoicesWithPartnerName,
  getAllInvoices,
  updateInvoice,
  getInvoiceDetail,
} from "@/api/invoiceApi";
import { getAllInvoiceTypes } from "@/api/invoiceTypeApi";
import { toast } from "react-toastify";
import { exportExcel } from "@/utils/exportExcel";
import { Pagination } from "@/utils/pagination";

const ListInvoice = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [allInvoices, setAllInvoices] = useState([]);
  const [invoiceType, setInvoiceType] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchType, setSearchType] = useState("");
  const [searchPartner, setSearchPartner] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, invoiceTypeRes] = await Promise.all([
          getAllInvoicesWithPartnerName(0, 100, "id", "asc"),
          getAllInvoiceTypes(0, 100, "id", "asc"),
        ]);
        setAllInvoices(invoiceRes.content);
        setTotalElements(invoiceRes.length);
        setInvoiceType(invoiceTypeRes.data.content);
        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
        toast.error("Lỗi tải dữ liệu hoá đơn");
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

  const formatForFilter = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0]; // yyyy-MM-dd
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount) => {
    return `${new Intl.NumberFormat("vi-VN").format(amount)}`;
  };

  const filteredInvoices = allInvoices
    .filter((invoice) => {
      const matchesType =
        searchType === "" || invoice.invoiceTypeId === parseInt(searchType);
      const matchesPartner =
        searchPartner === "" ||
        invoice.partnerName
          ?.toLowerCase()
          .includes(searchPartner.toLowerCase());
      const matchesDate =
        searchDate === "" || formatForFilter(invoice.createdAt) === searchDate;

      return matchesType && matchesPartner && matchesDate;
    })
    .sort((a, b) => {
      if (sortConfig.key === "createdAt") {
        return sortConfig.direction === "asc"
          ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
          : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
      }

      if (sortConfig.key === "moneyAmount") {
        return sortConfig.direction === "asc"
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }

      return sortConfig.direction === "asc"
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    });

  useEffect(() => {
    setTotalElements(filteredInvoices.length);
    setTotalPages(Math.ceil(filteredInvoices.length / itemsPerPage));
    setCurrentPage(1);
  }, [
    searchType,
    searchPartner,
    searchDate,
    allInvoices,
    itemsPerPage,
    filteredInvoices.length,
  ]);

  const handleExportExcel = () => {
    const exportData = filteredInvoices.map((invoice, index) => ({
      STT: index + 1,
      "Mã hóa đơn": invoice.id,
      "Ngày lập": formatDate(invoice.createdAt),
      "Số tiền": formatCurrency(invoice.moneyAmount) + " VNĐ",
      "Mã đơn hàng": invoice.orderId || "N/A",
      "Đối tác": invoice.partnerName || "N/A",
      "Loại hóa đơn": getInvoiceTypeName(invoice.invoiceTypeId),
    }));

    exportExcel({
      data: exportData,
      fileName: "Danh sách hoá đơn",
      sheetName: "Hóa đơn",
      autoWidth: true,
      zebraPattern: true,
    });
  };

  const paginatedData = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getInvoiceTypeName = (invoiceId) => {
    const type = invoiceType.find((type) => type.id === invoiceId);
    return type ? type.name : "Không xác định";
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = async (invoice) => {
    try {
      const fullInvoice = await getInvoiceDetail(invoice.id);
      setSelectedInvoice(fullInvoice);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hóa đơn để sửa:", error);
    }
  };

  const handleAddInvoice = async (newInvoice) => {
    try {
      setIsAddModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Lỗi khi thêm hóa đơn:", error);
      toast.error("Đã xảy ra lỗi khi thêm hóa đơn!");
    }
  };

  const handleEditSubmit = async (updatedInvoice) => {
    try {
      await updateInvoice(updatedInvoice.id, updatedInvoice);
      await fetchData();
      setIsEditModalOpen(false);
      setSelectedInvoice(null);
      toast.success("Cập nhật hóa đơn thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật hóa đơn:", err);
      toast.error("Đã xảy ra lỗi khi cập nhật hóa đơn.");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <InvoiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />
      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddInvoice}
      />
      <EditInvoiceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedInvoice(null);
        }}
        onSubmit={handleEditSubmit}
        invoice={selectedInvoice}
      />
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Danh sách hóa đơn
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaFileExport className="h-5 w-5 mr-2" />
                Xuất file
              </button>
              <button
                onClick={handleAddClick}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="h-5 w-5 mr-2" />
                Thêm mới
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm theo tên đối tác..."
                value={searchPartner}
                onChange={(e) => setSearchPartner(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
            <div className="relative flex-1">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Tất cả loại hóa đơn</option>
                {invoiceType.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white mt-6">
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
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/7 cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-2">
                      Mã
                      <FaSort />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/7 cursor-pointer"
                    onClick={() => handleSort("moneyAmount")}
                  >
                    <div className="flex items-center gap-2">
                      Số tiền
                      <FaSort />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/7 cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Ngày lập
                      <FaSort />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 w-1/7">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/7">
                    Đối tác
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/7">
                    Loại hóa đơn
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 w-1/7">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-left font-medium text-gray-900">
                          {invoice.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-left text-gray-900">
                          {formatCurrency(invoice.moneyAmount)} VNĐ
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-left text-gray-900">
                          {formatDate(invoice.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-center text-gray-900">
                          DH{invoice.orderId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.partnerName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getInvoiceTypeName(invoice.invoiceTypeId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => handleViewDetail(invoice)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(invoice)}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
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
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Không tìm thấy hóa đơn nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị{" "}
            {filteredInvoices.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}{" "}
            đến {Math.min(currentPage * itemsPerPage, filteredInvoices.length)}{" "}
            của {filteredInvoices.length} bản ghi
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

export default ListInvoice;
