import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchOrders,
  fetchOrderTypes,
  fetchOrderStatus,
} from "@/redux/slices/orderSlice";
import { fetchPartners } from "@/redux/slices/partnerSlice";
import { fetchProducts } from "@/redux/slices/productSlice";
import { fetchWarehouseTransactions } from "@/redux/slices/warehouseTransactionSlice";
import { fetchDeliveryStatuses } from "@/redux/slices/deliveryStatusSlice";
import { FaEye, FaEdit, FaPlus, FaFileExport, FaSort } from "react-icons/fa";
import OrderDetailModal from "@/components/Dashboard/order/OrderDetailModal";
import { getOrderById } from "@/api/orderApi";
import { exportExcel } from "@/utils/exportExcel";
import { Pagination } from "@/utils/pagination";
import { toast } from "react-toastify";
import { formatCurrency, formatDate } from "@/utils/formatter";

const ListOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, orderTypes, orderStatus, loading } = useSelector(
    (state) => state.order
  );
  const { products } = useSelector((state) => state.product);
  const { partners } = useSelector((state) => state.partner);
  const { warehouseTransactions } = useSelector(
    (state) => state.warehouseTransaction
  );
  const { deliveryStatuses } = useSelector((state) => state.deliveryStatus);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchOrderTypes());
    dispatch(fetchOrderStatus());
    dispatch(fetchProducts());
    dispatch(fetchPartners());
    dispatch(fetchWarehouseTransactions());
    dispatch(fetchDeliveryStatuses());
  }, [dispatch]);

  const getOrderTypeName = (orderTypeId) => {
    const type = orderTypes.find((type) => type.id === orderTypeId);
    return type ? type.name : "Không có thông tin";
  };

  const getOrderStatusName = (orderStatusId) => {
    const status = orderStatus.find((status) => status.id === orderStatusId);
    return status ? status.name : "Không có thông tin";
  };

  const getPartnerName = (partnerId) => {
    const partner = partners.find((partner) => partner.id === partnerId);
    return partner ? partner.name : "Không có thông tin";
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

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.toString().includes(searchQuery) ||
        getPartnerName(order.partnerId)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesType =
        searchType === "" || order.orderTypeId === parseInt(searchType);
      const matchesStatus =
        searchStatus === "" || order.orderStatusId === parseInt(searchStatus);

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortConfig.key === "createdAt") {
        return sortConfig.direction === "asc"
          ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
          : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
      }

      if (
        sortConfig.key === "totalMoney" ||
        sortConfig.key === "paidMoney" ||
        sortConfig.key === "profitMoney"
      ) {
        return sortConfig.direction === "asc"
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }

      return sortConfig.direction === "asc"
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      toast.error("Không thể tải chi tiết đơn hàng. Vui lòng thử lại!");
    }
  };

  const handleEditOrder = (order) => {
    navigate(`/dashboard/business/order-management/edit/${order.id}`);
  };

  const handleOrderUpdated = () => {
    dispatch(fetchOrders());
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

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen w-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
              {orderTypes.map((type) => (
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
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/7 cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Mã</span>
                      <FaSort />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/7 cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Ngày tạo</span>
                      <FaSort />
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
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-700 w-1/7 cursor-pointer"
                    onClick={() => handleSort("totalMoney")}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Tổng tiền</span>
                      <FaSort />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 w-1/7 cursor-pointer">
                    <div className="flex items-center justify-end space-x-1">
                      <span>Đã trả</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-700 w-1/7 cursor-pointer"
                    onClick={() => handleSort("profitMoney")}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Lợi nhuận</span>
                      <FaSort />
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
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(order.profitMoney)}
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

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị{" "}
            {filteredOrders.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{" "}
            đến {Math.min(currentPage * itemsPerPage, filteredOrders.length)}{" "}
            của {filteredOrders.length} bản ghi
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxPagesToShow={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ListOrder;
