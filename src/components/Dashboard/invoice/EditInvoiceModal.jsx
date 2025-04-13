import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { partnerApi } from "@/api/partnerApi";
import { getAllInvoiceTypes } from "@/api/invoiceTypeApi";
import { getAllOrders, getOrderById } from "@/api/orderApi";
import { getProductById } from "@/api/productApi";

const EditInvoiceModal = ({ isOpen, onClose, onSubmit, invoice }) => {
  const [formData, setFormData] = useState({
    id: "",
    partnerId: "",
    invoiceTypeId: 1,
    orderId: "",
    totalAmount: "",
    paidAmount: "",
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isOpen && invoice) {
        setLoading(true);
        try {
          const [partnersData, invoiceTypesData, ordersData] =
            await Promise.all([
              partnerApi.getAllPartners(),
              getAllInvoiceTypes(),
              getAllOrders(),
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
          });

          // Cập nhật thông tin đối tác
          if (invoice.partner) {
            setPartnerDetails({
              name: invoice.partner.name || "",
              phone: invoice.partner.phone || "",
              email: invoice.partner.email || "",
              address: invoice.partner.address || "",
            });
          }

          // Lọc đơn hàng theo đối tác
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

  // Cập nhật danh sách đơn hàng khi đối tác thay đổi
  useEffect(() => {
    if (formData.partnerId) {
      const filtered = orders.filter(
        (order) => order.partnerId === parseInt(formData.partnerId)
      );
      setFilteredOrders(filtered);

      // Reset orderId if not valid
      const orderExists = filtered.some(
        (order) => order.id === parseInt(formData.orderId)
      );
      if (!orderExists) {
        setFormData((prev) => ({ ...prev, orderId: "", totalAmount: 0 }));
        setOrderDetails([]);
      }

      // Cập nhật thông tin đối tác
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

  // Cập nhật chi tiết đơn hàng khi mã đơn hàng thay đổi
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
                  unitPrice: product?.price || detail.unitPrice || 0,
                  total:
                    (detail.quantity || 0) *
                    (product?.price || detail.unitPrice || 0),
                };
              } catch (err) {
                console.error(`Lỗi lấy sản phẩm ${detail.productId}:`, err);
                return {
                  id: index + 1,
                  productId: detail.productId,
                  productName: `Sản phẩm ${detail.productId}`,
                  quantity: detail.quantity || 0,
                  unitPrice: detail.unitPrice || 0,
                  total: (detail.quantity || 0) * (detail.unitPrice || 0),
                };
              }
            })
          );

          setOrderDetails(detailedItems);
          // Sử dụng orderData.totalMoney thay vì tính lại
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

    // Kiểm tra paidAmount hợp lệ
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
    };

    if (!updatedInvoice.invoiceTypeId) {
      setError("Vui lòng chọn loại hóa đơn");
      return;
    }

    if (!updatedInvoice.orderId) {
      setError("Vui lòng chọn đơn hàng");
      return;
    }

    onSubmit(updatedInvoice);
    onClose();
  };

  const calculateRemainingAmount = () => {
    const paidAmount = parseFloat(formData.paidAmount?.replace(/\./g, "")) || 0;
    const totalAmount = parseFloat(formData.totalAmount) || 0;
    const order = orders.find((o) => o.id === parseInt(formData.orderId));
    const otherPaidMoney = (order?.paidMoney || 0) - (invoice.moneyAmount || 0); // Trừ tiền của hóa đơn hiện tại
    return Math.max(totalAmount - otherPaidMoney - paidAmount, 0);
  };

  const calculateTotalPaidForOrder = () => {
    const order = orders.find((o) => o.id === parseInt(formData.orderId));
    const otherPaidMoney = (order?.paidMoney || 0) - (invoice.moneyAmount || 0); // Trừ tiền của hóa đơn hiện tại
    return otherPaidMoney;
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl transform transition-all max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Sửa hóa đơn</h2>
              <p className="text-white/80 text-sm mt-1">
                Cập nhật thông tin hóa đơn
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none p-2 hover:bg-white/10 rounded-full"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
          {loading && <p className="text-blue-500">Đang tải dữ liệu...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols gap-8">
            <div className="col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Thông tin chung
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã hóa đơn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại hóa đơn <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="invoiceTypeId"
                      value={formData.invoiceTypeId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
                      required
                    >
                      {invoiceTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đối tác <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="partnerId"
                      value={formData.partnerId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
                      required
                    >
                      <option value="">Chọn đối tác</option>
                      {partners.map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {partner.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã đơn hàng <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="orderId"
                      value={formData.orderId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
                      required
                    >
                      <option value="">Chọn mã đơn hàng</option>
                      {filteredOrders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.code || `DH${order.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Thông tin đối tác
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên đối tác
                    </label>
                    <input
                      type="text"
                      value={partnerDetails.name}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={partnerDetails.phone}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={partnerDetails.email}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={partnerDetails.address}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Chi tiết đơn hàng
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
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.length > 0 ? (
                        orderDetails.map((item, index) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3">{item.productName}</td>
                            <td className="px-4 py-3 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {item.unitPrice?.toLocaleString()} VNĐ
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              {item.total?.toLocaleString()} VNĐ
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-3 text-center text-gray-500"
                          >
                            Chưa có chi tiết đơn hàng cho mã đơn hàng đã chọn
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white border-t-2 border-gray-200">
                        <td
                          colSpan="3"
                          className="px-3 py-3 text-right font-semibold text-gray-800"
                        >
                          Tổng cộng:
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-blue-600 text-lg">
                          {parseFloat(
                            formData.totalAmount || 0
                          ).toLocaleString()}{" "}
                          VNĐ
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td
                          colSpan="3"
                          className="px-3 py-3 text-right font-semibold text-gray-800"
                        >
                          Tổng tiền đã thanh toán (khác):
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-gray-600 text-lg">
                          {calculateTotalPaidForOrder().toLocaleString()} VNĐ
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td
                          colSpan="3"
                          className="px-3 py-3 text-right font-semibold text-gray-800"
                        >
                          Số tiền thanh toán (hóa đơn này):
                        </td>
                        <td className="px-3 py-3 text-right font-bold">
                          <input
                            type="text"
                            name="paidAmount"
                            value={formData.paidAmount}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border border-gray-200 rounded-lg text-right bg-white"
                            placeholder="Nhập số tiền thanh toán"
                          />
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td
                          colSpan="3"
                          className="px-3 py-3 text-right font-semibold text-gray-800"
                        >
                          Số tiền còn lại:
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-green-600 text-lg">
                          {calculateRemainingAmount().toLocaleString()} VNĐ
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
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
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoiceModal;
