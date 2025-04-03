import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const InvoiceDetailModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;
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
  const calculateRemainingAmount = () => {
    const paid = parseFloat(invoice.paidAmount?.replace(/\./g, "") || 0);
    const total = invoice.totalAmount || 0;
    return Math.max(total - paid, 0);
  };

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
                    <p className="text-gray-800 font-medium">{invoice.id}</p>
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
                    <tfoot>
                      <tr className="bg-white border-t-2 border-gray-200">
                        <td
                          colSpan="3"
                          className="px-3 py-1 text-right font-semibold text-gray-800"
                        >
                          Tổng cộng:
                        </td>
                        <td className="px-3 py-1 text-right font-bold text-blue-600 text-lg">
                          3,050,000 VNĐ
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
