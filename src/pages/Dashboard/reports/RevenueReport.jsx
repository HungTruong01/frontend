import { analyzeWithCondition } from "@/api/orderApi";
import React, { useEffect, useState } from "react";
import { FaDownload, FaFilter } from "react-icons/fa";

const RevenueReport = () => {
  const [filter, setFilter] = useState("monthly");
  const [timeRange, setTimeRange] = useState("2025");
  const [reportData, setReportData] = useState([]);
  const [revenueData, setSevenueData] = useState(0);

  // Dữ liệu mẫu (có thể thay bằng dữ liệu thực từ API)
  const sampleData = {
    monthly: {
      labels: ["Tháng 1", "Tháng 2", "Tháng 3"],
      revenue: [5000000, 6000000, 5500000],
      profit: [1500000, 1800000, 1650000],
    },
    quarterly: {
      labels: ["Q1", "Q2", "Q3"],
      revenue: [16500000, 18000000, 17000000],
      profit: [4950000, 5400000, 5100000],
    },
    yearly: {
      labels: ["2023", "2024", "2025"],
      revenue: [60000000, 65000000, 70000000],
      profit: [18000000, 19500000, 21000000],
    },
  };

  // Tổng doanh thu và lợi nhuận
  const totalRevenue = sampleData[filter].revenue.reduce(
    (sum, val) => sum + val,
    0
  );
  const totalProfit = sampleData[filter].profit.reduce(
    (sum, val) => sum + val,
    0
  );
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(2);

  useEffect(() => {
    const getData = async () => {
      setReportData([]);
      setSevenueData(0);
      const data = await analyzeWithCondition(timeRange);
      const revenueData = data?.content
        .map((item) => item.revenue)
        ?.reduce((sum, val) => sum + val, 0);
      setSevenueData(revenueData);
      setReportData(data?.content);
    };
    getData();
  }, [timeRange]);

  // Hàm xử lý tải xuống báo cáo
  const handleDownload = () => {
    alert(
      "Tải xuống báo cáo dưới dạng PDF hoặc Excel (chưa triển khai thực tế)."
    );
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
              onClick={handleDownload}
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
            <p className="text-2xl font-semibold text-blue-600">{0} VND</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">
              Tỷ lệ lợi nhuận
            </h3>
            <p className="text-2xl font-semibold text-purple-600">
              {profitMargin}%
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
                  {/* <td className="py-3 px-4 text-sm text-gray-600">{label}</td> */}
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {item?.month.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {item?.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {/* {(
                      (sampleData[filter].profit[index] /
                        sampleData[filter].revenue[index]) *
                      100
                    ).toFixed(2)}
                    % */}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* <tbody>
              {sampleData[filter].labels.map((label, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">{label}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {sampleData[filter].revenue[index].toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {sampleData[filter].profit[index].toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {(
                      (sampleData[filter].profit[index] /
                        sampleData[filter].revenue[index]) *
                      100
                    ).toFixed(2)}
                    %
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
