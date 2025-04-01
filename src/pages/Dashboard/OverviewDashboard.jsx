import React, { useState } from "react";
import { FaChartLine, FaBox, FaDollarSign, FaTruck } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const OverviewDashboard = () => {
  const stats = {
    totalRevenue: 70000000,
    totalProfit: 21000000,
    totalOrders: 120,
    pendingShipments: 15,
  };

  const revenueData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3"],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: [5000000, 6000000, 5500000],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Doanh thu (VND)" },
      },
      x: { title: { display: true, text: "Thời gian" } },
    },
  };

  // Dữ liệu đơn hàng gần đây
  const recentOrders = [
    { id: "ORD001", customer: "Công ty A", total: 1500000, status: "Đã giao" },
    {
      id: "ORD002",
      customer: "Công ty B",
      total: 2000000,
      status: "Đang xử lý",
    },
    {
      id: "ORD003",
      customer: "Công ty C",
      total: 1800000,
      status: "Chờ vận chuyển",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaDollarSign className="text-blue-500 text-3xl mr-4" />
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Tổng doanh thu
            </h3>
            <p className="text-2xl font-semibold text-gray-800">
              {stats.totalRevenue.toLocaleString()} VND
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaChartLine className="text-green-500 text-3xl mr-4" />
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Tổng lợi nhuận
            </h3>
            <p className="text-2xl font-semibold text-gray-800">
              {stats.totalProfit.toLocaleString()} VND
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaBox className="text-yellow-500 text-3xl mr-4" />
          <div>
            <h3 className="text-sm font-medium text-gray-600">Tổng đơn hàng</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {stats.totalOrders}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaTruck className="text-red-500 text-3xl mr-4" />
          <div>
            <h3 className="text-sm font-medium text-gray-600">Đơn chờ xử lý</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {stats.pendingShipments}
            </p>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Doanh thu theo tháng (2025)
        </h2>
        <Line data={revenueData} options={chartOptions} />
      </div>

      {/* Bảng đơn hàng gần đây */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Đơn hàng gần đây
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Mã đơn hàng
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Khách hàng
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                  Tổng tiền (VND)
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {order.customer}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {order.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Đã giao"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Đang xử lý"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status}
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

export default OverviewDashboard;
