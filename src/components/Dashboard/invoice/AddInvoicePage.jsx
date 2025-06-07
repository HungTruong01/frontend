import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getProductById } from "@/api/productApi";
import { createInvoice } from "@/api/invoiceApi";
import { getOrdersByPartnerId, getOrderById } from "@/api/orderApi";
import { BsBoxSeam } from "react-icons/bs";
import { FaClipboardList, FaArrowLeft } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import { FaGift } from "react-icons/fa6";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import { fetchPartners } from "@/redux/slices/partnerSlice";
import { fetchInvoiceTypes } from "@/redux/slices/invoiceTypeSlice";

const AddInvoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const preselectedOrderData = location.state?.preselectedOrderData;
  const defaultInvoiceTypeId = location.state?.defaultInvoiceTypeId;

  const initialFormData = {
    partnerId: "",
    invoiceTypeId: "",
    totalAmount: "",
    paidAmount: "",
    invoiceDetails: [{ orderId: "", amount: "" }],
    paymentType: "",
  };

  const [formData, setFormData] = useState(() => {
    if (preselectedOrderData) {
      return {
        partnerId: preselectedOrderData.partnerId.toString() || "",
        invoiceTypeId: defaultInvoiceTypeId?.toString() || "",
        totalAmount: preselectedOrderData.totalMoney?.toString() || "",
        paidAmount: "",
        invoiceDetails: [
          {
            orderId: preselectedOrderData.id?.toString() || "",
            amount: preselectedOrderData.totalMoney?.toString() || "",
          },
        ],
        paymentType: "",
      };
    }
    return initialFormData;
  });
  const { partners } = useSelector((state) => state.partner);
  const { list: invoiceTypes } = useSelector((state) => state.invoiceTypes);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderPaidAmount, setOrderPaidAmount] = useState(0);

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
        toast.error("Không thể tải danh sách đơn hàng của đối tác.");
        console.error(err);
        setFilteredOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    setFormData(initialFormData);
    setFilteredOrders([]);
    setSelectedOrderDetails([]);
    setOrderPaidAmount(0);
  }, []);

  useEffect(() => {
    const partnerId = parseInt(formData.partnerId);
    debouncedFetchOrders(partnerId);
    return () => debouncedFetchOrders.cancel();
  }, [formData.partnerId, debouncedFetchOrders]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const selectedOrderId = parseInt(formData.invoiceDetails[0]?.orderId);
      if (!selectedOrderId) {
        setSelectedOrderDetails([]);
        setFormData((prev) => ({ ...prev, totalAmount: "" }));
        setOrderPaidAmount(0);
        return;
      }

      setLoading(true);
      try {
        const orderData = await getOrderById(selectedOrderId);
        if (!orderData || !orderData.orderDetails?.length) {
          toast.error(
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
                unitPrice: detail?.unit_price || 0,
                total: (detail.quantity || 0) * (detail?.unit_price || 0),
              };
            } catch (err) {
              console.error("Lỗi lấy sản phẩm:", detail.productId, err);
              return {
                id: index + 1,
                productName: `SP ${detail.productId}`,
                quantity: detail.quantity || 0,
                unitPrice: detail.unit_price || 0,
                total: (detail.quantity || 0) * (detail.unit_price || 0),
              };
            }
          })
        );

        setSelectedOrderDetails(detailedItems);
        const total = detailedItems.reduce((sum, item) => sum + item.total, 0);
        setFormData((prev) => ({ ...prev, totalAmount: total.toString() }));
      } catch (err) {
        toast.error("Không thể tải chi tiết đơn hàng.");
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
        toast.error("Vui lòng chọn hình thức thanh toán");
        setLoading(false);
        return;
      }

      const remainingAmount = calculateRemainingAmount();
      if (submitData.moneyAmount > remainingAmount) {
        toast.error("Số tiền thanh toán không được vượt quá số tiền còn lại");
        setLoading(false);
        return;
      }

      await createInvoice(submitData);
      toast.success("Lập hoá đơn thành công");

      setFormData(initialFormData);
      setSelectedOrderDetails([]);
      setFilteredOrders([]);
      setOrderPaidAmount(0);
      navigate("/dashboard/business/invoice-management");
    } catch (err) {
      toast.error("Lỗi khi tạo hóa đơn: " + err.message);
      console.error("Error creating invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingAmount = () => {
    const total = parseFloat(formData.totalAmount) || 0;
    return Math.max(total - orderPaidAmount, 0);
  };

  const calculateTotalWithNewPayment = useMemo(() => {
    const paid = parseFloat(formData.paidAmount?.replace(/\./g, "")) || 0;
    return orderPaidAmount + paid;
  }, [formData.paidAmount, orderPaidAmount]);

  const calculateNewRemainingAmount = useMemo(() => {
    const total = parseFloat(formData.totalAmount) || 0;
    const paidWithNew = calculateTotalWithNewPayment;
    return Math.max(total - paidWithNew, 0);
  }, [formData.totalAmount, calculateTotalWithNewPayment]);

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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchPartners()),
          dispatch(fetchInvoiceTypes()),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Không thể tải dữ liệu ban đầu");
      }
    };
    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    const loadPreselectedData = async () => {
      if (preselectedOrderData) {
        setLoading(true);
        try {
          const orderData = await getOrderById(preselectedOrderData.id);
          if (orderData) {
            const detailedItems = await Promise.all(
              orderData.orderDetails.map(async (detail, index) => {
                try {
                  const product = await getProductById(detail.productId);
                  return {
                    id: index + 1,
                    productName: product?.name || `SP ${detail.productId}`,
                    quantity: detail.quantity || 0,
                    unitPrice: detail?.unit_price || 0,
                    total: (detail.quantity || 0) * (detail.unit_price || 0),
                  };
                } catch (err) {
                  console.error("Lỗi lấy sản phẩm:", detail.productId, err);
                  return null;
                }
              })
            );

            setSelectedOrderDetails(detailedItems.filter(Boolean));
            setOrderPaidAmount(orderData.paidMoney || 0);
            setFilteredOrders([orderData]);

            // Set form data
            setFormData({
              partnerId: preselectedOrderData.partnerId.toString(),
              invoiceTypeId: defaultInvoiceTypeId?.toString() || "",
              totalAmount: orderData.totalMoney?.toString() || "",
              paidAmount: "",
              invoiceDetails: [
                {
                  orderId: orderData.id?.toString(),
                  amount: orderData.totalMoney?.toString(),
                },
              ],
              paymentType: "",
            });
          }
        } catch (error) {
          console.error("Error loading preselected data:", error);
          toast.error("Không thể tải thông tin đơn hàng");
        } finally {
          setLoading(false);
        }
      }
    };

    loadPreselectedData();
  }, [preselectedOrderData, defaultInvoiceTypeId]);

  useEffect(() => {
    if (preselectedOrderData) {
      let targetInvoiceType;
      if (preselectedOrderData.orderTypeName === "Đơn mua") {
        targetInvoiceType = invoiceTypes.find(
          (type) => type.name === "Phiếu chi"
        );
      } else if (preselectedOrderData.orderTypeName === "Đơn bán") {
        targetInvoiceType = invoiceTypes.find(
          (type) => type.name === "Phiếu thu"
        );
      }
      if (targetInvoiceType) {
        setFormData((prev) => ({
          ...prev,
          invoiceTypeId: targetInvoiceType.id.toString(),
        }));
      }
    }
  }, [preselectedOrderData, invoiceTypes]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-8">
        {/* Cột trái: Form nhập thông tin */}
        <div className="flex-1 min-w-[320px]">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/dashboard/business/invoice-management")}
              className="flex items-center text-gray-600 hover:text-blue-700 mr-4 mb-2"
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Thêm hóa đơn mới</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đối tác <span className="text-red-500">*</span>
              </label>
              <select
                name="partnerId"
                value={formData.partnerId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:border-blue-300"
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  preselectedOrderData
                    ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                    : "bg-white hover:border-blue-300"
                }`}
                required
                disabled={preselectedOrderData}
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !formData.partnerId
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
                  <IoInformationCircle className="h-4 w-4 mr-1" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:border-blue-300"
                required
              >
                <option value="">Chọn hình thức</option>
                <option value="CASH">Tiền mặt</option>
                <option value="TRANSFER">Chuyển khoản</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền trả (hóa đơn này){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-right"
                placeholder="Nhập số tiền trả (VNĐ)"
                required
              />
            </div>
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard/business/invoice-management")
                }
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg focus:outline-none hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-colors shadow-md font-semibold"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
        {/* Cột phải: Chi tiết đơn hàng và tổng tiền */}
        <div className="flex-1 min-w-[320px] bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-inner">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaGift className="h-5 w-5 text-blue-500" /> Chi tiết đơn hàng
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                  <th className="px-4 py-2 text-left font-semibold">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-2 text-right font-semibold">
                    Số lượng
                  </th>
                  <th className="px-4 py-2 text-right font-semibold">
                    Đơn giá
                  </th>
                  <th className="px-4 py-2 text-right font-semibold">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedOrderDetails.length > 0 ? (
                  selectedOrderDetails.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2">{item.productName}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">
                        {item.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {formData.partnerId &&
                      !formData.invoiceDetails[0]?.orderId ? (
                        <div className="flex flex-col items-center">
                          <FaClipboardList className="h-10 w-10 text-gray-400 mb-2" />
                          Vui lòng chọn đơn hàng
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <BsBoxSeam className="h-10 w-10 text-gray-400 mb-2" />
                          Chưa có chi tiết đơn hàng
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-gray-700 font-semibold">
              <span>Tổng cộng:</span>
              <span className="text-blue-700 text-lg font-bold">
                {parseFloat(formData.totalAmount || 0).toLocaleString()} VNĐ
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Đã thanh toán (đơn hàng):</span>
              <span className="font-bold">
                {orderPaidAmount.toLocaleString()} VNĐ
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Còn lại:</span>
              <span className="font-bold text-green-600">
                {calculateRemainingAmount().toLocaleString()} VNĐ
              </span>
            </div>
            {formData.paidAmount && (
              <>
                <div className="flex justify-between text-gray-700">
                  <span>Đã thanh toán (sau khi thêm):</span>
                  <span className="font-bold">
                    {calculateTotalWithNewPayment.toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Còn lại (sau khi thêm):</span>
                  <span className="font-bold text-green-700">
                    {calculateNewRemainingAmount.toLocaleString()} VNĐ
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInvoicePage;
