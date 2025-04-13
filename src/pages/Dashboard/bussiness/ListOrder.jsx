import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import OrderDetailModal from "@/components/Dashboard/order/OrderDetailModal";
import { getAllOrders, getOrderById } from "@/api/orderApi";
import { getAllOrderTypes } from "@/api/orderTypeApi";
import { getAllOrderStatus } from "@/api/orderStatusApi";
import { partnerApi } from "@/api/partnerApi";

const ListOrder = () => {
  const navigate = useNavigate();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [partners, setPartners] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      console.log(response.content);
      setOrders(response.content);
    } catch (error) {
      console.log("Error fetching orders", error);
    }
  };

  const fetchOrderTypes = async () => {
    try {
      const response = await getAllOrderTypes();
      setOrderType(response.content);
    } catch (error) {
      console.log("Error fetching order types", error);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await getAllOrderStatus();
      setOrderStatus(response.content);
    } catch (error) {
      console.log("Error fetching order status", error);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await partnerApi.getAllPartners();
      setPartners(response.content);
    } catch (error) {
      console.log("Error fetching partners: ", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchOrderTypes();
    fetchOrderStatus();
    fetchPartners();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchStatus = searchStatus === "" || order.status === searchStatus;
    const matchType = searchType === "" || order.orderType === searchType;
    return matchStatus && matchType;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getOrderTypeName = (orderTypeId) => {
    const type = orderType.find((type) => type.id === orderTypeId);
    return type ? type.name : "Unknown";
  };

  const getOrderStatusName = (orderStatusId) => {
    const status = orderStatus.find((status) => status.id === orderStatusId);
    return status ? status.name : "Unknown";
  };

  const getPartnerName = (partnerId) => {
    const partner = partners.find((partner) => partner.id === partnerId);
    return partner ? partner.name : "Unknown";
  };

  const getPaymentStatusColor = (order) => {
    switch (order.orderStatusId) {
      case 1:
        return "bg-green-600 text-gray-100";
      case 2:
        return "bg-red-400 text-gray-100";
      case 3:
        return "bg-orange-400 text-gray-100";
    }
  };

  const handleAddClick = () => {
    navigate("/dashboard/bussiness/add-order");
  };

  const handleViewDetail = async (order) => {
    try {
      const response = await getOrderById(order.id);
      setSelectedOrder(response);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi xem chi tiết đơn hàng", error);
      alert("Không thể tải chi tiết đơn hàng. Vui lòng thử lại!");
    }
  };

  const formatCurrency = (amount) => {
    return `${new Intl.NumberFormat("vi-VN").format(amount)}`;
  };

  const handleEditOrder = (order) => {
    navigate(`/dashboard/business/order-management/edit/${order.id}`);
  };

  // Hàm để làm mới danh sách đơn hàng
  const handleOrderUpdated = () => {
    fetchOrders();
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        orderData={selectedOrder}
        onOrderUpdated={handleOrderUpdated} // Truyền callback
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách đơn hàng
          </h1>
          <div className="flex items-center space-x-4">
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
              {orderStatus.map((status) => (
                <option key={status.id} value={status.name}>
                  {status.name}
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
              {orderType.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/7">
                  <div className="flex items-center space-x-1">
                    <span>Mã đơn</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/7">
                  <div className="flex items-center space-x-1">
                    <span>Ngày tạo</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/5">
                  <div className="flex items-center space-x-1">
                    <span>Đối tác</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-1/7">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Loại đơn</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 w-1/7">
                  <div className="flex items-center justify-end space-x-1">
                    <span>Tổng tiền</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 w-1/7">
                  <div className="flex items-center justify-end space-x-1">
                    <span>Đã trả</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-1/7">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Trạng thái</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-1/7">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Hành động</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getPartnerName(order.partnerId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {getOrderTypeName(order.orderTypeId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(order.totalMoney)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(order.paidMoney)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                        order
                      )}`}
                    >
                      {getOrderStatusName(order.orderStatusId)}
                    </span>
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
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)} của{" "}
            {filteredOrders.length} bản ghi
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              Trước
            </button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOrder;
