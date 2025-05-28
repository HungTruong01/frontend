import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  getMonthlyIncomeReport,
  getYearlyIncomeReport,
  getIncomeReportByDateRange,
} from "@/api/incomeReportApi";
import { toast } from "react-toastify";
import { exportExcel } from "@/utils/exportExcel";
import { FaFilter, FaDownload } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IncomeReport = () => {
  const [reportType, setReportType] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [filter, setFilter] = useState("monthly");
  const [timeRange, setTimeRange] = useState("2023");

  const fetchReportData = async () => {
    try {
      setLoading(true);
      let data;

      if (reportType === "custom" && (!startDate || !endDate)) {
        throw new Error("Vui lòng chọn ngày bắt đầu và kết thúc");
      }

      if (reportType === "custom" && new Date(startDate) > new Date(endDate)) {
        throw new Error("Ngày bắt đầu phải trước ngày kết thúc");
      }

      switch (reportType) {
        case "monthly":
          data = await getMonthlyIncomeReport(year, month);
          break;
        case "yearly":
          data = await getYearlyIncomeReport(year);
          break;
        case "custom":
          data = await getIncomeReportByDateRange(startDate, endDate);
          break;
        default:
          data = await getMonthlyIncomeReport(year, month);
      }

      setReportData(data);
      setError(null);
    } catch (err) {
      const errorMessage = err.message || "Không thể tải dữ liệu báo cáo";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportType === "custom" && (!startDate || !endDate)) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchReportData();
    }, 300);

    return () => clearTimeout(timer);
  }, [reportType, year, month, startDate, endDate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const chartData = {
    labels: reportData?.labels || [],
    datasets: [
      {
        label: "Thu",
        data: reportData?.income || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Chi",
        data: reportData?.expense || [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text:
          reportType === "monthly"
            ? `Báo cáo thu chi - Tháng ${month}/${year}`
            : reportType === "yearly"
            ? `Báo cáo thu chi - Năm ${year}`
            : `Báo cáo thu chi từ ${startDate} đến ${endDate}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  const handleExportExcel = () => {
    try {
      // Xuất dữ liệu tổng quan
      const overviewData = [
        {
          "Tổng thu": formatCurrency(reportData.totalIncome || 0),
          "Tổng chi": formatCurrency(reportData.totalExpense || 0),
          "Lợi nhuận": formatCurrency(
            (reportData.totalIncome || 0) - (reportData.totalExpense || 0)
          ),
          "Tỷ lệ chi/thu": `${(
            (reportData.totalExpense / reportData.totalIncome) *
            100
          ).toFixed(2)}%`,
        },
      ];

      // Xuất dữ liệu chi tiết theo thời gian
      const detailData = reportData.labels.map((label, index) => ({
        "Thời gian": label,
        Thu: formatCurrency(reportData.income[index] || 0),
        Chi: formatCurrency(reportData.expense[index] || 0),
        "Chênh lệch": formatCurrency(
          (reportData.income[index] || 0) - (reportData.expense[index] || 0)
        ),
      }));

      exportExcel({
        data: overviewData,
        fileName: "Báo cáo thu chi",
        sheetName: "Tổng quan",
        autoWidth: true,
        zebraPattern: true,
      });

      exportExcel({
        data: detailData,
        fileName: "Báo cáo thu chi",
        sheetName: "Chi tiết theo thời gian",
        autoWidth: true,
        zebraPattern: true,
      });
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      toast.error("Có lỗi xảy ra khi xuất file Excel");
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Báo cáo thu chi</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExportExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FaDownload className="mr-2" />
              Tải xuống
            </button>
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
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-800">Tổng thu</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(reportData.totalIncome || 0)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-sm font-medium text-red-800">Tổng chi</h3>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(reportData.totalExpense || 0)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800">Lợi nhuận</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    (reportData.totalIncome || 0) -
                      (reportData.totalExpense || 0)
                  )}
                </p>
              </div>
            </div>

            <div style={{ height: "400px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        ) : reportType === "custom" && (!startDate || !endDate) ? (
          <div className="text-center py-4 text-gray-500">
            Vui lòng chọn ngày bắt đầu và kết thúc để xem báo cáo
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

export default IncomeReport;
