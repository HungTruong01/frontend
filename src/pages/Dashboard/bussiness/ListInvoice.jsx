import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { FaRegTrashAlt, FaEye, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import InvoiceDetailModal from "@/components/Dashboard/invoice/InvoiceDetailModal";
import AddInvoiceModal from "@/components/Dashboard/invoice/AddInvoiceModal";
import EditInvoiceModal from "@/components/Dashboard/invoice/EditInvoiceModal";

const ListInvoice = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchPartner, setSearchPartner] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState([
    {
      id: "HD001",
      totalAmount: 1500000,
      date: "31-03-2025",
      partnerName: "Nguyễn Văn A",
      invoiceTypeId: 1,
      note: "Hóa đơn bán hàng tháng 3",
      invoiceDetails: [
        {
          orderCode: "DH001",
          amount: 1500000,
        },
      ],
    },
    {
      id: "HD002",
      totalAmount: 2500000,
      date: "30-03-2025",
      partnerName: "Phạm Tiến Mạnh",
      invoiceTypeId: 2,
      note: "Hóa đơn mua hàng tháng 3",
      invoiceDetails: [
        {
          orderCode: "DH002",
          amount: 2500000,
        },
      ],
    },
    {
      id: "HD003",
      totalAmount: 1800000,
      date: "29-03-2025",
      partnerName: "Nguyễn Trung Đức",
      invoiceTypeId: 1,
      note: "Hóa đơn bán hàng tháng 3",
      invoiceDetails: [
        {
          orderCode: "DH003",
          amount: 1800000,
        },
      ],
    },
  ]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchName = invoice.id
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchPartner = invoice.partnerName
      .toLowerCase()
      .includes(searchPartner.toLowerCase());
    return matchName && matchPartner;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedData = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedInvoice) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
    setIsEditModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleDeleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    console.log("Xóa hóa đơn:", id);
  };

  const handleAddInvoice = (newInvoice) => {
    setInvoices((prev) => [...prev, newInvoice]);
    setIsAddModalOpen(false);
    console.log("Thêm hóa đơn mới:", newInvoice);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchPartnerChange = (e) => {
    setSearchPartner(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                <FiUpload className="h-5 w-5 mr-2" />
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
                placeholder="Tìm theo mã hóa đơn..."
                value={searchName}
                onChange={handleSearchNameChange}
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
              <input
                type="text"
                placeholder="Tìm theo tên đối tác..."
                value={searchPartner}
                onChange={handleSearchPartnerChange}
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

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mt-6">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider w-1/7">
                  Mã hóa đơn
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 tracking-wider w-1/7">
                  Số tiền
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider w-1/7">
                  Ngày lập
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider w-1/7">
                  Đơn hàng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider w-1/7">
                  Tên đối tác
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider w-1/7">
                  Loại hóa đơn
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 tracking-wider w-1/7">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(invoice.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.invoiceDetails[0].orderCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.partnerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.invoiceTypeId === 1
                        ? "Hóa đơn bán"
                        : "Hóa đơn mua"}
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
                        className="text-green-500 hover:text-green-700 transition-colors"
                        title="Sửa"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Xóa"
                      >
                        <FaRegTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} của{" "}
            {filteredInvoices.length} bản ghi
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
              disabled={currentPage === totalPages}
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

export default ListInvoice;
