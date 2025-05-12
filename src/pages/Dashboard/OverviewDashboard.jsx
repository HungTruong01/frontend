import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaBox,
  FaDollarSign,
  FaTruck,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { getAllOrders } from "@/api/orderApi";
import { analyzeWithCondition } from "@/api/orderApi";
import { partnerApi } from "@/api/partnerApi";
import { getAllWarehouseTransaction } from "@/api/warehouseTransactionApi";
import { getAllWarehouseTransactionType } from "@/api/warehouseTransactionTypeApi";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OverviewDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
  });

  const [warehouseTransactions, setWarehouseTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    warehouse: "all",
    type: "all",
    status: "all",
  });

  // Dữ liệu cho biểu đồ
  const [warehouseStats, setWarehouseStats] = useState({
    labels: ["Kho An Lão", "Kho Cát Hải"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#3B82F6", "#10B981"],
      },
    ],
  });

  const [transactionTypeStats, setTransactionTypeStats] = useState({
    labels: ["Nhập kho", "Xuất kho"],
    datasets: [
      {
        label: "Số lượng giao dịch",
        data: [0, 0],
        backgroundColor: ["#10B981", "#EF4444"],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();

        // Lấy dữ liệu doanh thu theo tháng
        const revenueResponse = await analyzeWithCondition(currentYear);
        const monthlyData = revenueResponse.content || [];

        // Lấy danh sách đơn hàng
        const ordersResponse = await getAllOrders(0, 100, "id", "desc");
        const orders = ordersResponse.content || [];

        // Lấy danh sách đối tác
        const partnersResponse = await partnerApi.getAllPartners(
          0,
          100,
          "id",
          "asc"
        );
        const partners = partnersResponse.content || [];

        // Lấy dữ liệu giao dịch kho
        const transactionsResponse = await getAllWarehouseTransaction(
          0,
          1000,
          "id",
          "desc"
        );
        const transactions = transactionsResponse.content;

        // Lấy danh sách loại giao dịch
        const typesResponse = await getAllWarehouseTransactionType();
        const transactionTypes = typesResponse.content;

        // Tính toán tổng doanh thu và lợi nhuận
        const totalRevenue = monthlyData.reduce(
          (sum, item) => sum + Number(item.revenue),
          0
        );
        const totalProfit = monthlyData.reduce(
          (sum, item) => sum + Number(item.profit),
          0
        );

        // Phân loại giao dịch nhập/xuất
        const importType = transactionTypes.find(
          (type) =>
            type.code === "IMPORT" || type.name?.toLowerCase().includes("nhập")
        );
        const exportType = transactionTypes.find(
          (type) =>
            type.code === "EXPORT" || type.name?.toLowerCase().includes("xuất")
        );

        // Tính toán số liệu thống kê
        const totalImports = transactions.filter(
          (t) => t.transactionTypeId === importType?.id
        ).length;
        const totalExports = transactions.filter(
          (t) => t.transactionTypeId === exportType?.id
        ).length;
        const anLaoTransactions = transactions.filter(
          (t) => t.warehouseId === 1
        ).length;
        const catHaiTransactions = transactions.filter(
          (t) => t.warehouseId === 2
        ).length;
        const pendingTransactions = transactions.filter(
          (t) => t.statusId === 2
        ).length;

        // Cập nhật state
        setStats({
          totalRevenue,
          totalProfit,
          totalTransactions: transactions.length,
          pendingTransactions,
        });

        // Cập nhật dữ liệu biểu đồ
        setWarehouseStats({
          labels: ["Kho An Lão", "Kho Cát Hải"],
          datasets: [
            {
              data: [anLaoTransactions, catHaiTransactions],
              backgroundColor: ["#3B82F6", "#10B981"],
            },
          ],
        });

        setTransactionTypeStats({
          labels: ["Nhập kho", "Xuất kho"],
          datasets: [
            {
              label: "Số lượng giao dịch",
              data: [totalImports, totalExports],
              backgroundColor: ["#10B981", "#EF4444"],
            },
          ],
        });

        // Cập nhật danh sách giao dịch kho
        const warehouseTransactionsData = transactions.map((transaction) => {
          const type = transactionTypes.find(
            (t) => t.id === transaction.transactionTypeId
          );
          return {
            id: transaction.id,
            orderCode: transaction.orderCode || `DH${transaction.orderId}`,
            type: type?.name || "Không xác định",
            date: new Date(transaction.createdAt).toLocaleDateString("vi-VN"),
            status:
              transaction.statusId === 1
                ? "Hoàn thành"
                : transaction.statusId === 2
                ? "Đang xử lý"
                : "Không thành công",
            warehouse:
              transaction.warehouseId === 1
                ? "Kho An Lão"
                : transaction.warehouseId === 2
                ? "Kho Cát Hải"
                : "Không xác định",
            participant: transaction.participant || "Không xác định",
          };
        });
        setWarehouseTransactions(warehouseTransactionsData);
        setFilteredTransactions(warehouseTransactionsData);

        // Cập nhật danh sách đơn hàng gần đây
        const recentOrdersData = orders.slice(0, 3).map((order) => {
          const partner = partners.find((p) => p.id === order.partnerId);
          return {
            id: order.id,
            customer: partner?.name || "Không xác định",
            total: order.totalMoney,
            status:
              order.orderStatusId === 1
                ? "Đã thanh toán"
                : order.orderStatusId === 2
                ? "Chưa thanh toán"
                : "Thanh toán một phần",
          };
        });
        setRecentOrders(recentOrdersData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    let filtered = [...warehouseTransactions];

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.orderCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.participant
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo kho
    if (filters.warehouse !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.warehouse === filters.warehouse
      );
    }

    // Lọc theo loại giao dịch
    if (filters.type !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.type === filters.type
      );
    }

    // Lọc theo trạng thái
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.status === filters.status
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filters, warehouseTransactions]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen w-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          {
            icon: <FaDollarSign className="text-blue-500 text-4xl" />,
            title: "Tổng doanh thu",
            value: `${stats.totalRevenue.toLocaleString("vi-VN")} VND`,
          },
          {
            icon: <FaChartLine className="text-green-500 text-4xl" />,
            title: "Tổng lợi nhuận",
            value: `${stats.totalProfit.toLocaleString("vi-VN")} VND`,
          },
          {
            icon: <FaBox className="text-yellow-500 text-4xl" />,
            title: "Tổng giao dịch kho",
            value: stats.totalTransactions,
          },
          {
            icon: <FaTruck className="text-red-500 text-4xl" />,
            title: "Giao dịch đang xử lý",
            value: stats.pendingTransactions,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow duration-300"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Phân bố giao dịch theo kho
          </h2>
          <div className="h-[300px] flex items-center justify-center">
            <Pie
              data={warehouseStats}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thống kê giao dịch theo loại
          </h2>
          <div className="h-[300px] flex items-center justify-center">
            <Bar
              data={transactionTypeStats}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Giao dịch kho gần đây
          </h2>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.warehouse}
                onChange={(e) =>
                  handleFilterChange("warehouse", e.target.value)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả kho</option>
                <option value="Kho An Lão">Kho An Lão</option>
                <option value="Kho Cát Hải">Kho Cát Hải</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="Nhập kho">Nhập kho</option>
                <option value="Xuất kho">Xuất kho</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Không thành công">Không thành công</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Mã đơn hàng
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Loại giao dịch
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Kho
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Người giao/nhận
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Ngày tạo
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-left">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.slice(0, 5).map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.orderCode}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.type}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.warehouse}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.participant}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === "Hoàn thành"
                          ? "bg-green-100 text-green-600"
                          : transaction.status === "Đang xử lý"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                    {order.total.toLocaleString("vi-VN")}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Đã thanh toán"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Thanh toán một phần"
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
