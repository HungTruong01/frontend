import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import { getAllOrders, getOrderById } from "@/api/orderApi";
import { getAllDeliveryStatus } from "@/api/deliveryStatusApi";
import { getAllWarehouse } from "@/api/warehouseApi";
import { getAllWarehouseTransactionType } from "@/api/warehouseTransactionTypeApi";
import { getAllEmployees } from "@/api/employeeApi";
import {
  createWarehouseTransaction,
  updateWarehouseTransaction,
  getAllWarehouseTransaction,
} from "@/api/warehouseTransactionApi";
import { getProductById } from "@/api/productApi";
import { getPartnerById } from "@/api/partnerApi";

const ToggleWarehouseTransaction = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
}) => {
  const isEdit = mode === "edit";
  const initData = {
    id: "",
    orderId: "",
    statusId: "",
    transactionTypeId: "",
    warehouseId: "",
    accountant: "",
    storekeeper: "",
    createdBy: "",
    participant: "",
  };
  const [transactionData, setTransactionData] = useState(initData);

  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [partner, setPartner] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isInbound, setIsInbound] = useState(false);
  const [displayTransactionType, setDisplayTransactionType] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const [
          orderRes,
          statusRes,
          typeRes,
          warehouseRes,
          employeeRes,
          transactionRes,
        ] = await Promise.all([
          getAllOrders(0, 100, "id", "asc"),
          getAllDeliveryStatus(0, 100, "id", "asc"),
          getAllWarehouseTransactionType(0, 100, "id", "asc"),
          getAllWarehouse(0, 100, "id", "asc"),
          getAllEmployees(0, 100, "id", "asc"),
          getAllWarehouseTransaction(0, 100, "id", "asc"),
        ]);

        const usedOrderIds = transactionRes.content.map((tran) => tran.orderId);
        let filteredOrders = orderRes.content.filter((order) => {
          const status = statusRes.data.content.find(
            (s) => s.id === order.statusId
          );
          const isCompleted = status?.name
            ?.toLowerCase()
            .includes("hoàn thành");
          return !usedOrderIds.includes(order.id) && !isCompleted;
        });

        if (isEdit && initialData?.orderId) {
          const currentOrder = orderRes.content.find(
            (o) => o.id === parseInt(initialData.orderId)
          );
          if (
            currentOrder &&
            !filteredOrders.some((o) => o.id === currentOrder.id)
          ) {
            filteredOrders = [currentOrder, ...filteredOrders];
          }
        }

        const filteredStatuses = isEdit
          ? statusRes.data.content
          : statusRes.data.content.filter(
              (s) => !s.name?.toLowerCase().includes("không thành công")
            );

        setOrders(filteredOrders);
        setStatuses(filteredStatuses);
        setTransactionTypes(typeRes.content || []);
        setWarehouses(warehouseRes.content || []);
        setEmployees(employeeRes.data.content || []);
      } catch {
        toast.error("Không thể tải dữ liệu tùy chọn");
      }
    };

    fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (!isEdit || !initialData || transactionTypes.length === 0) return;

    setTransactionData({
      id: initialData.id || "",
      orderId: initialData.orderId || "",
      statusId: initialData.statusId || "",
      transactionTypeId: initialData.transactionTypeId || "",
      warehouseId: initialData.warehouseId || "",
      accountant: initialData.accountant || "",
      storekeeper: initialData.storekeeper || "",
      createdBy: initialData.createdBy || "",
      participant: initialData.participant || "",
    });

    const type = transactionTypes.find(
      (t) => t.id === parseInt(initialData.transactionTypeId)
    );
    setIsInbound(type?.code === "IMPORT" || type?.name?.includes("Nhập"));
    setDisplayTransactionType(type?.name || "");
  }, [isEdit, initialData, transactionTypes]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!transactionData.orderId) {
        setOrderProducts([]);
        setPartner("");
        resetTransactionDetails();
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

        let orderPartner = "Không xác định";
        if (orderDetails.partnerId) {
          const partnerData = await getPartnerById(orderDetails.partnerId);
          orderPartner = partnerData?.name || "Không xác định";
        }
        setPartner(orderPartner);

        const selectedOrder = orders.find(
          (o) => o.id === parseInt(transactionData.orderId)
        );
        let newIsInbound = false;
        let newTransactionTypeId = "";
        let newDisplayTransactionType = "";

        if (selectedOrder) {
          const matchedType = getTransactionTypeByOrder(
            selectedOrder.orderTypeId
          );
          if (matchedType) {
            newIsInbound = matchedType.code === "IMPORT";
            newTransactionTypeId = matchedType.id;
            newDisplayTransactionType = matchedType.name;
          } else {
            newDisplayTransactionType =
              selectedOrder.orderTypeId === 1
                ? "Nhập kho (không tìm thấy loại)"
                : "Xuất kho (không tìm thấy loại)";
          }
        }

        setTransactionData((prev) => ({
          ...prev,
          transactionTypeId: newTransactionTypeId,
          participant: newIsInbound ? prev.participant : orderPartner,
        }));
        setIsInbound(newIsInbound);
        setDisplayTransactionType(newDisplayTransactionType);
      } catch {
        toast.error("Không thể tải chi tiết đơn hàng hoặc đối tác");
        setOrderProducts([]);
        setPartner("");
        setTransactionData((prev) => ({
          ...prev,
          transactionTypeId: "",
          participant: "",
        }));
        setIsInbound(false);
        setDisplayTransactionType("");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchOrderDetails();
  }, [transactionData.orderId, orders, transactionTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({ ...prev, [name]: value }));
  };

  const resetTransactionDetails = () => {
    setTransactionData((prev) => ({
      ...prev,
      transactionTypeId: "",
      participant: "",
    }));
    setIsInbound(false);
    setDisplayTransactionType("");
  };

  const getTransactionTypeByOrder = (orderTypeId) => {
    return transactionTypes.find((type) =>
      orderTypeId === 1
        ? type.code === "IMPORT" || type.name?.includes("Nhập")
        : type.code === "EXPORT" || type.name?.includes("Xuất")
    );
  };

  const isValidForm = (data) => {
    const requiredFields = [
      "orderId",
      "statusId",
      "transactionTypeId",
      "warehouseId",
      "accountant",
      "storekeeper",
      "createdBy",
      "participant",
    ];
    return requiredFields.every((field) => data[field]?.toString().trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidForm(transactionData)) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }
    if (
      !transactionData.participant ||
      transactionData.participant.trim() === ""
    ) {
      toast.error("Vui lòng nhập hoặc chọn người giao/nhận hàng");
      return;
    }

    const payload = {
      orderId: parseInt(transactionData.orderId),
      statusId: parseInt(transactionData.statusId),
      transactionTypeId: parseInt(transactionData.transactionTypeId),
      warehouseId: parseInt(transactionData.warehouseId),
      accountant: transactionData.accountant,
      storekeeper: transactionData.storekeeper,
      createdBy: transactionData.createdBy,
      participant: transactionData.participant.trim(),
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
      const errorMessage =
        err.response?.data || (isEdit ? "Cập nhật thất bại" : "Thêm thất bại");
      toast.error(errorMessage);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl shadow-xl mx-4 my-6">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-3 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Sửa" : "Thêm"} giao dịch kho
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã đơn hàng <span className="text-red-500">*</span>
              </label>
              <select
                name="orderId"
                value={transactionData.orderId}
                onChange={handleChange}
                required
                disabled={isEdit}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  isEdit ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Chọn mã đơn hàng</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.code || `DH${order.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kho <span className="text-red-500">*</span>
              </label>
              <select
                name="warehouseId"
                value={transactionData.warehouseId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Chọn kho</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name || `Kho ${warehouse.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại giao dịch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={displayTransactionType}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Chọn đơn hàng để hiển thị loại giao dịch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                name="statusId"
                value={transactionData.statusId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Chọn trạng thái</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name || `Trạng thái ${status.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">
              Thông tin nhân sự liên quan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kế toán
                </label>
                <select
                  name="accountant"
                  value={transactionData.accountant}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Chọn kế toán</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.fullname}>
                      {employee.fullname || `Nhân viên ${employee.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thủ kho
                </label>
                <select
                  name="storekeeper"
                  value={transactionData.storekeeper}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Chọn thủ kho</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.fullname}>
                      {employee.fullname || `Nhân viên ${employee.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Người lập phiếu
                </label>
                <select
                  name="createdBy"
                  value={transactionData.createdBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Chọn người lập phiếu</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.fullname}>
                      {employee.fullname || `Nhân viên ${employee.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {isInbound ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Người giao hàng
                    </label>
                    <input
                      type="text"
                      name="participant"
                      value={transactionData.participant}
                      onChange={handleChange}
                      placeholder="Nhập tên người giao hàng"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Người nhận hàng
                    </label>
                    <input
                      type="text"
                      name="participant"
                      value={transactionData.participant}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {transactionData.orderId && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">
                Chi tiết sản phẩm từ đơn hàng
              </h3>
              {loadingProducts ? (
                <div className="text-center text-gray-500 py-4">
                  <BiLoaderAlt className="inline-block animate-spin h-5 w-5 mr-2" />
                  Đang tải thông tin sản phẩm...
                </div>
              ) : orderProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="py-2 px-3 text-left font-medium">STT</th>
                        <th className="py-2 px-3 text-center font-medium">
                          Mã sản phẩm
                        </th>
                        <th className="py-2 px-3 text-left font-medium">
                          Tên sản phẩm
                        </th>
                        <th className="py-2 px-3 text-right font-medium">
                          Số lượng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderProducts.map((p, i) => (
                        <tr
                          key={p.id || i}
                          className="hover:bg-gray-50 border-t border-gray-100"
                        >
                          <td className="py-2 px-3 text-sm">{i + 1}</td>
                          <td className="py-2 px-3 text-center text-sm">
                            {p.productCode}
                          </td>
                          <td className="py-2 px-3 text-sm font-medium">
                            {p.productName}
                          </td>
                          <td className="py-2 px-3 text-sm text-right font-semibold">
                            {p.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 border-t border-gray-200">
                        <td
                          colSpan="3"
                          className="py-2 px-3 text-right font-medium text-sm"
                        >
                          Tổng số lượng:
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-sm">
                          {totalQuantity}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4 text-sm">
                  Không có sản phẩm nào trong đơn hàng này
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              disabled={loading || loadingProducts}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToggleWarehouseTransaction;
