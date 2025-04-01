// src/components/Dashboard/invoice/AddInvoiceModal.jsx
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const AddInvoiceModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    partnerId: "",
    invoiceTypeId: "",
    totalAmount: "",
    invoiceDetails: [{ orderId: "", amount: "" }],
  });

  const partners = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Phạm Tiến Mạnh" },
    { id: 3, name: "Nguyễn Trung Đức" },
  ];

  const orders = [
    { id: 1, code: "DH001", totalAmount: "1.000.000" },
    { id: 2, code: "DH002", totalAmount: "2.000.000" },
    { id: 3, code: "DH003", totalAmount: "3.000.000" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.invoiceDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData((prev) => ({ ...prev, invoiceDetails: newDetails }));
  };

  const addDetail = () => {
    setFormData((prev) => ({
      ...prev,
      invoiceDetails: [...prev.invoiceDetails, { orderId: "", amount: "" }],
    }));
  };

  const removeDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      invoiceDetails: prev.invoiceDetails.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Thêm hóa đơn mới
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Nhập thông tin hóa đơn
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

        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols gap-8">
            <div className="col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Thông tin chung
                  </h3>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                     duration-200 text-sm flex items-center shadow-md hover:shadow-lg"
                  >
                    <span className="mr-1">+</span> Thêm đối tác
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đối tác <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="partnerId"
                        value={formData.partnerId}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
                        required
                      >
                        <option value="">Chọn đối tác</option>
                        {partners.map((partner) => (
                          <option key={partner.id} value={partner.id}>
                            {partner.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại hóa đơn <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="invoiceTypeId"
                      value={formData.invoiceTypeId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
                      required
                    >
                      <option value="">Chọn loại hóa đơn</option>
                      <option value="1">Hóa đơn bán</option>
                      <option value="2">Hóa đơn mua</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tổng tiền <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={handleChange}
                        className="w-full pl-3 pr-8 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Nhập tổng tiền"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Chi tiết hoá đơn
                  </h3>
                  <button
                    type="button"
                    onClick={addDetail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center shadow-md hover:shadow-lg"
                  >
                    <span className="mr-1">+</span> Thêm đơn hàng
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.invoiceDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 hover:border-blue-300 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Đơn hàng #{index + 1}
                        </h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeDetail(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-full"
                          >
                            <FaTimes className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đơn hàng <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={detail.orderId}
                            onChange={(e) =>
                              handleDetailChange(
                                index,
                                "orderId",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
                            required
                          >
                            <option value="">Chọn đơn hàng</option>
                            {orders.map((order) => (
                              <option key={order.id} value={order.id}>
                                {order.code} - {order.totalAmount} VNĐ
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số tiền <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={detail.amount}
                              onChange={(e) =>
                                handleDetailChange(
                                  index,
                                  "amount",
                                  e.target.value
                                )
                              }
                              className="w-full pl-3 pr-8 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                              placeholder="Nhập số tiền"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Thêm mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInvoiceModal;
