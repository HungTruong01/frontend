import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInvoices, fetchInvoiceDetail } from "@/redux/slices/invoiceSlice";
import { fetchInvoiceTypes } from "@/redux/slices/invoiceTypeSlice";
import { updateInvoice } from "@/api/invoiceApi";
import { FaEye, FaEdit, FaPlus, FaFileExport, FaSort } from "react-icons/fa";
import { toast } from "react-toastify";
import { exportExcel } from "@/utils/exportExcel";
import { Pagination } from "@/utils/pagination";
import { fetchPartners } from "@/redux/slices/partnerSlice";
import { formatCurrency, formatDate } from "@/utils/formatter";

const ListInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: invoices, loading: isLoading } = useSelector(
    (state) => state.invoices
  );
  const { list: invoiceType } = useSelector((state) => state.invoiceTypes);
  const { partners } = useSelector((state) => state.partner);

  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [filters, setFilters] = useState({ type: "", partner: "", date: "" });

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchInvoiceTypes());
    dispatch(fetchPartners());
  }, [dispatch]);

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
    return date.toISOString().split("T")[0];
  };

  const filteredInvoices = invoices
    .filter((invoice) => {
      const matchesType =
        filters.type === "" || invoice.invoiceTypeId === parseInt(filters.type);
      const matchesPartner =
        filters.partner === "" ||
        invoice.partnerName
          ?.toLowerCase()
          .includes(filters.partner.toLowerCase());
      const matchesDate =
        filters.date === "" ||
        formatForFilter(invoice.createdAt) === filters.date;
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
  }, [filters, invoices, itemsPerPage, filteredInvoices.length]);

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
    navigate("/dashboard/business/invoice/add");
  };

  const handleViewDetail = (invoice) => {
    navigate(`/dashboard/business/invoice/detail/${invoice.id}`);
  };

  const handleEditClick = (invoice) => {
    navigate(`/dashboard/business/invoice/edit/${invoice.id}`);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
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
                onClick={() => handleAddClick()}
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
                value={filters.partner}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, partner: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="relative flex-1">
              <select
                value={filters.type}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, type: e.target.value }));
                  setCurrentPage(1);
                }}
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
                value={filters.date}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, date: e.target.value }));
                  setCurrentPage(1);
                }}
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
                          {formatCurrency(invoice.moneyAmount)}
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
