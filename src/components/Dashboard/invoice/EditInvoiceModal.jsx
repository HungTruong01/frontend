import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const EditInvoiceModal = ({ isOpen, onClose, onSubmit, invoice }) => {
  const [formData, setFormData] = useState({
    id: "",
    totalAmount: "",
    date: "",
    partnerName: "",
    invoiceTypeId: 1,
    note: "",
    paidAmount: "",
    invoiceDetails: [],
    // Thêm thông tin đối tác để có thể chỉnh sửa
    partner: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
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

  useEffect(() => {
    if (invoice) {
      setFormData({
        id: invoice.id,
        totalAmount: invoice.totalAmount,
        date: invoice.date,
        partnerName: invoice.partnerName,
        invoiceTypeId: invoice.invoiceTypeId,
        note: invoice.note || "",
        paidAmount: invoice.paidAmount || "",
        invoiceDetails: invoice.invoiceDetails || [],
        // Khởi tạo thông tin đối tác từ mockOrderData khi modal mở
        partner: {
          name: mockOrderData.partner.name,
          phone: mockOrderData.partner.phone,
          email: mockOrderData.partner.email,
          address: mockOrderData.partner.address,
        },
      });
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  // Xử lý thay đổi thông tin đối tác
  const handlePartnerChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      partner: {
        ...prev.partner,
        [name]: value,
      },
    }));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.invoiceDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData((prev) => ({ ...prev, invoiceDetails: newDetails }));
  };

  const addDetail = () => {
    setFormData((prev) => ({
      ...prev,
      invoiceDetails: [...prev.invoiceDetails, { orderCode: "", amount: "" }],
    }));
  };

  const removeDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      invoiceDetails: prev.invoiceDetails.filter((_, i) => i !== index),
    }));
  };

  const calculateRemainingAmount = () => {
    const paid = parseFloat(formData.paidAmount.replace(/\./g, "")) || 0;
    const total = parseFloat(formData.totalAmount) || 0;
    return Math.max(total - paid, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl transform transition-all max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Sửa hóa đơn</h2>
              <p className="text-white/80 text-sm mt-1">
                Cập nhật thông tin hóa đơn
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
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã hóa đơn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
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
                      <option value={1}>Hóa đơn bán</option>
                      <option value={2}>Hóa đơn mua</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Phần thông tin đối tác đã được chuyển thành form có thể chỉnh sửa */}
              <div className="border border-gray-200 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Thông tin đối tác
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên đối tác <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.partner.name}
                      onChange={handlePartnerChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.partner.phone}
                      onChange={handlePartnerChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.partner.email}
                      onChange={handlePartnerChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.partner.address}
                      onChange={handlePartnerChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
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
                    <tfoot>
                      <tr className="bg-white border-t-2 border-gray-200">
                        <td
                          colSpan="3"
                          className="px-3 py-1 text-right font-semibold text-gray-800"
                        >
                          Tổng cộng:
                        </td>
                        <td className="px-3 py-1 text-right font-bold text-blue-600 text-lg">
                          {mockOrderData.totalAmount.toLocaleString()} VNĐ
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td
                          colSpan="3"
                          className="px-3 py-1 text-right font-semibold text-gray-800"
                        >
                          Tổng tiền đã thanh toán:
                        </td>
                        <td className="px-3 py-1 text-right font-bold text-green-600 text-lg">
                          {calculateRemainingAmount().toLocaleString()} VNĐ
                        </td>
                      </tr>
                    </tfoot>
                  </table>
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
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoiceModal;

