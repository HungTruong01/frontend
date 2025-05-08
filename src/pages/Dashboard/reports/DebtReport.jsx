import React, { useState, useEffect } from "react";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  getMonthlyDebtReport,
  getYearlyDebtReport,
  getDebtReportByDateRange,
} from "@/api/debtApi";
import { toast } from "react-toastify";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const DebtReport = () => {
  const [reportType, setReportType] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (reportType === "custom" && (!startDate || !endDate)) {
        throw new Error("Vui lòng chọn ngày bắt đầu và kết thúc");
      }

      if (reportType === "custom" && new Date(startDate) > new Date(endDate)) {
        throw new Error("Ngày bắt đầu phải trước ngày kết thúc");
      }

      let data;
      if (reportType === "monthly") {
        data = await getMonthlyDebtReport(year, month);
      } else if (reportType === "yearly") {
        data = await getYearlyDebtReport(year);
      } else {
        data = await getDebtReportByDateRange(startDate, endDate);
      }

      if (data.partners.length === 0 && data.totalInvoicePaid === 0) {
        throw new Error(
          "Không có dữ liệu công nợ hoặc hóa đơn thanh toán trong khoảng thời gian này"
        );
      }

      setReportData(data);
    } catch (error) {
      const errorMessage =
        error.message || "Không thể tải dữ liệu báo cáo công nợ";
      setError(errorMessage);
      toast.error(errorMessage);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType, year, month, startDate, endDate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const pieChartData = {
    labels: ["Công nợ", "Đã thanh toán (Đối tác)", "Đã thanh toán (Hóa đơn)"],
    datasets: [
      {
        data: [
          reportData?.totalDebt || 0,
          reportData?.totalPaid || 0,
          reportData?.totalInvoicePaid || 0,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.6)",
          "rgba(34, 197, 94, 0.6)",
          "rgba(59, 130, 246, 0.6)",
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(34, 197, 94)",
          "rgb(59, 130, 246)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text:
          reportType === "monthly"
            ? `Tỷ lệ công nợ và thanh toán - Tháng ${month}/${year}`
            : reportType === "yearly"
            ? `Tỷ lệ công nợ và thanh toán - Năm ${year}`
            : `Tỷ lệ công nợ và thanh toán từ ${startDate} đến ${endDate}`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
  };

  // Lọc khách hàng còn nợ (debt - paid > 0)
  const remainingDebtPartners =
    reportData?.partners?.filter(
      (partner) => (partner.debt || 0) - (partner.paid || 0) > 0
    ) || [];

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Báo cáo công nợ khách hàng
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Theo tháng</option>
              <option value="yearly">Theo năm</option>
              <option value="custom">Tùy chỉnh</option>
            </select>

            {reportType === "monthly" && (
              <>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[...Array(5)].map((_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </>
            )}

            {reportType === "yearly" && (
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[...Array(5)].map((_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
            )}

            {reportType === "custom" && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reportData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-sm font-medium text-red-800">
                  Tổng công nợ
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(reportData.totalDebt || 0)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800">
                  Đã thanh toán (Hóa đơn)
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(reportData.totalInvoicePaid || 0)}
                </p>
              </div>
            </div>

            <div className="h-[400px] flex items-center justify-center">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>

            {remainingDebtPartners.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Chi tiết công nợ khách hàng còn nợ
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nợ còn lại
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {remainingDebtPartners.map((partner, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {partner.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                            {formatCurrency(
                              (partner.debt || 0) - (partner.paid || 0)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Không có dữ liệu để hiển thị
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtReport;
