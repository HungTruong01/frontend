import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTimes, FaInfoCircle, FaUser } from "react-icons/fa";
import { getInvoiceDetail } from "@/api/invoiceApi";
import { FaGift } from "react-icons/fa6";
import { BsBoxSeam } from "react-icons/bs";
import { formatCurrency, formatDate } from "@/utils/formatter";

const InvoiceDetailModal = ({ isOpen, onClose, invoice }) => {
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const { list: invoiceTypes } = useSelector((state) => state.invoiceTypes);
  const [error, setError] = useState(null);

  const fetchInvoiceDetails = async () => {
    if (isOpen && invoice && invoice.id) {
      try {
        const data = await getInvoiceDetail(invoice.id);
        setInvoiceDetails(data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", err);
        setError("Không thể tải chi tiết hóa đơn. Vui lòng thử lại sau.");
      }
    }
  };

  useEffect(() => {
    if (isOpen && invoice?.id) {
      fetchInvoiceDetails();
    }
  }, [isOpen, invoice]);

  const calculateTotalAmount = () => {
    return invoiceDetails?.order?.totalMoney || 0;
  };

  const calculatePaidAmountThisInvoice = () => {
    return invoiceDetails?.moneyAmount || 0;
  };

  const calculateTotalPaidAmount = () => {
    return invoiceDetails?.order?.paidMoney || 0;
  };

  const calculateRemainingAmount = () => {
    const total = calculateTotalAmount();
    const paid = calculateTotalPaidAmount();
    return Math.max(total - paid, 0);
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl transform transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-blue-100 bg-blue-500 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Chi tiết hóa đơn</h2>
              <p className="text-blue-100 text-sm mt-1">
                Mã hóa đơn: {invoice.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 transition-colors duration-200 focus:outline-none p-3 rounded-full"
              aria-label="Đóng"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {invoiceDetails && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                  <FaInfoCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin chung
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mã hóa đơn
                    </label>
                    <p className="font-medium text-gray-800">
                      {invoiceDetails.id || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Loại hóa đơn
                    </label>
                    <p className="font-medium text-gray-800">
                      {invoiceDetails.invoiceType.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Ngày lập
                    </label>
                    <p className="font-medium text-gray-800">
                      {formatDate(invoiceDetails.createdAt)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Hình thức thanh toán
                    </label>
                    <p className="font-medium text-gray-800">
                      {invoiceDetails.paymentType}
                    </p>
                  </div>
                </div>
              </div>

              {invoiceDetails.partner && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                    <FaUser className="h-4 w-4 text-blue-600 mr-2" />
                    Thông tin đối tác
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-500 block mb-1">
                        Tên đối tác
                      </span>
                      <p className="font-medium text-gray-800">
                        {invoiceDetails.partner.name || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-500 block mb-1">
                        Số điện thoại
                      </span>
                      <p className="font-medium text-gray-800">
                        {invoiceDetails.partner.phone || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-500 block mb-1">
                        Email
                      </span>
                      <p className="font-medium text-gray-800">
                        {invoiceDetails.partner.email || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-500 block mb-1">
                        Địa chỉ
                      </span>
                      <p className="font-medium text-gray-800">
                        {invoiceDetails.partner.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {invoiceDetails.order && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                    <FaGift className="h-4 w-4 text-blue-600 mr-2" />
                    Chi tiết đơn hàng
                  </h3>
                  <div className="overflow-x-auto bg-gray-50 rounded-xl border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Sản phẩm
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">
                            Số lượng
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">
                            Đơn giá
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceDetails.items?.length > 0 ? (
                          invoiceDetails.items.map((item, index) => (
                            <tr
                              key={index}
                              className={`border-t border-gray-200 ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }`}
                            >
                              <td className="px-6 py-4">
                                {item.productName || `SP ${item.productId}`}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {item.quantity || 0}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {formatCurrency(item.unitPrice || 0)}
                              </td>
                              <td className="px-6 py-4 text-right font-medium">
                                {formatCurrency(item.total || 0)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              <div className="flex flex-col items-center">
                                <BsBoxSeam className="h-12 w-12 text-gray-400 mb-3" />
                                Không có chi tiết sản phẩm nào
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50 border-t-2 border-blue-100">
                          <td
                            colSpan="3"
                            className="px-6 pt-6 text-right font-semibold text-gray-800"
                          >
                            Tổng cộng:
                          </td>
                          <td className="px-6 pt-6 text-right font-bold text-blue-700 text-lg">
                            {formatCurrency(calculateTotalAmount())}
                          </td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td
                            colSpan="3"
                            className="px-6 py-2 text-right font-semibold text-gray-800"
                          >
                            Số tiền thanh toán (hóa đơn này):
                          </td>
                          <td className="px-6 py-2 text-right font-bold text-gray-600 text-lg">
                            {formatCurrency(calculatePaidAmountThisInvoice())}
                          </td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td
                            colSpan="3"
                            className="px-6 py-2 text-right font-semibold text-gray-800"
                          >
                            Tổng tiền đã thanh toán (đơn hàng):
                          </td>
                          <td className="px-6 py-2 text-right font-bold text-gray-600 text-lg">
                            {formatCurrency(calculateTotalPaidAmount())}
                          </td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td
                            colSpan="3"
                            className="px-6 py-2 text-right font-semibold text-gray-800"
                          >
                            Số tiền còn lại (đơn hàng):
                          </td>
                          <td className="px-6 py-2 text-right font-bold text-green-600 text-lg">
                            {formatCurrency(calculateRemainingAmount())}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;
