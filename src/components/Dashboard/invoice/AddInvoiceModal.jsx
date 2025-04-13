import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { partnerApi } from "@/api/partnerApi";
import { getAllInvoiceTypes } from "@/api/invoiceTypeApi";
import { getProductById } from "@/api/productApi";
import { createInvoice } from "@/api/invoiceApi";
import { getAllOrders, getOrdersByPartnerId } from "@/api/orderApi";
import { getAllOrderDetails } from "@/api/orderDetailApi";

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
  });
  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoiceTypes, setInvoiceTypes] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Điền sẵn dữ liệu từ preselectedOrderData hoặc reset form
  useEffect(() => {
    if (isOpen) {
      if (preselectedOrderData) {
        setFormData({
          partnerId: preselectedOrderData.partnerId?.toString() || "",
          invoiceTypeId: "",
          totalAmount: preselectedOrderData.totalMoney?.toString() || "",
          paidAmount: "",
          invoiceDetails: [
            { orderId: preselectedOrderData.id?.toString() || "", amount: "" },
          ],
        });
        setFilteredOrders([preselectedOrderData]);
      } else {
        setFormData({
          partnerId: "",
          invoiceTypeId: "",
          totalAmount: "",
          paidAmount: "",
          invoiceDetails: [{ orderId: "", amount: "" }],
        });
        setFilteredOrders([]);
        setSelectedOrderDetails([]);
      }
    }
  }, [isOpen, preselectedOrderData]);

  // Tải danh sách partners, invoiceTypes, và orders
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [partnersData, invoiceTypesData, ordersData] = await Promise.all([
          partnerApi.getAllPartners(),
          getAllInvoiceTypes(),
          getAllOrders(),
        ]);
        setPartners(partnersData.content || []);
        setInvoiceTypes(invoiceTypesData.content || []);
        setOrders(ordersData.content || []);
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

  // Lọc đơn hàng theo partnerId khi không có preselectedOrderData
  useEffect(() => {
    if (!preselectedOrderData && formData.partnerId) {
      const filtered = orders.filter(
        (order) => order.partnerId === parseInt(formData.partnerId)
      );
      setFilteredOrders(filtered);
    } else if (!formData.partnerId && !preselectedOrderData) {
      setFilteredOrders([]);
    }
  }, [formData.partnerId, orders, preselectedOrderData]);

  // Tải chi tiết đơn hàng và thông tin sản phẩm khi orderId thay đổi
  useEffect(() => {
    const fetchOrderDetails = async () => {
      const selectedOrderId =
        parseInt(formData.invoiceDetails[0]?.orderId, 10) || null;

      if (!selectedOrderId) {
        setSelectedOrderDetails([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Lấy chi tiết đơn hàng từ API
        const orderDetailsData = await getAllOrderDetails(selectedOrderId);
        const details = orderDetailsData.content || [];

        if (!details.length) {
          setError(
            `Không tìm thấy chi tiết đơn hàng cho orderId ${selectedOrderId}`
          );
          setSelectedOrderDetails([]);
          setFormData((prev) => ({ ...prev, totalAmount: "" }));
          setLoading(false);
          return;
        }

        // Lấy thông tin đơn hàng để lấy totalMoney
        const selectedOrder =
          orders.find((order) => order.id === selectedOrderId) ||
          filteredOrders.find((order) => order.id === selectedOrderId);

        // Tạo một Map để lưu trữ thông tin sản phẩm đã xử lý để tránh trùng lặp
        const processedProducts = new Map();

        // Xử lý chi tiết đơn hàng
        for (const detail of details) {
          // Bỏ qua nếu đã xử lý sản phẩm này
          if (processedProducts.has(detail.productId)) continue;

          try {
            const product = await getProductById(detail.productId);
            processedProducts.set(detail.productId, {
              productId: detail.productId,
              productName: product?.name || `SP ${detail.productId}`,
              quantity: detail.quantity || 0,
              unitPrice: product?.price || detail.unitPrice || 0,
              total:
                (detail.quantity || 0) *
                (product?.price || detail.unitPrice || 0),
            });
          } catch (err) {
            console.error("Lỗi lấy sản phẩm:", detail.productId, err);
            // Chỉ thêm vào khi chưa xử lý sản phẩm này
            processedProducts.set(detail.productId, {
              productId: detail.productId,
              productName: `SP ${detail.productId}`,
              quantity: detail.quantity || 0,
              unitPrice: detail.unitPrice || 0,
              total: (detail.quantity || 0) * (detail.unitPrice || 0),
            });
          }
        }

        // Chuyển từ Map sang mảng để hiển thị
        const detailedItems = Array.from(processedProducts.values()).map(
          (item, index) => ({
            id: index + 1,
            ...item,
          })
        );

        setSelectedOrderDetails(detailedItems);
        setFormData((prev) => ({
          ...prev,
          totalAmount: selectedOrder?.totalMoney?.toString() || "",
        }));
      } catch (err) {
        setError("Không thể tải chi tiết đơn hàng.");
        console.error(err);
        setSelectedOrderDetails([]);
        setFormData((prev) => ({ ...prev, totalAmount: "" }));
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [formData.invoiceDetails[0]?.orderId, orders, filteredOrders]);

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

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.invoiceDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData((prev) => ({ ...prev, invoiceDetails: newDetails }));
  };

  // Sửa lại hàm handleSubmit để cập nhật đúng status của đơn hàng
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const paidAmount = formData.paidAmount
        ? parseFloat(formData.paidAmount.replace(/\./g, ""))
        : 0;

      const submitData = {
        invoiceTypeId: parseInt(formData.invoiceTypeId) || null,
        moneyAmount: paidAmount,
        orderId: parseInt(formData.invoiceDetails[0]?.orderId) || null,
      };

      // Các kiểm tra hiện tại...

      // Kiểm tra và cập nhật status đơn hàng nếu cần
      const selectedOrder =
        orders.find((order) => order.id === submitData.orderId) ||
        filteredOrders.find((order) => order.id === submitData.orderId);

      const totalMoney = selectedOrder?.totalMoney || 0;
      const paidMoney = selectedOrder?.paidMoney || 0;
      const newPaidTotal = paidMoney + paidAmount;

      // Xác định trạng thái mới cho đơn hàng dựa trên số tiền đã trả
      // 1 = Đã thanh toán, 2 = Chưa thanh toán, 3 = Thanh toán một phần
      let newOrderStatusId;
      if (newPaidTotal >= totalMoney) {
        newOrderStatusId = 1; // Đã thanh toán
      } else if (newPaidTotal > 0) {
        newOrderStatusId = 3; // Thanh toán một phần
      } else {
        newOrderStatusId = 2; // Chưa thanh toán
      }

      // Thêm thông tin status mới vào submitData nếu API của bạn hỗ trợ
      submitData.newOrderStatusId = newOrderStatusId;

      // Gọi API để tạo hóa đơn với thông tin mới
      const response = await createInvoice(submitData);
      onSubmit(response);
      onClose();
    } catch (err) {
      setError("Lỗi khi tạo hóa đơn: " + err.message);
      console.error("Error creating invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingAmount = () => {
    const paid = parseFloat(formData.paidAmount.replace(/\./g, "")) || 0;
    const selectedOrder =
      orders.find(
        (order) => order.id === parseInt(formData.invoiceDetails[0]?.orderId)
      ) ||
      filteredOrders.find(
        (order) => order.id === parseInt(formData.invoiceDetails[0]?.orderId)
      );
    const total = selectedOrder?.totalMoney || 0;
    const paidMoney = selectedOrder?.paidMoney || 0;
    return Math.max(total - paidMoney - paid, 0);
  };

  // Hàm định dạng số tiền
  const formatCurrency = (amount) => {
    return `${new Intl.NumberFormat("vi-VN").format(amount)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl transform transition-all max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Thêm hóa đơn mới
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Nhập thông tin hóa đơn
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
          {loading && <p>Đang xử lý...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Thông tin chung
                </h3>
                <div className="grid grid-cols-3 gap-4">
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
                      disabled={!!preselectedOrderData}
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
                      Loại hóa đơn <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="invoiceTypeId"
                      value={formData.invoiceTypeId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã đơn hàng <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="orderId"
                      value={formData.invoiceDetails[0]?.orderId || ""}
                      onChange={(e) =>
                        handleDetailChange(0, "orderId", e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
                      required
                      disabled={!!preselectedOrderData}
                    >
                      <option value="">Chọn mã đơn hàng</option>
                      {filteredOrders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.orderId || `DH${order.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Thông tin đối tác
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-600">Tên đối tác:</span>
                    <p className="font-medium">
                      {partners.find(
                        (p) => p.id === parseInt(formData.partnerId)
                      )?.name || "Chưa chọn"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Số điện thoại:</span>
                    <p className="font-medium">
                      {partners.find(
                        (p) => p.id === parseInt(formData.partnerId)
                      )?.phone || "Chưa chọn"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">
                      {partners.find(
                        (p) => p.id === parseInt(formData.partnerId)
                      )?.email || "Chưa chọn"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Địa chỉ:</span>
                    <p className="font-medium">
                      {partners.find(
                        (p) => p.id === parseInt(formData.partnerId)
                      )?.address || "Chưa chọn"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Chi tiết đơn hàng
                </h3>
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
                      {selectedOrderDetails.length > 0 ? (
                        selectedOrderDetails.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-gray-200"
                          >
                            <td className="px-4 py-3">{item.productName}</td>
                            <td className="px-4 py-3 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(item.unitPrice)} VNĐ
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              {formatCurrency(item.total)} VNĐ
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-3 text-center text-gray-500"
                          >
                            Chưa có chi tiết đơn hàng
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white border-t-2 border-gray-200">
                        <td
                          colSpan="3"
                          className="px-3 pt-6 text-right font-semibold text-gray-800"
                        >
                          Tổng cộng:
                        </td>
                        <td className="px-3 pt-6 text-right font-bold text-blue-600 text-lg">
                          {formData.totalAmount
                            ? formatCurrency(parseFloat(formData.totalAmount))
                            : "0"}{" "}
                          VNĐ
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td
                          colSpan="3"
                          className="px-3 text-right font-semibold text-gray-800"
                        >
                          Tổng tiền còn lại:
                        </td>
                        <td className="px-3 py-1 text-right font-bold text-green-600 text-lg">
                          {formatCurrency(calculateRemainingAmount())} VNĐ
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td
                          colSpan="3"
                          className="px-3 text-right font-semibold text-gray-800"
                        >
                          Số tiền trả:
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
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
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
              type="onClick"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg"
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

export default AddInvoiceModal;
