import React, { useState } from "react";
import { FaDownload, FaFilter } from "react-icons/fa";

const IncomeReport = () => {
  const [filter, setFilter] = useState("monthly"); // Bộ lọc: hàng tháng, hàng quý, hàng năm
  const [timeRange, setTimeRange] = useState("2025"); // Phạm vi thời gian

  // Dữ liệu mẫu (có thể thay bằng dữ liệu từ API)
  const sampleData = {
    monthly: {
      labels: ["Tháng 1", "Tháng 2", "Tháng 3"],
      income: [7000000, 8000000, 7500000],
      expense: [4500000, 5000000, 4800000],
      transactions: [
        {
          id: 1,
          date: "01/01/2025",
          description: "Bán hàng xuất khẩu",
          type: "Thu",
          amount: 7000000,
        },
        {
          id: 2,
          date: "05/01/2025",
          description: "Nhập nguyên liệu",
          type: "Chi",
          amount: 4500000,
        },
        {
          id: 3,
          date: "02/02/2025",
          description: "Doanh thu dịch vụ",
          type: "Thu",
          amount: 8000000,
        },
        {
          id: 4,
          date: "06/02/2025",
          description: "Chi phí vận chuyển",
          type: "Chi",
          amount: 5000000,
        },
      ],
    },
    quarterly: {
      labels: ["Q1", "Q2", "Q3"],
      income: [22500000, 24000000, 23000000],
      expense: [14300000, 15000000, 14500000],
      transactions: [], // Có thể thêm dữ liệu chi tiết
    },
    yearly: {
      labels: ["2023", "2024", "2025"],
      income: [80000000, 85000000, 90000000],
      expense: [50000000, 52000000, 55000000],
      transactions: [], // Có thể thêm dữ liệu chi tiết
    },
  };

  // Tổng thu và chi dựa trên bộ lọc
  const totalIncome = sampleData[filter].income.reduce(
    (sum, val) => sum + val,
    0
  );
  const totalExpense = sampleData[filter].expense.reduce(
    (sum, val) => sum + val,
    0
  );
  const netProfit = totalIncome - totalExpense;

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
            Báo cáo Thu - Chi
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

        {/* Tổng quan thu chi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">Tổng thu</h3>
            <p className="text-2xl font-semibold text-green-600">
              {totalIncome.toLocaleString()} VND
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">Tổng chi</h3>
            <p className="text-2xl font-semibold text-red-600">
              {totalExpense.toLocaleString()} VND
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">
              Lợi nhuận ròng
            </h3>
            <p
              className={`text-2xl font-semibold ${
                netProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {netProfit.toLocaleString()} VND
            </p>
          </div>
        </div>

        {/* Bảng tổng hợp thu chi */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Tổng hợp Thu - Chi
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                    Thời gian
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                    Thu nhập (VND)
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                    Chi phí (VND)
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                    Lợi nhuận (VND)
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleData[filter].labels.map((label, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-600">{label}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">
                      {sampleData[filter].income[index].toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">
                      {sampleData[filter].expense[index].toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">
                      {(
                        sampleData[filter].income[index] -
                        sampleData[filter].expense[index]
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Dòng tổng cộng */}
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="py-3 px-4 text-sm text-gray-800">Tổng cộng</td>
                  <td className="py-3 px-4 text-sm text-gray-800 text-right">
                    {totalIncome.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 text-right">
                    {totalExpense.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 text-right">
                    {netProfit.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Bảng chi tiết giao dịch */}
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Chi tiết giao dịch
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Ngày
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Mô tả
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Loại
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                  Số tiền (VND)
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleData[filter].transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === "Thu"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {transaction.amount.toLocaleString()}
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

export default IncomeReport;
