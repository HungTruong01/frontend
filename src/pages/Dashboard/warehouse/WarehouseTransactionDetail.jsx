import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getWarehouseTransactionById } from "@/api/warehouseTransactionApi";
import { getOrderById } from "@/api/orderApi";
import { getDeliveryStatusById } from "@/api/deliveryStatusApi";
import { getWarehouseById } from "@/api/warehouseApi";
import { getWarehouseTransactionTypeById } from "@/api/warehouseTransactionTypeApi";
import { getProductById } from "@/api/productApi";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/formatter";

const getTypeColor = (type) => {
  if (!type) return "bg-gray-100 text-gray-800";
  const typeLower = String(type).toLowerCase();
  if (typeLower.includes("nhập")) return "bg-green-100 text-green-800";
  if (typeLower.includes("xuất")) return "bg-orange-100 text-orange-800";
  return "bg-gray-100 text-gray-800";
};

const WarehouseTransactionDetail = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapOrderDetailsToItems = async (orderDetails) => {
    return await Promise.all(
      orderDetails.map(async (detail) => {
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
  };

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!transactionId) {
        setError("ID giao dịch không hợp lệ");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const transactionData = await getWarehouseTransactionById(
          transactionId
        );
        if (!transactionData)
          throw new Error("Không tìm thấy dữ liệu giao dịch");

        const [warehouse, order, status, type] = await Promise.all([
          getWarehouseById(transactionData.warehouseId),
          getOrderById(transactionData.orderId),
          getDeliveryStatusById(transactionData.statusId),
          getWarehouseTransactionTypeById(transactionData.transactionTypeId),
        ]);

        let items = transactionData.items || [];
        if (order?.orderDetails?.length > 0 && items.length === 0) {
          items = await mapOrderDetailsToItems(order.orderDetails);
        }

        setTransaction({
          ...transactionData,
          warehouseName: warehouse?.name || "Kho không rõ",
          orderCode: order?.code || `DH${transactionData.orderId || ""}`,
          statusName: status?.name || "Trạng thái không rõ",
          transactionTypeName: type?.name || "Loại không rõ",
          items,
        });
      } catch (err) {
        console.error("Lỗi khi tải chi tiết giao dịch:", err);
        setError(err.message || "Không thể tải thông tin giao dịch kho");
        toast.error("Không thể tải thông tin giao dịch kho");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactionDetails();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen w-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded mt-6">{error}</div>
    );
  }

  const items = transaction.items || [];
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/warehouse/warehouse-transaction"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-3"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết giao dịch kho #{transaction.id}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Mã giao dịch</p>
              <p className="text-gray-800">{transaction.id || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">
                Loại giao dịch
              </p>
              <p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                    transaction.transactionTypeName
                  )}`}
                >
                  {transaction.transactionTypeName ||
                    `Loại ${transaction.transactionTypeId || "N/A"}`}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Ngày tạo</p>
              <p className="text-gray-800">
                {formatDate(transaction.createdAt)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Kho bãi</p>
              <p className="text-gray-800">
                {transaction.warehouseName ||
                  `Kho ${transaction.warehouseId || "N/A"}`}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Đơn hàng</p>
              <p className="text-gray-800">
                {transaction.orderId ? (
                  <Link
                    to={`/dashboard/orders/detail/${transaction.orderId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {transaction.orderCode ||
                      `Đơn hàng #${transaction.orderId}`}
                  </Link>
                ) : (
                  "N/A"
                )}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Trạng thái</p>
              <p className="text-gray-800">
                {transaction.statusName ||
                  `Trạng thái ${transaction.statusId || "N/A"}`}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Kế toán</p>
              <p className="text-gray-800">{transaction.accountant || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Thủ kho</p>
              <p className="text-gray-800">
                {transaction.storekeeper || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">
                Người lập phiếu
              </p>
              <p className="text-gray-800">{transaction.createdBy || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">
                Người giao/nhận hàng
              </p>
              <p className="text-gray-800">
                {transaction.participant || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Chi tiết đơn hàng
          </h2>
          <p className="text-gray-600 font-medium">
            Tổng số lượng: <span className="font-bold">{totalQuantity}</span>
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
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {item.productId || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-800">
                      {item.productName || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 text-right font-semibold">
                      {item.quantity || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    Không có dữ liệu sản phẩm trong giao dịch này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {items.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">
                    Tổng số lượng:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {totalQuantity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseTransactionDetail;
