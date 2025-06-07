import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchInvoiceDetail } from "@/redux/slices/invoiceSlice";
import { fetchPartners } from "@/redux/slices/partnerSlice";
import { fetchInvoiceTypes } from "@/redux/slices/invoiceTypeSlice";
import { updateInvoice } from "@/api/invoiceApi";
import {
  FaArrowLeft,
  FaGift,
  FaClipboardList,
  FaSpinner,
} from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { toast } from "react-toastify";
import { formatCurrency } from "@/utils/formatter";

const EditInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoices.detail);
  const { list: invoiceTypes } = useSelector((state) => state.invoiceTypes);
  const initialFormData = {
    id: "",
    partnerId: "",
    invoiceTypeId: "",
    orderId: "",
    totalAmount: "",
    paidAmount: "",
    paymentType: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [partnerDetails, setPartnerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const [invoiceResult] = await Promise.all([
            dispatch(fetchInvoiceDetail(id)),
            dispatch(fetchInvoiceTypes()),
          ]);

          if (invoiceResult.error) {
            throw new Error("Lỗi khi tải dữ liệu");
          }
        } catch (error) {
          toast.error("Không thể tải thông tin hóa đơn");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id, dispatch]);

  useEffect(() => {
    if (invoice) {
      const paymentTypeMap = {
        "Tiền mặt": "CASH",
        "Chuyển khoản": "TRANSFER",
      };

      setFormData({
        id: invoice.id || "",
        partnerId: invoice.partner?.id?.toString() || "",
        invoiceTypeId: invoice.invoiceType?.id || "",
        orderId: invoice.order?.id?.toString() || "",
        totalAmount: invoice.order?.totalMoney || 0,
        paidAmount:
          invoice.moneyAmount
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "",
        paymentType: paymentTypeMap[invoice.paymentType] || "",
      });

      setPartnerDetails({
        name: invoice.partner?.name || "",
        phone: invoice.partner?.phone || "",
        email: invoice.partner?.email || "",
        address: invoice.partner?.address || "",
      });

      setOrderDetails(invoice.items || []);
    }
  }, [invoice]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paidAmount = parseFloat(formData.paidAmount?.replace(/\./g, "")) || 0;
    const totalAmount = parseFloat(formData.totalAmount) || 0;

    if (paidAmount > totalAmount) {
      toast.error(
        `Số tiền thanh toán (${paidAmount.toLocaleString()} VNĐ) không được vượt quá tổng tiền đơn hàng (${totalAmount.toLocaleString()} VNĐ)`
      );
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        id: parseInt(formData.id),
        partnerId: parseInt(formData.partnerId),
        invoiceTypeId: parseInt(formData.invoiceTypeId),
        orderId: parseInt(formData.orderId),
        moneyAmount: paidAmount,
        paymentType: formData.paymentType,
      };
      const response = await updateInvoice(id, updateData);
      if (response && response.id) {
        toast.success("Cập nhật hóa đơn thành công");
        navigate("/dashboard/business/invoice-management");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error(
        error?.response?.data?.message ||
          "Không thể cập nhật hóa đơn. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };
  const totalPaidForOrder =
    (invoice?.order?.paidMoney || 0) - (invoice?.moneyAmount || 0);
  const remainingAmount = Math.max(
    (invoice?.order?.totalMoney || 0) -
      totalPaidForOrder -
      (parseFloat(formData.paidAmount?.replace(/\./g, "")) || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* Cột trái: Form nhập thông tin */}
        <div className="flex-1 min-w-[320px]">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/dashboard/business/invoice-management")}
              className="flex items-center text-gray-600 hover:text-blue-700 mr-4 mb-2"
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Sửa hóa đơn</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đối tác <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={partnerDetails.name}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-700"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:border-blue-300"
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
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                required
                disabled
              />
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
                Số tiền <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-right"
                placeholder="Nhập số tiền (VNĐ)"
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
                {loading ? "Đang xử lý..." : "Lưu thay đổi"}
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
                {orderDetails.length > 0 ? (
                  orderDetails.map((item, idx) => (
                    <tr
                      key={idx}
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
                      {formData.partnerId && formData.orderId ? (
                        <div className="flex flex-col items-center">
                          <FaClipboardList className="h-10 w-10 text-gray-400 mb-2" />
                          Không có chi tiết đơn hàng
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
                {formatCurrency(formData.totalAmount)}{" "}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tổng tiền đã thanh toán (khác):</span>
              <span className="font-bold">
                {totalPaidForOrder.toLocaleString()} VNĐ
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Số tiền thanh toán (hóa đơn này):</span>
              <input
                type="text"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-black text-right bg-white"
                placeholder="Nhập số tiền trả (VNĐ)"
              />
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Số tiền còn lại:</span>
              <span className="font-bold">
                {remainingAmount.toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoicePage;
