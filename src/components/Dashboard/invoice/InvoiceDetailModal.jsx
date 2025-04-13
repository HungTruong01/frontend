import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { getInvoiceWithDetails } from "@/api/invoiceApi";

const InvoiceDetailModal = ({ isOpen, onClose, invoice }) => {
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoiceDetails = async () => {
    if (isOpen && invoice && invoice.id) {
      setLoading(true);
      setError(null);
      try {
        const data = await getInvoiceWithDetails(invoice.id);
        console.log("API Response:", JSON.stringify(data, null, 2)); // Debug dữ liệu
        setInvoiceDetails(data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", err);
        setError("Không thể tải chi tiết hóa đơn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInvoiceDetails();
  }, [isOpen, invoice]);

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

  const getInvoiceTypeName = (typeId) => {
    switch (typeId) {
      case 1:
        return "Hóa đơn bán";
      case 2:
        return "Hóa đơn mua";
      default:
        return "Không xác định";
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl transform transition-all max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Chi tiết hóa đơn
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Mã hóa đơn: {invoice.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none p-2 hover:bg-white/10 rounded-full"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {loading && <p className="text-gray-500">Đang tải dữ liệu...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && !invoiceDetails && (
            <p className="text-gray-500">Không có dữ liệu hóa đơn.</p>
          )}
          {invoiceDetails && (
            <div className="grid grid-cols gap-8">
              <div className="col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Thông tin chung
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Mã hóa đơn
                      </label>
                      <p className="text-gray-800 font-medium">
                        {invoiceDetails.id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Loại hóa đơn
                      </label>
                      <p className="text-gray-800 font-medium">
                        {getInvoiceTypeName(invoiceDetails.invoiceTypeId)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Ngày lập
                      </label>
                      <p className="text-gray-800 font-medium">
                        {formatDate(invoiceDetails.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {invoiceDetails.partner && (
                  <div className="border border-gray-200 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Thông tin đối tác
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Tên đối tác:</span>
                        <p className="font-medium">
                          {invoiceDetails.partner.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Số điện thoại:</span>
                        <p className="font-medium">
                          {invoiceDetails.partner.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium">
                          {invoiceDetails.partner.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Địa chỉ:</span>
                        <p className="font-medium">
                          {invoiceDetails.partner.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {invoiceDetails.order && (
                  <div className="border border-gray-200 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Chi tiết đơn hàng
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-white">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                              Sản phẩm
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                              Số lượng
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                              Đơn giá
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                              Thành tiền
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceDetails.order.items?.length > 0 ? (
                            invoiceDetails.order.items.map((item, index) => (
                              <tr
                                key={index}
                                className="border-t border-gray-200"
                              >
                                <td className="px-4 py-3">
                                  {item.productName ||
                                    `SP ${item.productId || index}`}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {item.quantity || 0}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {formatCurrency(item.unitPrice || 0)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {formatCurrency(
                                    item.total ||
                                      item.quantity * item.unitPrice ||
                                      0
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="px-4 py-3 text-center text-gray-500"
                              >
                                Không có chi tiết sản phẩm nào.
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="bg-white border-t-2 border-gray-200">
                            <td
                              colSpan="3"
                              className="px-3 py-3 text-right font-semibold text-gray-800"
                            >
                              Tổng cộng:
                            </td>
                            <td className="px-3 py-3 text-right font-bold text-blue-600 text-lg">
                              {formatCurrency(calculateTotalAmount())} VNĐ
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td
                              colSpan="3"
                              className="px-3 py-3 text-right font-semibold text-gray-800"
                            >
                              Số tiền thanh toán (hóa đơn này):
                            </td>
                            <td className="px-3 py-3 text-right font-bold text-gray-600 text-lg">
                              {formatCurrency(calculatePaidAmountThisInvoice())}{" "}
                              VNĐ
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td
                              colSpan="3"
                              className="px-3 py-3 text-right font-semibold text-gray-800"
                            >
                              Tổng tiền đã thanh toán (đơn hàng):
                            </td>
                            <td className="px-3 py-3 text-right font-bold text-gray-600 text-lg">
                              {formatCurrency(calculateTotalPaidAmount())} VNĐ
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td
                              colSpan="3"
                              className="px-3 py-3 text-right font-semibold text-gray-800"
                            >
                              Số tiền còn lại (đơn hàng):
                            </td>
                            <td className="px-3 py-3 text-right font-bold text-green-600 text-lg">
                              {formatCurrency(calculateRemainingAmount())} VNĐ
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer"
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
