import React from "react";
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
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
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
    <div className="bg-gray-50 min-h-screen w-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          {
            icon: <FaDollarSign className="text-blue-500 text-4xl" />,
            title: "Tổng doanh thu",
            value: `${stats.totalRevenue.toLocaleString()} VND`,
          },
          {
            icon: <FaChartLine className="text-green-500 text-4xl" />,
            title: "Tổng lợi nhuận",
            value: `${stats.totalProfit.toLocaleString()} VND`,
          },
          {
            icon: <FaBox className="text-yellow-500 text-4xl" />,
            title: "Tổng đơn hàng",
            value: stats.totalOrders,
          },
          {
            icon: <FaTruck className="text-red-500 text-4xl" />,
            title: "Đơn chờ xử lý",
            value: stats.pendingShipments,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4"
          >
            {stat.icon}
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {stat.title}
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Doanh thu theo tháng (2025)
        </h2>
        <Line data={revenueData} options={chartOptions} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Đơn hàng gần đây
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
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
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
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
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
