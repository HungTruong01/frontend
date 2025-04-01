import React from "react";
import { FaTimes } from "react-icons/fa";

const InvoiceDetailModal = ({ isOpen, onClose, invoice }) => {
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
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Thông tin chung
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Đối tác
                    </label>
                    <p className="text-gray-800 font-medium">
                      {invoice.partnerName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Loại hóa đơn
                    </label>
                    <p className="text-gray-800 font-medium">
                      {invoice.invoiceTypeId === 1
                        ? "Hóa đơn bán"
                        : "Hóa đơn mua"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Ngày lập
                    </label>
                    <p className="text-gray-800 font-medium">{invoice.date}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Tổng tiền
                    </label>
                    <p className=" font-medium text-blue-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(invoice.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Chi tiết hoá đơn
                </h3>
                <div className="space-y-4">
                  {invoice.invoiceDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 hover:border-blue-300 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Đơn hàng #{index + 1}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Mã đơn hàng
                          </label>
                          <p className="text-gray-800 font-medium">
                            {detail.orderCode}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Số tiền
                          </label>
                          <p className="text-blue-600 font-medium ">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(detail.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột phải - Tổng kết */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Tổng kết
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Tổng số đơn hàng</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {invoice.invoiceDetails.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(invoice.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loại hóa đơn</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {invoice.invoiceTypeId === 1
                        ? "Hóa đơn bán"
                        : "Hóa đơn mua"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
