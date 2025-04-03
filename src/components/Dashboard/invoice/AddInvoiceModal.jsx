import React, { useState } from "react";
import { FaTimes, FaBox } from "react-icons/fa";

const AddInvoiceModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    partnerId: "",
    invoiceTypeId: "",
    totalAmount: "",
    paidAmount: "",
    invoiceDetails: [{ orderId: "", amount: "" }],
  });
  const mockOrderData = {
    orderId: "001",
    orderDate: "25-03-2025",
    partner: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
      email: "nguyenvana@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      type: "customer",
    },
    orderType: "Đơn hàng nhập",
    status: "Chưa thanh toán",
    items: [
      {
        id: 1,
        productName: "Sản phẩm A",
        quantity: 10,
        unitPrice: 180000,
        total: 1800000,
      },
      {
        id: 2,
        productName: "Sản phẩm B",
        quantity: 5,
        unitPrice: 250000,
        total: 1250000,
      },
    ],
    totalAmount: 3050000,
    paymentStatus: "Chưa thanh toán",
    paidAmount: 0,
  };

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
    // Chỉ cho phép nhập số và định dạng với dấu chấm
    if (name === "paidAmount") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  // Tính số tiền còn lại
  const calculateRemainingAmount = () => {
    const paid = parseFloat(formData.paidAmount.replace(/\./g, "")) || 0;
    const total = mockOrderData.totalAmount;
    return Math.max(total - paid, 0);
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center shadow-md hover:shadow-lg"
                  >
                    <span className="mr-1">+</span> Thêm đối tác
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
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
                      Loại hóa đơn
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
                      Mã đơn hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="partnerId"
                        value={formData.partnerId}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
                        required
                      >
                        <option value="">Chọn mã đơn hàng</option>
                        {orders.map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Thông tin đối tác
                  </h3>
                </div>
                <div className="grid grid-cols-3 space-y-3">
                  <div>
                    <span className="text-gray-600">Tên đối tác:</span>
                    <p className="font-medium">{mockOrderData.partner.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Số điện thoại:</span>
                    <p className="font-medium">{mockOrderData.partner.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{mockOrderData.partner.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Địa chỉ:</span>
                    <p className="font-medium">
                      {mockOrderData.partner.address}
                    </p>
                  </div>
                </div>
              </div>
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
                      {mockOrderData.items.map((item) => (
                        <tr key={item.id} className="border-t border-gray-200">
                          <td className="px-4 py-3">{item.productName}</td>
                          <td className="px-4 py-3 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {item.unitPrice.toLocaleString()} VNĐ
                          </td>
                          <td className="px-4 py-3 text-right font historic">
                            {item.total.toLocaleString()} VNĐ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="">
                      <tr className="bg-white border-t-2 border-gray-200">
                        <td
                          colSpan="3"
                          className="px-3 pt-6 text-right font-semibold text-gray-800"
                        >
                          Tổng cộng:
                        </td>
                        <td className="px-3 pt-6 text-right font-bold text-blue-600 text-lg">
                          {mockOrderData.totalAmount.toLocaleString()} VNĐ
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td
                          colSpan="3"
                          className="px-3 text-right font-semibold text-gray-800"
                        >
                          Tổng tiền đã thanh toán:
                        </td>
                        <td className="px-3 py-1 text-right font-bold text-green-600 text-lg">
                          {calculateRemainingAmount().toLocaleString()} VNĐ
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td
                          colSpan="3"
                          className="px-3 text-right font-semibold text-gray-800"
                        >
                          Số tiền trả:
                        </td>
                        <td className="px-2 py-1 text-right font-bold">
                          <input
                            type="text"
                            name="paidAmount"
                            className="w-full p-2 border border-gray-200 rounded-lg text-black text-right bg-white"
                            placeholder="Nhập số tiền trả (VNĐ)"
                          />
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="mt-4 flex justify-end items-center">
                  <div className="flex items-center gap-12 px-2 "></div>
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
