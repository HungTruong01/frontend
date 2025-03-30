import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { FaRegTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import OrderDetailModal from "@/components/Dashboard/OrderDetailModal";

const ListOrder = () => {
  const navigate = useNavigate();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");

  const orders = [
    {
      id: "001",
      orderCode: "DH001",
      createdAt: "25-03-2025",
      totalAmount: 1800000,
      partner: "Nguyễn Văn A",
      status: "Hoàn thành",
      orderType: "Đơn hàng nhập",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "002",
      orderCode: "DH002",
      createdAt: "26-03-2025",
      totalAmount: 2000000,
      partner: "Nguyễn Văn B",
      status: "Chờ xác nhận",
      orderType: "Đơn hàng xuất",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "003",
      orderCode: "DH003",
      createdAt: "27-03-2025",
      totalAmount: 1500000,
      partner: "Nguyễn Văn C",
      status: "Chờ thanh toán",
      orderType: "Đơn hàng nhập",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "004",
      orderCode: "DH004",
      createdAt: "28-03-2025",
      totalAmount: 1100000,
      partner: "Nguyễn Văn D",
      status: "Đã hủy",
      orderType: "Đơn hàng xuất",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      id: "005",
      orderCode: "DH005",
      createdAt: "29-03-2025",
      totalAmount: 2500000,
      partner: "Nguyễn Văn E",
      status: "Hoàn thành",
      orderType: "Đơn hàng nhập",
      statusColor: "bg-green-100 text-green-800",
    },
  ];

  const orderStatuses = [
    "Hoàn thành",
    "Chờ xác nhận",
    "Chờ thanh toán",
    "Đã hủy",
  ];
  const orderTypes = ["Đơn hàng nhập", "Đơn hàng xuất"];

  const filteredOrders = orders.filter((order) => {
    const matchStatus = searchStatus === "" || order.status === searchStatus;
    const matchType = searchType === "" || order.orderType === searchType;
    return matchStatus && matchType;
  });

  // Hàm xử lý khi click nút thêm mới
  const handleAddClick = () => {
    navigate("/dashboard/bussiness/add-order");
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Hàm format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleEditOrder = (order) => {
    navigate("/dashboard/business/order-management/edit");
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Modal chi tiết đơn hàng */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        orderData={selectedOrder}
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách đơn hàng
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

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái đơn hàng
            </label>
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại đơn hàng
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              {orderTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/7">
                  <div className="flex items-center space-x-1">
                    <span>Mã đơn hàng</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/7">
                  <div className="flex items-center space-x-1">
                    <span>Ngày tạo đơn</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/7">
                  <div className="flex items-center justify-end space-x-1">
                    <span>Tổng tiền</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/5">
                  <div className="flex items-center space-x-1">
                    <span>Đối tác</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/7">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Trạng thái</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/7">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Loại đơn</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/7">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Hành động</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.partner}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {order.orderType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleViewDetail(order)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Xem chi tiết"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-green-500 hover:text-green-700 transition-colors"
                        title="Sửa"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
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
      </div>
    </div>
  );
};

export default ListOrder;
