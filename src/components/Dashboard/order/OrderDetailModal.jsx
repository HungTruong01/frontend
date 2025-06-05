import React, { useEffect, useState } from "react";
import { FaTimes, FaFileInvoiceDollar, FaUser, FaBox } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchInvoiceTypes } from "@/redux/slices/invoiceTypeSlice";
import { useNavigate } from "react-router-dom";

const OrderDetailModal = ({ isOpen, onClose, orderData, onOrderUpdated }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderType = useSelector((state) => state.order.orderTypes);
  const orderStatus = useSelector((state) => state.order.orderStatus);
  const { list: invoiceType } = useSelector((state) => state.invoiceTypes);
  const partners = useSelector((state) => state.partner.partners);
  const products = useSelector((state) => state.product.products);

  const [remainingAmount, setRemainingAmount] = useState(0);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    if (invoiceType.length === 0) {
      dispatch(fetchInvoiceTypes());
    }
  }, [dispatch, invoiceType.length]);

  useEffect(() => {
    if (orderData?.orderDetails && products.length > 0) {
      const enhancedItems = orderData.orderDetails.map((detail) => {
        const product = products.find((p) => p.id === detail.productId);
        return {
          ...detail,
          productName: product?.name || "Không xác định",
          unitPrice: detail?.unit_price || 0,
          expireDate: detail?.expireDate,
        };
      });
      setOrderItems(enhancedItems);
    }
  }, [orderData, products]);

  useEffect(() => {
    if (orderData) {
      const remaining = orderData.totalMoney - orderData.paidMoney;
      setRemainingAmount(remaining);
    }
  }, [orderData]);

  if (!isOpen || !orderData) return null;

  const getPartnerField = (partnerId, field) => {
    const partner = partners.find((p) => p.id === partnerId);
    return partner ? partner[field] : "Không xác định";
  };

  const getOrderTypeName = (orderTypeId) => {
    const type = orderType.find((t) => t.id === orderTypeId);
    return type ? type.name : "Không xác định";
  };

  const getOrderStatusName = (orderStatusId) => {
    const status = orderStatus.find((s) => s.id === orderStatusId);
    return status ? status.name : "Không xác định";
  };

  const isOrderCompleted = () => {
    return getOrderStatusName(orderData.orderStatusId) === "Đã thanh toán";
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN").format(value);

  const formatDate = (dateString) => {
    if (!dateString) return "Ngày không hợp lệ";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDefaultInvoiceTypeId = () => {
    const orderTypeName = getOrderTypeName(orderData.orderTypeId);
    if (orderTypeName === "Đơn mua") {
      const found = invoiceType.find((type) => type.name === "Phiếu chi");
      return found?.id;
    } else if (orderTypeName === "Đơn bán") {
      const found = invoiceType.find((type) => type.name === "Phiếu thu");
      return found?.id;
    }
    return "";
  };

  const handleCreateInvoice = () => {
    const defaultInvoiceTypeId = getDefaultInvoiceTypeId();

    navigate("/dashboard/business/invoice/add", {
      state: {
        preselectedOrderData: {
          ...orderData,
          partnerId: orderData.partnerId,
          id: orderData.id,
          totalMoney: orderData.totalMoney,
          paidMoney: orderData.paidMoney,
          orderTypeName: getOrderTypeName(orderData.orderTypeId), // Add order type name
        },
        defaultInvoiceTypeId,
      },
    });
    onClose();
  };

  const isPurchaseOrder = () => {
    return getOrderTypeName(orderData.orderTypeId) === "Đơn mua";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8 pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng #{orderData.id}
            </h2>
            <p className="text-gray-500 mt-1">
              Ngày tạo: {formatDate(orderData.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                getOrderStatusName(orderData.orderStatusId) === "Hoàn thành"
                  ? "bg-green-100 text-green-800"
                  : getOrderStatusName(orderData.orderStatusId) ===
                    "Chờ thanh toán"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {getOrderStatusName(orderData.orderStatusId)}
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
                  <span className="font-medium">
                    {getOrderTypeName(orderData.orderTypeId)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trạng thái thanh toán:</span>
                  <span
                    className={`font-medium ${
                      orderData.paidMoney >= orderData.totalMoney
                        ? "text-green-600"
                        : orderData.paidMoney > 0
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {orderData.paidMoney >= orderData.totalMoney
                      ? "Đã thanh toán"
                      : orderData.paidMoney > 0
                      ? "Thanh toán một phần"
                      : "Chưa thanh toán"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đã thanh toán:</span>
                  <span className="font-medium">
                    {formatCurrency(orderData.paidMoney)} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Còn lại:</span>
                  <span className="font-medium">
                    {formatCurrency(orderData.totalMoney - orderData.paidMoney)}
                    VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-800 font-medium">Tổng tiền:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(orderData.totalMoney)} VNĐ
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
                  <p className="font-medium">
                    {getPartnerField(orderData.partnerId, "name")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Số điện thoại:</span>
                  <p className="font-medium">
                    {getPartnerField(orderData.partnerId, "phone")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">
                    {getPartnerField(orderData.partnerId, "email")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Địa chỉ:</span>
                  <p className="font-medium">
                    {getPartnerField(orderData.partnerId, "address")}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                    {isPurchaseOrder() && (
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                        Ngày hết hạn
                      </th>
                    )}
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.length > 0 ? (
                    orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">{item.productName}</td>
                        <td className="px-4 py-3 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        {isPurchaseOrder() && (
                          <td className="px-4 py-3 text-right">
                            {formatDate(item.expireDate)}
                          </td>
                        )}
                        <td className="px-4 py-3 text-right">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={isPurchaseOrder() ? "5" : "4"}
                        className="text-center py-4 text-gray-500"
                      >
                        Không có thông tin sản phẩm
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-white border-t-2 border-gray-200">
                    <td
                      colSpan={isPurchaseOrder() ? "4" : "3"}
                      className="px-4 py-3 text-right font-semibold text-gray-800"
                    >
                      Tổng cộng:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg">
                      {formatCurrency(orderData.totalMoney)} VNĐ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreateInvoice}
              disabled={isOrderCompleted()}
              className={`px-6 py-2 rounded-md font-medium ${
                isOrderCompleted()
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              } text-white`}
            >
              Lập hoá đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
