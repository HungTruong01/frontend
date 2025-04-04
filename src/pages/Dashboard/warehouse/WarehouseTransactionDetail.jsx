import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

const WarehouseTransactionDetail = () => {
  const { transactionId } = useParams();

  const transaction = {
    id: transactionId,
    quantity: 150,
    transactionDate: "2025-04-02T10:30:00.000Z",
    orderCode: "DH001",
    transactionType: "Nhập kho",
    warehouse: "Kho An Lão",
    items: [
      {
        id: 1,
        productCode: "P001",
        productName: "Sản phẩm A",
        quantity: 50,
        unit: "Cái",
        note: "Hàng mới",
      },
      {
        id: 2,
        productCode: "P002",
        productName: "Sản phẩm B",
        quantity: 100,
        unit: "Hộp",
        note: "Hàng trả lại",
      },
    ],
    createdBy: "Nguyễn Văn A",
    createdAt: "2025-04-01T10:30:00.000Z",
    status: "Hoàn thành",
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getTypeColor = (type) => {
    if (type === "Nhập kho") return "bg-green-100 text-green-800";
    if (type === "Xuất kho") return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/warehouse/warehouse-transaction"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết giao dịch kho
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Thông tin giao dịch
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">
                Loại giao dịch
              </p>
              <p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                    transaction.transactionType
                  )}`}
                >
                  {transaction.transactionType}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">
                Ngày giao dịch
              </p>
              <p className="text-gray-800">
                {formatDate(transaction.transactionDate)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Kho bãi</p>
              <p className="text-gray-800">{transaction.warehouse}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Đơn hàng</p>
              <p className="text-gray-800">
                <Link
                  to={`/orders/${transaction.orderCode}`}
                  className="text-blue-600 hover:underline"
                >
                  {transaction.orderCode}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Chi tiết sản phẩm
          </h2>
          <p className="text-gray-600 font-medium">
            Tổng số lượng:{" "}
            <span className="font-bold">{transaction.quantity}</span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-6 text-left font-semibold">STT</th>
                <th className="py-3 px-6 text-left font-semibold">
                  Mã sản phẩm
                </th>
                <th className="py-3 px-6 text-left font-semibold">
                  Tên sản phẩm
                </th>
                <th className="py-3 px-6 text-right font-semibold">Số lượng</th>
                <th className="py-3 px-6 text-left font-semibold">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              {transaction.items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item.productCode}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-800">
                    {item.productName}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 text-right font-semibold">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">
                  Tổng số lượng:
                </span>
                <span className="font-semibold text-gray-800">
                  {transaction.quantity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseTransactionDetail;
