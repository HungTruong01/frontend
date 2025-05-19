import {
  analyzeWithCondition,
  analyzeWithConditionQuality,
  analyzeWithConditionYear,
} from "@/api/orderApi";
import { exportExcel } from "@/utils/exportExcel";
import React, { useEffect, useState } from "react";
import { FaDownload, FaFilter } from "react-icons/fa";

const RevenueReport = () => {
  const [filter, setFilter] = useState("monthly");
  const [timeRange, setTimeRange] = useState("2025");
  const [reportData, setReportData] = useState([]);
  const [revenueData, setSevenueData] = useState(0);
  const [profitData, setProfitData] = useState(0);

  useEffect(() => {
    const getData = async () => {
      setReportData([]);
      setSevenueData(0);
      let data;
      if (filter === "monthly") {
        data = await analyzeWithCondition(timeRange);
      } else if (filter === "quarterly") {
        data = await analyzeWithConditionQuality(timeRange);
      } else if (filter === "yearly") {
        data = await analyzeWithConditionYear();
      }

      const revenueData = data?.content
        .map((item) => +item.revenue)
        ?.reduce((sum, val) => sum + val, 0);
      const profitData = data?.content
        .map((item) => +item.profit)
        ?.reduce((sum, val) => sum + val, 0);
      setProfitData(profitData);
      setSevenueData(revenueData);
      setReportData(data?.content);
    };
    getData();
  }, [timeRange, filter]);

  const handleExportExcel = () => {
    const exportData = reportData.map((order) => ({
      Label: order.label,
      "Doanh thu": +order.revenue.toLocaleString(),
    }));

    const totalRevenue = reportData.reduce(
      (sum, order) => sum + +order.revenue,
      0
    );

    exportData.push({
      Label: "Tổng",
      "Doanh thu": totalRevenue.toLocaleString(),
    });

    exportExcel(exportData, "Doanh thu theo tháng", "Doanh thu");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Tiêu đề và nút điều khiển */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Báo cáo Doanh thu & Lợi nhuận
          </h1>
          <div className="flex items-center gap-4">
            {/* Bộ lọc */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="monthly">Hàng tháng</option>
                <option value="quarterly">Hàng quý</option>
                <option value="yearly">Hàng năm</option>
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            {/* Nút tải xuống */}
            <button
              onClick={handleExportExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FaDownload className="mr-2" />
              Tải xuống
            </button>
          </div>
        </div>

        {/* Tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">
              Tổng doanh thu
            </h3>
            <p className="text-2xl font-semibold text-green-600">
              {revenueData.toLocaleString()} VND
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">
              Tổng lợi nhuận
            </h3>
            <p className="text-2xl font-semibold text-blue-600">
              {profitData.toLocaleString()} VND
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">
              Tỷ lệ lợi nhuận
            </h3>
            <p className="text-2xl font-semibold text-purple-600">
              {((profitData / revenueData) * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Thời gian
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                  Doanh thu (VND)
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                  Lợi nhuận (VND)
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                  Tỷ lệ lợi nhuận (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData?.reverse()?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {item?.label}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {Number.parseInt(item?.revenue).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {Number.parseInt(item?.profit).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {((item.profit / item?.revenue) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
