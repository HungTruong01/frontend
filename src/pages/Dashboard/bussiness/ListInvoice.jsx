import React, { useEffect, useState } from "react";
import {
  FaRegTrashAlt,
  FaEye,
  FaEdit,
  FaPlus,
  FaSearch,
  FaFileExport,
} from "react-icons/fa";
import InvoiceDetailModal from "@/components/Dashboard/invoice/InvoiceDetailModal";
import AddInvoiceModal from "@/components/Dashboard/invoice/AddInvoiceModal";
import EditInvoiceModal from "@/components/Dashboard/invoice/EditInvoiceModal";
import {
  getAllInvoicesWithPartnerName,
  deleteInvoice,
  updateInvoice,
  getInvoiceWithDetails,
  getAllInvoices,
} from "@/api/invoiceApi";
import { getAllInvoiceTypes } from "@/api/invoiceTypeApi";
import "jspdf-autotable";
import { toast } from "react-toastify";
import { exportExcel } from "@/utils/exportExcel";

const ListInvoice = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchType, setSearchType] = useState("");
  const [searchPartner, setSearchPartner] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [invoiceType, setInvoiceType] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await getAllInvoicesWithPartnerName(0, 100, "id", "asc");
      const allInvoicesData = response.content || [];
      // console.log(allInvoicesData);
      setAllInvoices(allInvoicesData);
      setTotalElements(allInvoicesData.length);
      applyFilters(allInvoicesData, searchType, searchPartner, searchDate);
      setIsLoading(false);
    } catch (error) {
      console.log("Lỗi khi lấy hóa đơn", error);
      setIsLoading(false);
    }
  };

  const fetchInvoiceType = async () => {
    try {
      const response = await getAllInvoiceTypes();
      setInvoiceType(response.content || []);
    } catch (error) {
      console.log("Lỗi khi lấy loại hóa đơn", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchInvoiceType();
  }, []);

  const applyFilters = (invoices, typeFilter, partnerFilter, dateFilter) => {
    const filtered = invoices.filter((invoice) => {
      const matchType =
        typeFilter === "" || invoice.invoiceTypeId === parseInt(typeFilter);
      const matchPartner =
        partnerFilter === "" ||
        invoice.partnerName
          ?.toLowerCase()
          .includes(partnerFilter.toLowerCase());
      const matchDate =
        dateFilter === "" ||
        (invoice.createdAt &&
          new Date(invoice.createdAt).toISOString().split("T")[0] ===
            dateFilter);
      return matchType && matchPartner && matchDate;
    });

    setFilteredInvoices(filtered);
    setTotalElements(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  useEffect(() => {
    applyFilters(allInvoices, searchType, searchPartner, searchDate);
    setCurrentPage(1);
  }, [searchType, searchPartner, searchDate, allInvoices, itemsPerPage]);

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
      const fullInvoice = await getInvoiceWithDetails(invoice.id);
      setSelectedInvoice(fullInvoice);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hóa đơn để sửa:", error);
    }
  };

  const handleEditSubmit = async (updatedInvoice) => {
    try {
      await updateInvoice(updatedInvoice.id, updatedInvoice);
      const refreshedInvoice = await getInvoiceWithDetails(updatedInvoice.id);
      refreshedInvoice.partnerName = refreshedInvoice.partner?.name || "N/A";

      setAllInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === refreshedInvoice.id ? refreshedInvoice : invoice
        )
      );

      applyFilters(
        allInvoices.map((invoice) =>
          invoice.id === refreshedInvoice.id ? refreshedInvoice : invoice
        ),
        searchType,
        searchPartner,
        searchDate
      );

      setIsEditModalOpen(false);
      setSelectedInvoice(null);
      toast.success("Cập nhật hóa đơn thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật hóa đơn:", err);
      toast.error("Đã xảy ra lỗi khi cập nhật hóa đơn.");
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await deleteInvoice(id);
      const updatedInvoices = allInvoices.filter(
        (invoice) => invoice.id !== id
      );
      setAllInvoices(updatedInvoices);

      applyFilters(updatedInvoices, searchType, searchPartner, searchDate);

      console.log("Xóa hóa đơn:", id);

      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
    }
  };

  const handleAddInvoice = async (newInvoice) => {
    try {
      setIsAddModalOpen(false);
      await fetchInvoices();
      toast.success("Thêm hóa đơn thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm hóa đơn:", error);
      toast.error("Đã xảy ra lỗi khi thêm hóa đơn!");
    }
  };

  const handleSearch = () => {
    applyFilters(allInvoices, searchType, searchPartner, searchDate);
    setCurrentPage(1);
  };

  const handleChangeItemsPerPage = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
  };

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
          </div>
        </div>

        <div className="overflow-x-auto bg-white mt-6">
          {isLoading ? (
            <div className="text-center py-4">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/7">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/7">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/7">
                    Ngày lập
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 w-1/7">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/7">
                    Tên đối tác
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

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị{" "}
            {filteredInvoices.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}{" "}
            đến {Math.min(currentPage * itemsPerPage, filteredInvoices.length)}{" "}
            của {filteredInvoices.length} bản ghi
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
              disabled={currentPage === totalPages || totalPages === 0}
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

export default ListInvoice;
