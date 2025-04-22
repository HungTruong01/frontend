import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllOrders, getOrderById } from "@/api/orderApi";
import { getAllDeliveryStatus } from "@/api/deliveryStatusApi";
import { getAllWarehouse } from "@/api/warehouseApi";
import { getAllWarehouseTransactionType } from "@/api/warehouseTransactionTypeApi";
import {
  createWarehouseTransaction,
  updateWarehouseTransaction,
} from "@/api/warehouseTransactionApi";
import { getProductById } from "@/api/productApi";

const ToggleWarehouseTransaction = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
}) => {
  const isEdit = mode === "edit";

  const [transactionData, setTransactionData] = useState({
    id: "",
    orderId: "",
    statusId: "",
    transactionTypeId: "",
    warehouseId: "",
  });
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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
        setOrders(orderRes.content || []);
        setStatuses(statusRes.content || []);
        setTransactionTypes(typeRes.content || []);
        setWarehouses(warehouseRes.content || []);
      } catch (error) {
        toast.error("Không thể tải dữ liệu tùy chọn");
        console.error("Lỗi khi lấy dữ liệu tùy chọn:", error);
      }
    };

    if (isOpen) {
      fetchData();
      if (isEdit && initialData) {
        setTransactionData({
          id: initialData.id,
          orderId: initialData.orderId,
          statusId: initialData.statusId,
          transactionTypeId: initialData.transactionTypeId,
          warehouseId: initialData.warehouseId,
        });
      } else {
        setTransactionData({
          id: "",
          orderId: "",
          statusId: "",
          transactionTypeId: "",
          warehouseId: "",
        });
      }
    }
  }, [isOpen, initialData, isEdit]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!transactionData.orderId) {
        setOrderProducts([]);
        return;
      }

      try {
        setLoadingProducts(true);
        const orderDetails = await getOrderById(transactionData.orderId);
        const products = await Promise.all(
          (orderDetails.orderDetails || []).map(async (detail) => {
            try {
              const product = await getProductById(detail.productId);
              return {
                id: detail.id,
                productId: detail.productId,
                productCode: product?.code || detail.productId,
                productName: product?.name || "Không xác định",
                quantity: detail.quantity,
              };
            } catch {
              return {
                id: detail.id,
                productId: detail.productId,
                productCode: detail.productId,
                productName: "Không thể tải thông tin",
                quantity: detail.quantity,
              };
            }
          })
        );
        setOrderProducts(products);
      } catch (err) {
        toast.error("Không thể tải chi tiết đơn hàng");
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
        setOrderProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchOrderDetails();
  }, [transactionData.orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({ ...prev, [name]: value }));
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

    const payload = {
      orderId: parseInt(transactionData.orderId),
      statusId: parseInt(transactionData.statusId),
      transactionTypeId: parseInt(transactionData.transactionTypeId),
      warehouseId: parseInt(transactionData.warehouseId),
    };

    try {
      setLoading(true);
      if (isEdit) {
        await updateWarehouseTransaction(transactionData.id, payload);
      } else {
        await createWarehouseTransaction(payload);
      }
      await onSubmit(payload);
      toast.success(isEdit ? "Cập nhật thành công" : "Thêm thành công");
      onClose();
    } catch (err) {
      toast.error(isEdit ? "Cập nhật thất bại" : "Thêm thất bại");
      console.error("Lỗi khi gửi dữ liệu:", err);
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
            {isEdit ? "Sửa" : "Thêm"} giao dịch kho
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {[
              {
                name: "orderId",
                label: "Mã đơn hàng",
                options: orders,
                getLabel: (order) => order.code || `DH${order.id}`,
              },
              {
                name: "warehouseId",
                label: "Kho",
                options: warehouses,
                getLabel: (w) => w.name || `Kho ${w.id}`,
              },
              {
                name: "statusId",
                label: "Trạng thái",
                options: statuses,
                getLabel: (s) => s.name || `Trạng thái ${s.id}`,
              },
              {
                name: "transactionTypeId",
                label: "Loại giao dịch",
                options: transactionTypes,
                getLabel: (t) => t.name || `Loại ${t.id}`,
              },
            ].map(({ name, label, options, getLabel }) => (
              <div key={name} className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <select
                  name={name}
                  value={transactionData[name]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn {label.toLowerCase()}</option>
                  {options.map((item) => (
                    <option key={item.id} value={item.id}>
                      {getLabel(item)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {transactionData.orderId && (
            <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Chi tiết sản phẩm từ đơn hàng
              </h3>
              {loadingProducts ? (
                <div className="text-center text-gray-500 py-4">
                  Đang tải thông tin sản phẩm...
                </div>
              ) : orderProducts.length > 0 ? (
                <table className="w-full min-w-max">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-3 px-4 text-left">STT</th>
                      <th className="py-3 px-4 text-left">Mã sản phẩm</th>
                      <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                      <th className="py-3 px-4 text-right">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderProducts.map((p, i) => (
                      <tr key={p.id || i} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{i + 1}</td>
                        <td className="py-3 px-4">{p.productCode}</td>
                        <td className="py-3 px-4 font-medium">
                          {p.productName}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {p.quantity}
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
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Không có sản phẩm nào trong đơn hàng này
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

export default ToggleWarehouseTransaction;
