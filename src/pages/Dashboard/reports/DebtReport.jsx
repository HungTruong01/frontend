import React, { useState, useEffect } from "react";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import { getMonthlyDebtReport, getYearlyDebtReport } from "@/api/debtApi";
import { toast } from "react-toastify";
import { exportExcel } from "@/utils/exportExcel";
import { FaFilter, FaDownload } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatter";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const DebtReport = () => {
  const [reportType, setReportType] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (reportType === "monthly") {
        data = await getMonthlyDebtReport(year, month);
      } else {
        data = await getYearlyDebtReport(year);
      }
      if (
        (!data.partners || data.partners.length === 0) &&
        data.totalDebt === 0 &&
        data.totalInvoicePaid === 0
      ) {
        throw new Error(
          "Không có dữ liệu công nợ hoặc hóa đơn thanh toán trong khoảng thời gian này"
        );
      }
      setReportData(data);
    } catch (error) {
      setError(error.message || "Không thể tải dữ liệu báo cáo công nợ");
      toast.error(error.message || "Không thể tải dữ liệu báo cáo công nợ");
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType, year, month]);

  const pieChartData = {
    labels: ["Công nợ", "Đã thanh toán (Hóa đơn)"],
    datasets: [
      {
        data: [reportData?.totalDebt || 0, reportData?.totalInvoicePaid || 0],
        backgroundColor: ["rgba(239, 68, 68, 0.6)", "rgba(59, 130, 246, 0.6)"],
        borderColor: ["rgb(239, 68, 68)", "rgb(59, 130, 246)"],
        borderWidth: 1,
      },
    ],
  };

  // Thiết lập tùy chọn cho biểu đồ tròn
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
            : `Tỷ lệ công nợ và thanh toán - Năm ${year}`,
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

  const remainingDebtPartners =
    reportData?.partners?.filter(
      (partner) => (partner.debt || 0) - (partner.paid || 0) > 0
    ) || [];

  const handleExportExcel = () => {
    try {
      // Xuất dữ liệu tổng quan
      const overviewData = [
        {
          "Tổng công nợ": formatCurrency(reportData.totalDebt || 0),
          "Đã thanh toán": formatCurrency(reportData.totalInvoicePaid || 0),
          "Còn nợ": formatCurrency(
            (reportData.totalDebt || 0) - (reportData.totalInvoicePaid || 0)
          ),
          "Tỷ lệ thanh toán": `${(
            (reportData.totalInvoicePaid / reportData.totalDebt) *
            100
          ).toFixed(2)}%`,
        },
      ];

      // Xuất dữ liệu chi tiết đối tác còn nợ
      const detailData = remainingDebtPartners.map((partner) => ({
        "Đối tác": partner.name,
        "Loại đối tác": partner.partnerTypeName,
        "Nợ còn lại": formatCurrency((partner.debt || 0) - (partner.paid || 0)),
      }));

      exportExcel({
        data: overviewData,
        fileName: "Báo cáo công nợ",
        sheetName: "Tổng quan",
        autoWidth: true,
        zebraPattern: true,
      });

      exportExcel({
        data: detailData,
        fileName: "Báo cáo công nợ",
        sheetName: "Chi tiết đối tác",
        autoWidth: true,
        zebraPattern: true,
      });
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      toast.error("Có lỗi xảy ra khi xuất file Excel");
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setHasStartDateSelected(true);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Báo cáo công nợ đối tác
          </h1>

          <div className="flex items-center space-x-4">
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={handleExportExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <FaDownload className="mr-2" />
                Tải xuống
              </button>
            </div>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Theo tháng</option>
              <option value="yearly">Theo năm</option>
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
                    Chi tiết công nợ đối tác còn nợ
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Đối tác
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại đối tác
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {partner.partnerTypeName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
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
