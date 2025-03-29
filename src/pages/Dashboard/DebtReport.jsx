import React, { useState } from "react";
import { FaDownload, FaFilter } from "react-icons/fa";

const DebtReport = () => {
  const [filter, setFilter] = useState("all"); // Bộ lọc: tất cả, nợ phải thu, nợ phải trả
  const [timeRange, setTimeRange] = useState("2025"); // Phạm vi thời gian

  // Dữ liệu mẫu (có thể thay bằng dữ liệu từ API)
  const sampleData = {
    receivables: [
      {
        id: 1,
        partner: "Công ty A",
        amount: 5000000,
        dueDate: "15/04/2025",
        status: "Chưa thanh toán",
      },
      {
        id: 2,
        partner: "Công ty B",
        amount: 3000000,
        dueDate: "20/03/2025",
        status: "Quá hạn",
      },
    ],
    payables: [
      {
        id: 3,
        partner: "Nhà cung cấp X",
        amount: 4000000,
        dueDate: "10/04/2025",
        status: "Chưa thanh toán",
      },
      {
        id: 4,
        partner: "Nhà cung cấp Y",
        amount: 2000000,
        dueDate: "25/04/2025",
        status: "Chưa thanh toán",
      },
    ],
  };

  // Tính tổng công nợ
  const totalReceivables = sampleData.receivables.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalPayables = sampleData.payables.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const netDebt = totalReceivables - totalPayables;

  // Dữ liệu bảng theo bộ lọc
  const filteredData =
    filter === "all"
      ? [...sampleData.receivables, ...sampleData.payables]
      : filter === "receivables"
      ? sampleData.receivables
      : sampleData.payables;

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
            Báo cáo Công nợ
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
                <option value="all">Tất cả</option>
                <option value="receivables">Nợ phải thu</option>
                <option value="payables">Nợ phải trả</option>
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

        {/* Tổng quan công nợ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mbzana-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">Nợ phải thu</h3>
            <p className="text-2xl font-semibold text-green-600">
              {totalReceivables.toLocaleString()} VND
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">Nợ phải trả</h3>
            <p className="text-2xl font-semibold text-red-600">
              {totalPayables.toLocaleString()} VND
            </p>
          </div>
          {/* <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">Công nợ ròng</h3>
            <p
              className={`text-2xl font-semibold ${
                netDebt >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {netDebt.toLocaleString()} VND
            </p>
          </div> */}
        </div>

        {/* Bảng tổng hợp công nợ */}
        <div className="mb-8 mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                    Loại công nợ
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                    Số tiền (VND)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    Nợ phải thu
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {totalReceivables.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    Nợ phải trả
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {totalPayables.toLocaleString()}
                  </td>
                </tr>
              </tbody>
              {/* Dòng tổng cộng */}
              {/* <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="py-3 px-4 text-sm text-gray-800">
                    Công nợ ròng
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 text-right">
                    {netDebt.toLocaleString()}
                  </td>
                </tr>
              </tfoot> */}
            </table>
          </div>
        </div>

        {/* Bảng chi tiết công nợ */}
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Chi tiết Công nợ
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Đối tác
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                  Số tiền (VND)
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Ngày đáo hạn
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((debt) => (
                <tr
                  key={debt.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {debt.partner}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {debt.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {debt.dueDate}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        debt.status === "Chưa thanh toán"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {debt.status}
                    </span>
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

export default DebtReport;
