import React, { useState, useEffect, useCallback, useMemo } from "react";
import { partnerApi } from "@/api/partnerApi";
import { getAllInvoiceTypes } from "@/api/invoiceTypeApi";
import { getProductById } from "@/api/productApi";
import { createInvoice } from "@/api/invoiceApi";
import { getOrdersByPartnerId, getOrderById } from "@/api/orderApi";
import { BsBoxSeam } from "react-icons/bs";
import { FaUser, FaTimes, FaInfoCircle } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

const AddInvoiceModal = ({
  isOpen,
  onClose,
  onSubmit,
  preselectedOrderData,
}) => {
  const [formData, setFormData] = useState({
    partnerId: "",
    invoiceTypeId: "",
    totalAmount: "",
    paidAmount: "",
    invoiceDetails: [{ orderId: "", amount: "" }],
    paymentType: "",
  });
  const [partners, setPartners] = useState([]);
  const [invoiceTypes, setInvoiceTypes] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderPaidAmount, setOrderPaidAmount] = useState(0);
  const [error, setError] = useState(null);

  // Debounce fetchOrdersByPartner
  const debouncedFetchOrders = useCallback(
    debounce(async (partnerId) => {
      if (!partnerId) {
        setFilteredOrders([]);
        setOrdersLoading(false);
        return;
      }
      setOrdersLoading(true);
      try {
        const ordersData = await getOrdersByPartnerId(partnerId);
        setFilteredOrders(ordersData.content || []);
      } catch (err) {
        setError("Không thể tải danh sách đơn hàng của đối tác.");
        console.error(err);
        setFilteredOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (isOpen && preselectedOrderData) {
      setFormData({
        partnerId: preselectedOrderData.partnerId.toString() || "",
        invoiceTypeId: "",
        totalAmount: preselectedOrderData.totalMoney.toString() || "",
        paidAmount: "",
        invoiceDetails: [
          { orderId: preselectedOrderData.id.toString() || "", amount: "" },
        ],
        paymentType: "",
      });
      setFilteredOrders([preselectedOrderData]);
      setOrderPaidAmount(preselectedOrderData.paidMoney || 0);
    } else if (isOpen) {
      setFormData({
        partnerId: "",
        invoiceTypeId: "",
        totalAmount: "",
        paidAmount: "",
        invoiceDetails: [{ orderId: "", amount: "" }],
        paymentType: "",
      });
      setFilteredOrders([]);
      setSelectedOrderDetails([]);
      setOrderPaidAmount(0);
    }
  }, [isOpen, preselectedOrderData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [partnersData, invoiceTypesData] = await Promise.all([
          partnerApi.getAllPartners(0, 100, "id", "asc"),
          getAllInvoiceTypes(),
        ]);
        setPartners(partnersData.content || []);
        setInvoiceTypes(invoiceTypesData.content || []);
      } catch (err) {
        setError("Không thể tải dữ liệu từ server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    const partnerId = parseInt(formData.partnerId, 10);
    debouncedFetchOrders(partnerId);
    return () => debouncedFetchOrders.cancel();
  }, [formData.partnerId, debouncedFetchOrders]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const selectedOrderId = parseInt(formData.invoiceDetails[0]?.orderId, 10);
      if (!selectedOrderId) {
        setSelectedOrderDetails([]);
        setFormData((prev) => ({ ...prev, totalAmount: "" }));
        setOrderPaidAmount(0);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        const orderData = await getOrderById(selectedOrderId);
        if (!orderData || !orderData.orderDetails?.length) {
          setError(
            `Không tìm thấy chi tiết đơn hàng cho orderId ${selectedOrderId}`
          );
          setSelectedOrderDetails([]);
          setFormData((prev) => ({ ...prev, totalAmount: "" }));
          setOrderPaidAmount(0);
          return;
        }

        setOrderPaidAmount(orderData.paidMoney || 0);
        const details = orderData.orderDetails;
        const detailedItems = await Promise.all(
          details.map(async (detail, index) => {
            try {
              const product = await getProductById(detail.productId);
              return {
                id: index + 1,
                productName: product?.name || `SP ${detail.productId}`,
                quantity: detail.quantity || 0,
                unitPrice: product?.exportPrice || 0,
                total: (detail.quantity || 0) * (product?.exportPrice || 0),
              };
            } catch (err) {
              console.error("Lỗi lấy sản phẩm:", detail.productId, err);
              return {
                id: index + 1,
                productName: `SP ${detail.productId}`,
                quantity: detail.quantity || 0,
                unitPrice: detail.exportPrice || 0,
                total: (detail.quantity || 0) * (detail.exportPrice || 0),
              };
            }
          })
        );

        setSelectedOrderDetails(detailedItems);
        const total = detailedItems.reduce((sum, item) => sum + item.total, 0);
        setFormData((prev) => ({ ...prev, totalAmount: total.toString() }));
      } catch (err) {
        setError("Không thể tải chi tiết đơn hàng.");
        console.error(err);
        setSelectedOrderDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [formData.invoiceDetails[0]?.orderId]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "paidAmount") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "partnerId" && {
          invoiceDetails: [{ orderId: "", amount: "" }],
        }),
      }));
    }
  }, []);

  const handleDetailChange = useCallback(
    (index, field, value) => {
      const newDetails = [...formData.invoiceDetails];
      newDetails[index] = { ...newDetails[index], [field]: value };
      setFormData((prev) => ({ ...prev, invoiceDetails: newDetails }));
    },
    [formData.invoiceDetails]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paidAmount = formData.paidAmount
        ? parseFloat(formData.paidAmount.replace(/\./g, ""))
        : 0;

      const submitData = {
        invoiceTypeId: parseInt(formData.invoiceTypeId) || null,
        moneyAmount: paidAmount,
        orderId: parseInt(formData.invoiceDetails[0]?.orderId) || null,
        paymentType: formData.paymentType || null,
      };

      if (!submitData.invoiceTypeId) {
        toast.error("Vui lòng chọn loại hóa đơn");
        setLoading(false);
        return;
      }

      if (!submitData.orderId) {
        toast.error("Vui lòng chọn đơn hàng");
        setLoading(false);
        return;
      }

      if (!submitData.moneyAmount) {
        toast.error("Vui lòng nhập số tiền");
        setLoading(false);
        return;
      }

      if (!submitData.paymentType) {
        setError("Vui lòng chọn hình thức thanh toán");
        setLoading(false);
        return;
      }

      const remainingAmount = calculateRemainingAmount;
      if (submitData.moneyAmount > remainingAmount) {
        toast.error("Số tiền thanh toán không được vượt quá số tiền còn lại");
        setLoading(false);
        return;
      }

      const response = await createInvoice(submitData);
      onSubmit(response);
      onClose();
    } catch (err) {
      toast.error("Lỗi khi tạo hóa đơn: " + err.message);
      console.error("Error creating invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingAmount = useMemo(() => {
    const total = parseFloat(formData.totalAmount) || 0;
    return Math.max(total - orderPaidAmount, 0);
  }, [formData.totalAmount, orderPaidAmount]);

  const calculateTotalWithNewPayment = useMemo(() => {
    const paid = parseFloat(formData.paidAmount?.replace(/\./g, "")) || 0;
    return orderPaidAmount + paid;
  }, [formData.paidAmount, orderPaidAmount]);

  const calculateNewRemainingAmount = useMemo(() => {
    const total = parseFloat(formData.totalAmount) || 0;
    const paidWithNew = calculateTotalWithNewPayment;
    return Math.max(total - paidWithNew, 0);
  }, [formData.totalAmount, calculateTotalWithNewPayment]);

  // Memoize partner and order options
  const partnerOptions = useMemo(
    () =>
      partners.map((partner) => (
        <option key={partner.id} value={partner.id}>
          {partner.name}
        </option>
      )),
    [partners]
  );

  const orderOptions = useMemo(
    () =>
      filteredOrders.map((order) => (
        <option key={order.id} value={order.id}>
          {order.code || `DH${order.id}`}
        </option>
      )),
    [filteredOrders]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl transform transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-blue-100 bg-blue-500 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Thêm hóa đơn mới</h2>
              <p className="text-blue-100 text-sm mt-1">
                Nhập thông tin hóa đơn
              </p>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 transition-colors duration-200 focus:outline-none p-3 rounded-full"
              aria-label="Đóng"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto">
          {loading && (
            <div className="mb-4 py-2 px-4 bg-blue-50 text-blue-700 rounded-lg flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Đang xử lý...
            </div>
          )}

          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                <FaInfoCircle className="h-5 w-5 mr-2 text-blue-600" />
                Thông tin chung
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đối tác <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="partnerId"
                    value={formData.partnerId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                    required
                  >
                    <option value="">Chọn đối tác</option>
                    {partnerOptions}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại hóa đơn <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="invoiceTypeId"
                    value={formData.invoiceTypeId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                    required
                  >
                    <option value="">Chọn loại hóa đơn</option>
                    {invoiceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="orderId"
                    value={formData.invoiceDetails[0]?.orderId || ""}
                    onChange={(e) =>
                      handleDetailChange(0, "orderId", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      !formData.partnerId || ordersLoading
                        ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-white border-gray-300 hover:border-blue-300"
                    }`}
                    required
                    disabled={!formData.partnerId || ordersLoading}
                  >
                    <option value="">
                      {ordersLoading ? "Đang tải..." : "Chọn mã đơn hàng"}
                    </option>
                    {orderOptions}
                  </select>
                  {!formData.partnerId && (
                    <p className="text-xs text-blue-600 mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Vui lòng chọn đối tác trước
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình thức thanh toán <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                    required
                  >
                    <option value="">Chọn hình thức</option>
                    <option value="Tiền mặt">Tiền mặt</option>
                    <option value="Chuyển khoản">Chuyển khoản</option>
                  </select>
                </div>
              </div>
            </div>

            {formData.partnerId && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                  <FaUser className="h-4 w-4 text-blue-600 mr-2" />
                  Thông tin đối tác
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500 block mb-1">
                      Tên đối tác
                    </span>
                    <p className="font-medium text-gray-800">
                      {partners.find(
                        (p) => p.id === parseInt(formData.partnerId)
                      )?.name || "Chưa chọn"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500 block mb-1">
                      Số điện thoại
                    </span>
                    <p className="font-medium text-gray-800">
                      {partners.find(
                        (p) => p.id === parseInt(formData.partnerId)
                      )?.phone || "Chưa chọn"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500 block mb-1">
                      Email
                    </span>
                    <p className="font-medium text-gray-800">
                      {partners.find(
                        (p) => p.id === parseInt(formData.partnerId)
                      )?.email || "Chưa chọn"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500 block mb-1">
                      Địa chỉ
                    </span>
                    <p className="font-medium text-gray-800">
                      {partners.find(
                        (p) => p.id === parseInt(formData.partnerId)
                      )?.address || "Chưa chọn"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                <FaGift className="h-4 w-4 text-blue-600 mr-2" />
                Chi tiết đơn hàng
              </h3>
              <div className="overflow-x-auto bg-gray-50 rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">
                        Số lượng
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">
                        Đơn giá
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderDetails.length > 0 ? (
                      selectedOrderDetails.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={`border-t border-gray-200 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4">{item.productName}</td>
                          <td className="px-6 py-4 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.unitPrice.toLocaleString()} VNĐ
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            {item.total.toLocaleString()} VNĐ
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          {formData.partnerId &&
                          !formData.invoiceDetails[0]?.orderId ? (
                            <div className="flex flex-col items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400 mb-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                              Vui lòng chọn đơn hàng
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <BsBoxSeam className="h-12 w-12 text-gray-400 mb-3" />
                              Chưa có chi tiết đơn hàng
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50 border-t-2 border-blue-100">
                      <td
                        colSpan="3"
                        className="px-6 pt-6 text-right font-semibold text-gray-800"
                      >
                        Tổng cộng:
                      </td>
                      <td className="px-6 pt-6 text-right font-bold text-blue-700 text-lg">
                        {parseFloat(formData.totalAmount || 0).toLocaleString()}{" "}
                        VNĐ
                      </td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td
                        colSpan="3"
                        className="px-6 py-2 text-right font-semibold text-gray-800"
                      >
                        Tổng tiền đã thanh toán (đơn hàng):
                      </td>
                      <td className="px-6 py-2 text-right font-bold text-gray-700 text-lg">
                        {orderPaidAmount.toLocaleString()} VNĐ
                      </td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td
                        colSpan="3"
                        className="px-6 py-2 text-right font-semibold text-gray-800"
                      >
                        Tổng tiền còn lại:
                      </td>
                      <td className="px-6 py-2 text-right font-bold text-green-600 text-lg">
                        {calculateRemainingAmount.toLocaleString()} VNĐ
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td
                        colSpan="3"
                        className="px-3 text-right font-semibold text-gray-800"
                      >
                        Số tiền trả (hóa đơn này):
                      </td>
                      <td className="px-2 py-1 text-right font-bold">
                        <input
                          type="text"
                          name="paidAmount"
                          value={formData.paidAmount}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-200 rounded-lg text-black text-right bg-white"
                          placeholder="Nhập số tiền trả (VNĐ)"
                        />
                      </td>
                    </tr>
                    {formData.paidAmount && (
                      <>
                        <tr className="bg-white">
                          <td
                            colSpan="3"
                            className="px-3 py-1 text-right font-semibold text-gray-800"
                          >
                            Tổng tiền đã thanh toán (sau khi thêm):
                          </td>
                          <td className="px-3 py-1 text-right font-bold text-gray-600 text-lg">
                            {calculateTotalWithNewPayment.toLocaleString()} VNĐ
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td
                            colSpan="3"
                            className="px-3 py-1 text-right font-semibold text-gray-800"
                          >
                            Số tiền còn lại (sau khi thêm):
                          </td>
                          <td className="px-3 py-1 text-right font-bold text-green-600 text-lg">
                            {calculateNewRemainingAmount.toLocaleString()} VNĐ
                          </td>
                        </tr>
                      </>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none cursor-pointer transition-colors duration-200 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AddInvoiceModal);
