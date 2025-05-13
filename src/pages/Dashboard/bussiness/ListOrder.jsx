import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegTrashAlt,
  FaEye,
  FaEdit,
  FaPlus,
  FaFileExport,
} from "react-icons/fa";
import OrderDetailModal from "@/components/Dashboard/order/OrderDetailModal";
import { getAllOrders, getOrderById } from "@/api/orderApi";
import { getAllOrderTypes } from "@/api/orderTypeApi";
import { getAllOrderStatus } from "@/api/orderStatusApi";
import { getAllWarehouseTransaction } from "@/api/warehouseTransactionApi";
import { getAllDeliveryStatus } from "@/api/deliveryStatusApi";
import { partnerApi } from "@/api/partnerApi";
import { exportExcel } from "@/utils/exportExcel";

const ListOrder = () => {
  const navigate = useNavigate();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [partners, setPartners] = useState([]);
  const [warehouseTransactions, setWarehouseTransactions] = useState([]);
  const [deliveryStatuses, setDeliveryStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders(0, 100, "id", "asc");
      setOrders(response.content);
    } catch (error) {
      console.log("Error fetching orders", error);
      setOrders([]);
    }
  };

  const fetchOrderTypes = async () => {
    try {
      const response = await getAllOrderTypes();
      setOrderType(response.content);
    } catch (error) {
      console.log("Error fetching order types", error);
      setOrderType([]);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await getAllOrderStatus();
      setOrderStatus(response.content);
    } catch (error) {
      console.log("Error fetching order status", error);
      setOrderStatus([]);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await partnerApi.getAllPartners(0, 100, "id", "asc");
      setPartners(response.content);
    } catch (error) {
      console.log("Error fetching partners: ", error);
      setPartners([]);
    }
  };

  const fetchWarehouseTransactions = async () => {
    try {
      const response = await getAllWarehouseTransaction(0, 1000, "id", "asc");
      setWarehouseTransactions(response.content);
    } catch (error) {
      console.log("Error fetching warehouse transactions: ", error);
      setWarehouseTransactions([]);
    }
  };

  const fetchDeliveryStatuses = async () => {
    try {
      const response = await getAllDeliveryStatus();
      setDeliveryStatuses(response.content || []);
    } catch (error) {
      console.log("Error fetching delivery statuses: ", error);
      setDeliveryStatuses([]);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchOrders(),
        fetchOrderTypes(),
        fetchOrderStatus(),
        fetchPartners(),
        fetchWarehouseTransactions(),
        fetchDeliveryStatuses(),
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const filteredOrders = orders
    ? orders.filter((order) => {
        const matchStatus =
          searchStatus === "" || order.orderStatusId === parseInt(searchStatus);
        const matchType =
          searchType === "" || order.orderTypeId === parseInt(searchType);
        const matchQuery =
          searchQuery === "" ||
          order.id
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (
            partners.find((partner) => partner.id === order.partnerId)?.name ||
            ""
          )
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchStatus && matchType && matchQuery;
      })
    : [];

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

  const handleExportExcel = () => {
    const exportData = filteredOrders.map((order) => ({
      STT: order.id,
      "Ngày tạo": formatDate(order.createdAt),
      "Đối tác": getPartnerName(order.partnerId),
      "Loại đơn": getOrderTypeName(order.orderTypeId),
      "Tổng tiền": formatCurrency(order.totalMoney),
      "Đã trả": formatCurrency(order.paidMoney),
      "Trạng thái": getOrderStatusName(order.orderStatusId),
    }));
    exportExcel({
      data: exportData,
      fileName: "Danh sách đơn hàng",
      sheetName: "Đơn hàng",
      autoWidth: true,
      zebraPattern: true,
    });
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
      default:
        return "bg-gray-400 text-gray-100";
    }
  };

  const handleAddClick = () => {
    navigate("/dashboard/business/order-management/create");
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

  const handleOrderUpdated = () => {
    fetchOrders();
  };

  const isOrderEditable = (order) => {
    const relatedTransaction = warehouseTransactions.find(
      (tran) => tran.orderId === order.id
    );

    if (!relatedTransaction) {
      return true;
    }

    const transactionStatus = relatedTransaction.statusId;
    const status = deliveryStatuses.find(
      (status) => status.id === transactionStatus
    );
    if (!status || !status.name) {
      return true;
    }

    const statusName = status.name.toLowerCase();
    const isNonEditable =
      statusName.includes("hoàn thành") || statusName.includes("xử lý");
    return !isNonEditable;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-semibold text-gray-600">
            Đang tải dữ liệu...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        orderData={selectedOrder}
        onOrderUpdated={handleOrderUpdated}
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách đơn hàng
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExportExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FaFileExport className="h-5 w-5 mr-2" />
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
              Tìm kiếm
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập mã đơn hoặc tên đối tác"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
                <option key={status.id} value={status.id}>
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
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Không có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/7">
                    <div className="flex items-center space-x-1">
                      <span>Mã</span>
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
                        {isOrderEditable(order) ? (
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Sửa"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="text-gray-400 cursor-not-allowed"
                            title="Đơn hàng không thể chỉnh sửa do trạng thái giao dịch kho"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 && (
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
                {Array.from({ length: 3 }, (_, idx) => {
                  let startPage = Math.max(1, currentPage - 1);
                  if (currentPage === totalPages)
                    startPage = Math.max(1, totalPages - 2);
                  if (totalPages <= 3) startPage = 1;

                  const page = startPage + idx;
                  if (page > totalPages) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-md text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOrder;
