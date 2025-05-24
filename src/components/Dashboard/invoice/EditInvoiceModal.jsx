import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { getAllPartners } from "@/api/partnerApi";
import { getAllInvoiceTypes } from "@/api/invoiceTypeApi";
import { getAllOrders, getOrderById } from "@/api/orderApi";
import { getProductById } from "@/api/productApi";
import { BsBoxSeam } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";
const EditInvoiceModal = ({ isOpen, onClose, onSubmit, invoice }) => {
  const [formData, setFormData] = useState({
    id: "",
    partnerId: "",
    invoiceTypeId: 1,
    orderId: "",
    totalAmount: "",
    paidAmount: "",
    paymentType: "",
  });

  const [partners, setPartners] = useState([]);
  const [invoiceTypes, setInvoiceTypes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [partnerDetails, setPartnerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isOpen && invoice) {
        setLoading(true);
        try {
          const [partnersData, invoiceTypesData, ordersData] =
            await Promise.all([
              getAllPartners(0, 100, "id", "asc"),
              getAllInvoiceTypes(),
              getAllOrders(0, 100, "id", "asc"),
            ]);

          setPartners(partnersData.content || []);
          setInvoiceTypes(invoiceTypesData.content || []);
          setOrders(ordersData.content || []);

          const partnerId = invoice.order?.partnerId || "";
          setFormData({
            id: invoice.id || "",
            partnerId: partnerId.toString(),
            invoiceTypeId: invoice.invoiceTypeId || 1,
            orderId: invoice.orderId?.toString() || "",
            totalAmount: invoice.order?.totalMoney || 0,
            paidAmount:
              invoice.moneyAmount
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "",
            paymentType: invoice.paymentType || "CASH",
          });

          if (invoice.partner) {
            setPartnerDetails({
              name: invoice.partner.name || "",
              phone: invoice.partner.phone || "",
              email: invoice.partner.email || "",
              address: invoice.partner.address || "",
            });
          }

          if (partnerId) {
            const filtered = ordersData.content.filter(
              (order) => order.partnerId === parseInt(partnerId)
            );
            setFilteredOrders(filtered);
          } else {
            setFilteredOrders(ordersData.content || []);
          }
        } catch (err) {
          setError("Không thể tải dữ liệu từ server.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInitialData();
  }, [isOpen, invoice]);

  useEffect(() => {
    if (formData.partnerId) {
      const filtered = orders.filter(
        (order) => order.partnerId === parseInt(formData.partnerId)
      );
      setFilteredOrders(filtered);

      const orderExists = filtered.some(
        (order) => order.id === parseInt(formData.orderId)
      );
      if (!orderExists) {
        setFormData((prev) => ({ ...prev, orderId: "", totalAmount: 0 }));
        setOrderDetails([]);
      }

      const selectedPartner = partners.find(
        (p) => p.id === parseInt(formData.partnerId)
      );
      if (selectedPartner) {
        setPartnerDetails({
          name: selectedPartner.name || "",
          phone: selectedPartner.phone || "",
          email: selectedPartner.email || "",
          address: selectedPartner.address || "",
        });
      }
    } else {
      setFilteredOrders(orders);
      setPartnerDetails({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
      setOrderDetails([]);
    }
  }, [formData.partnerId, orders, partners]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const selectedOrderId = parseInt(formData.orderId, 10) || null;
      if (selectedOrderId) {
        setLoading(true);
        try {
          const orderData = await getOrderById(selectedOrderId);

          if (!orderData || !orderData.orderDetails?.length) {
            setError(
              `Không tìm thấy chi tiết đơn hàng cho orderId ${selectedOrderId}`
            );
            setOrderDetails([]);
            setFormData((prev) => ({ ...prev, totalAmount: 0 }));
            setLoading(false);
            return;
          }

          const details = orderData.orderDetails;
          const detailedItems = await Promise.all(
            details.map(async (detail, index) => {
              try {
                const product = await getProductById(detail.productId);
                return {
                  id: index + 1,
                  productId: detail.productId,
                  productName: product?.name || `Sản phẩm ${detail.productId}`,
                  quantity: detail.quantity || 0,
                  unitPrice: detail?.unit_price || 0,
                  total: (detail.quantity || 0) * (detail?.unit_price || 0),
                };
              } catch (err) {
                console.error(`Lỗi lấy sản phẩm ${detail.productId}:`, err);
                return {
                  id: index + 1,
                  productId: detail.productId,
                  productName: `Sản phẩm ${detail.productId}`,
                  quantity: detail.quantity || 0,
                  unitPrice: detail.unit_price || 0,
                  total: (detail.quantity || 0) * (detail.unit_price || 0),
                };
              }
            })
          );

          setOrderDetails(detailedItems);
          setFormData((prev) => ({
            ...prev,
            totalAmount: orderData.totalMoney || 0,
          }));
        } catch (err) {
          setError("Không thể tải chi tiết đơn hàng.");
          console.error(err);
          setOrderDetails([]);
          setFormData((prev) => ({ ...prev, totalAmount: 0 }));
        } finally {
          setLoading(false);
        }
      } else {
        setOrderDetails([]);
        setFormData((prev) => ({ ...prev, totalAmount: 0 }));
      }
    };

    if (formData.orderId) {
      fetchOrderDetails();
    }
  }, [formData.orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "paidAmount") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const paidAmount = parseFloat(formData.paidAmount?.replace(/\./g, "")) || 0;
    const totalAmount = parseFloat(formData.totalAmount) || 0;
    if (paidAmount > totalAmount) {
      setError(
        `Số tiền thanh toán (${paidAmount.toLocaleString()} VNĐ) không được vượt quá tổng tiền đơn hàng (${totalAmount.toLocaleString()} VNĐ)`
      );
      return;
    }
    const updatedInvoice = {
      id: formData.id,
      invoiceTypeId: parseInt(formData.invoiceTypeId) || 1,
      orderId: parseInt(formData.orderId) || null,
      moneyAmount: paidAmount,
      paymentType: formData.paymentType || null,
    };
    if (!updatedInvoice.invoiceTypeId) {
      setError("Vui lòng chọn loại hóa đơn");
      return;
    }
    if (!updatedInvoice.orderId) {
      setError("Vui lòng chọn đơn hàng");
      return;
    }
    if (!updatedInvoice.paymentType) {
      setError("Vui lòng chọn hình thức thanh toán");
      return;
    }
    // console.log("submit", updatedInvoice);
    onSubmit(updatedInvoice);
    onClose();
  };

  const calculateRemainingAmount = () => {
    const paidAmount = parseFloat(formData.paidAmount?.replace(/\./g, "")) || 0;
    const totalAmount = parseFloat(formData.totalAmount) || 0;
    const order = orders.find((o) => o.id === parseInt(formData.orderId));
    const otherPaidMoney = (order?.paidMoney || 0) - (invoice.moneyAmount || 0);
    return Math.max(totalAmount - otherPaidMoney - paidAmount, 0);
  };

  const calculateTotalPaidForOrder = () => {
    const order = orders.find((o) => o.id === parseInt(formData.orderId));
    const otherPaidMoney = (order?.paidMoney || 0) - (invoice.moneyAmount || 0);
    return otherPaidMoney;
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl transform transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-blue-100 bg-blue-500 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Sửa hóa đơn</h2>
              <p className="text-blue-100 text-sm mt-1">
                Cập nhật thông tin hóa đơn
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã hóa đơn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    readOnly
                  />
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
                    Hình thức thanh toán <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                    required
                  >
                    <option value="">Chọn hình thức thanh toán</option>
                    <option value="CASH">Tiền mặt</option>
                    <option value="TRANSFER">Chuyển khoản</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      !formData.partnerId
                        ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-white border-gray-300 hover:border-blue-300"
                    }`}
                    required
                    disabled={!formData.partnerId}
                  >
                    <option value="">Chọn mã đơn hàng</option>
                    {filteredOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.code || `DH${order.id}`}
                      </option>
                    ))}
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
                      {partnerDetails.name || "Chưa chọn"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500 block mb-1">
                      Số điện thoại
                    </span>
                    <p className="font-medium text-gray-800">
                      {partnerDetails.phone || "Chưa chọn"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500 block mb-1">
                      Email
                    </span>
                    <p className="font-medium text-gray-800">
                      {partnerDetails.email || "Chưa chọn"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500 block mb-1">
                      Địa chỉ
                    </span>
                    <p className="font-medium text-gray-800">
                      {partnerDetails.address || "Chưa chọn"}
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
                    {orderDetails.length > 0 ? (
                      orderDetails.map((item, index) => (
                        <tr
                          key={index}
                          className={`border-t border-gray-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4">{item.productName}</td>
                          <td className="px-6 py-4 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.unitPrice?.toLocaleString()} VNĐ
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            {item.total?.toLocaleString()} VNĐ
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <BsBoxSeam className="h-12 w-12 text-gray-400 mb-3" />
                            Chưa có chi tiết đơn hàng
                          </div>
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
                        Tổng tiền đã thanh toán (khác):
                      </td>
                      <td className="px-6 py-2 text-right font-bold text-gray-600 text-lg">
                        {calculateTotalPaidForOrder().toLocaleString()} VNĐ
                      </td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td
                        colSpan="3"
                        className="px-6 py-2 text-right font-semibold text-gray-800"
                      >
                        Số tiền thanh toán (hóa đơn này):
                      </td>
                      <td className="px-6 py-2 text-right font-bold">
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
                    <tr className="bg-blue-50">
                      <td
                        colSpan="3"
                        className="px-6 py-2 text-right font-semibold text-gray-800"
                      >
                        Số tiền còn lại:
                      </td>
                      <td className="px-6 py-2 text-right font-bold text-green-600 text-lg">
                        {calculateRemainingAmount().toLocaleString()} VNĐ
                      </td>
                    </tr>
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
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoiceModal;
