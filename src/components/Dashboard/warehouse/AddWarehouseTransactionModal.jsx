import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllOrders, getOrderById } from "@/api/orderApi";
import { getAllDeliveryStatus } from "@/api/deliveryStatusApi";
import { getAllWarehouse } from "@/api/warehouseApi";
import { getAllWarehouseTransactionType } from "@/api/warehouseTransactionTypeApi";
import { createWarehouseTransaction } from "@/api/warehouseTransactionApi";
import { getProductById } from "@/api/productApi";

const AddWarehouseTransactionModal = ({ isOpen, onClose, onSubmit }) => {
  const [transactionData, setTransactionData] = useState({
    orderId: "",
    statusId: "",
    transactionTypeId: "",
    warehouseId: "",
  });
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, statusRes, typeRes, warehouseRes] = await Promise.all([
          getAllOrders(0, 100, "id", "asc"),
          getAllDeliveryStatus(),
          getAllWarehouseTransactionType(),
          getAllWarehouse(),
        ]);
        setOrders(orderRes.content || orderRes || []);
        setStatuses(statusRes.content || statusRes || []);
        setTransactionTypes(typeRes.content || typeRes || []);
        setWarehouses(warehouseRes.content || warehouseRes || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tùy chọn:", error);
        toast.error("Không thể tải dữ liệu tùy chọn");
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!transactionData.orderId) {
        setOrderProducts([]);
        return;
      }

      try {
        setLoadingProducts(true);
        const orderDetails = await getOrderById(transactionData.orderId);

        if (
          orderDetails &&
          orderDetails.orderDetails &&
          orderDetails.orderDetails.length > 0
        ) {
          const productPromises = orderDetails.orderDetails.map(
            async (detail) => {
              try {
                const product = await getProductById(detail.productId);
                return {
                  id: detail.id,
                  productId: detail.productId,
                  productCode: product?.code || detail.productId,
                  productName: product?.name || "Không xác định",
                  quantity: detail.quantity,
                  unit: product?.unit || "Cái",
                };
              } catch (err) {
                console.error(
                  `Lỗi khi lấy thông tin sản phẩm ID ${detail.productId}:`,
                  err
                );
                return {
                  id: detail.id,
                  productId: detail.productId,
                  productCode: detail.productId,
                  productName: "Không thể tải thông tin",
                  quantity: detail.quantity,
                  unit: "Cái",
                };
              }
            }
          );

          const products = await Promise.all(productPromises);
          setOrderProducts(products);
        } else {
          setOrderProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        toast.error("Không thể tải chi tiết đơn hàng");
        setOrderProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchOrderDetails();
  }, [transactionData.orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !transactionData.orderId ||
      !transactionData.statusId ||
      !transactionData.transactionTypeId ||
      !transactionData.warehouseId
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    try {
      setLoading(true);
      const submittedData = {
        orderId: parseInt(transactionData.orderId),
        statusId: parseInt(transactionData.statusId),
        transactionTypeId: parseInt(transactionData.transactionTypeId),
        warehouseId: parseInt(transactionData.warehouseId),
        // Đã loại bỏ trường items
      };
      await createWarehouseTransaction(submittedData);
      await onSubmit(submittedData);
      setTransactionData({
        orderId: "",
        statusId: "",
        transactionTypeId: "",
        warehouseId: "",
      });
      toast.success("Thêm giao dịch kho thành công");
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm giao dịch kho:", error);
      toast.error("Có lỗi xảy ra khi thêm giao dịch kho");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  const totalQuantity = orderProducts.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Thêm giao dịch kho mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã đơn hàng
              </label>
              <select
                name="orderId"
                value={transactionData.orderId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Chọn đơn hàng</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.code || `Đơn hàng ${order.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kho
              </label>
              <select
                name="warehouseId"
                value={transactionData.warehouseId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Chọn kho</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name || `Kho ${warehouse.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="statusId"
                value={transactionData.statusId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Chọn trạng thái</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name || `Trạng thái ${status.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại giao dịch
              </label>
              <select
                name="transactionTypeId"
                value={transactionData.transactionTypeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Chọn loại giao dịch</option>
                {transactionTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name || `Loại ${type.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {transactionData.orderId && (
            <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Chi tiết sản phẩm từ đơn hàng
              </h3>

              {loadingProducts ? (
                <div className="text-center py-4 text-gray-500">
                  Đang tải thông tin sản phẩm...
                </div>
              ) : orderProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="py-3 px-4 text-left font-semibold">
                          STT
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Mã sản phẩm
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Tên sản phẩm
                        </th>
                        <th className="py-3 px-4 text-right font-semibold">
                          Số lượng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderProducts.map((product, index) => (
                        <tr
                          key={product.id || index}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {product.productCode}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">
                            {product.productName}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 text-right font-semibold">
                            {product.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td
                          colSpan="3"
                          className="py-3 px-4 text-right font-medium"
                        >
                          Tổng số lượng:
                        </td>
                        <td className="py-3 px-4 text-right font-bold">
                          {totalQuantity}
                        </td>
                        <td className="py-3 px-4"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {transactionData.orderId
                    ? "Không có sản phẩm nào trong đơn hàng này"
                    : "Vui lòng chọn đơn hàng để xem chi tiết sản phẩm"}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading || loadingProducts}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWarehouseTransactionModal;
