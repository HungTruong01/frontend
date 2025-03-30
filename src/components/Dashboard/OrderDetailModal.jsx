import React, { useState } from "react";
import {
  FaTimes,
  FaFileInvoiceDollar,
  FaUser,
  FaBox,
  FaMoneyBillWave,
} from "react-icons/fa";

const OrderDetailModal = ({ isOpen, onClose, orderData }) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [remainingAmount, setRemainingAmount] = useState(0);

  if (!isOpen) return null;

  // Dữ liệu mẫu - sau này sẽ được thay thế bằng dữ liệu thực từ API
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
    status: "Chờ thanh toán",
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

  const handlePaymentChange = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setPaymentAmount(e.target.value);
    const remaining = mockOrderData.totalAmount - amount;
    setRemainingAmount(remaining);
  };

  const handlePaymentSubmit = () => {
    console.log("Thanh toán:", paymentAmount);
    if (remainingAmount <= 0) {
      mockOrderData.paymentStatus = "Đã thanh toán";
      mockOrderData.status = "Hoàn thành";
    } else {
      mockOrderData.paymentStatus = "Thanh toán một phần";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8 pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng #{mockOrderData.orderId}
            </h2>
            <p className="text-gray-500 mt-1">
              Ngày tạo: {mockOrderData.orderDate}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                mockOrderData.status === "Hoàn thành"
                  ? "bg-green-100 text-green-800"
                  : mockOrderData.status === "Chờ thanh toán"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {mockOrderData.status}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <FaFileInvoiceDollar className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Thông tin đơn hàng
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Loại đơn hàng:</span>
                  <span className="font-medium">{mockOrderData.orderType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trạng thái thanh toán:</span>
                  <span
                    className={`font-medium ${
                      mockOrderData.paymentStatus === "Đã thanh toán"
                        ? "text-green-600"
                        : mockOrderData.paymentStatus === "Thanh toán một phần"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {mockOrderData.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-800 font-medium">Tổng tiền:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {mockOrderData.totalAmount.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <FaUser className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Thông tin đối tác
                </h3>
              </div>
              <div className="space-y-3">
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
                  <p className="font-medium">{mockOrderData.partner.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <FaBox className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Danh sách sản phẩm
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
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        {item.unitPrice.toLocaleString()} VNĐ
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {item.total.toLocaleString()} VNĐ
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-white border-t-2 border-gray-200">
                    <td
                      colSpan="3"
                      className="px-4 py-3 text-right font-semibold text-gray-800"
                    >
                      Tổng cộng:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg">
                      {mockOrderData.totalAmount.toLocaleString()} VNĐ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Phần thanh toán */}
          {mockOrderData.paymentStatus !== "Đã thanh toán" && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <FaMoneyBillWave className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Thanh toán
                </h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số tiền thanh toán
                    </label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập số tiền thanh toán"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số tiền còn lại
                    </label>
                    <div
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                        remainingAmount > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {remainingAmount.toLocaleString()} VNĐ
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={!paymentAmount || paymentAmount <= 0}
                    className={`px-6 py-2 rounded-md font-medium ${
                      !paymentAmount || paymentAmount <= 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Xác nhận thanh toán
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
