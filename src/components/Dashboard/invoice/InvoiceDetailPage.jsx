import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchInvoiceDetail } from "@/redux/slices/invoiceSlice";
import { FaArrowLeft, FaGift, FaClipboardList } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { formatCurrency, formatDate } from "@/utils/formatter";

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoices.detail);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchInvoiceDetail(id));
      } catch (error) {
        console.error("Error fetching invoice details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

  const orderDetails = invoice?.items || [];
  const orderTotal = invoice?.order?.totalMoney || 0;
  const orderPaidTotal = invoice?.order?.paidMoney || 0;
  const remainingAmount = Math.max(orderTotal - orderPaidTotal, 0);

  const getPaymentTypeDisplay = (type) => {
    const types = {
      CASH: "Tiền mặt",
      TRANSFER: "Chuyển khoản",
    };
    return types[type] || type;
  };

  if (loading || !invoice) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full inline-block"></span>
        <span className="ml-3 text-blue-700 font-semibold">
          Đang tải dữ liệu...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* Cột trái: Thông tin chung */}
        <div className="flex-1 min-w-[320px]">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/dashboard/business/invoice-management")}
              className="flex items-center text-gray-600 hover:text-blue-700 mr-4 mb-2"
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Chi tiết hóa đơn</h1>
          </div>
          <div className="space-y-6">
            <div>
              <div className="mb-2 text-gray-500">Mã hóa đơn</div>
              <div className="font-bold text-lg">{invoice.id}</div>
            </div>
            <div>
              <div className="mb-2 text-gray-500">Ngày lập</div>
              <div>{formatDate(invoice.createdAt)}</div>
            </div>
            <div>
              <div className="mb-2 text-gray-500">Đối tác</div>
              <div className="font-semibold">
                {invoice.partner?.name || "Không có thông tin"}
              </div>
            </div>
            <div>
              <div className="mb-2 text-gray-500">Loại hóa đơn</div>
              <div>{invoice.invoiceType?.name}</div>
            </div>
            <div>
              <div className="mb-2 text-gray-500">Số tiền</div>
              <div className="text-blue-700 font-bold text-lg">
                {formatCurrency(invoice.moneyAmount)}
              </div>
            </div>
            <div>
              <div className="mb-2 text-gray-500">Hình thức thanh toán</div>
              <div>{getPaymentTypeDisplay(invoice.paymentType)}</div>
            </div>
          </div>
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
                  orderDetails.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
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
                      {invoice.partnerName && invoice.orderId ? (
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
              <span>Tổng tiền đơn hàng:</span>
              <span className="text-blue-700 text-lg font-bold">
                {formatCurrency(orderTotal)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Số tiền thanh toán (hóa đơn này):</span>
              <span className="font-bold">
                {formatCurrency(invoice?.moneyAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tổng đã thanh toán (tất cả hóa đơn):</span>
              <span className="font-bold">
                {formatCurrency(orderPaidTotal)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Còn lại:</span>
              <span className="font-bold text-red-600">
                {formatCurrency(remainingAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
