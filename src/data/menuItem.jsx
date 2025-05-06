import {
  FiBox,
  FiClipboard,
  FiUsers,
  FiShoppingCart,
  FiTag,
  FiTool,
  FiPackage,
  FiRepeat,
  FiDollarSign,
  FiCreditCard,
  FiArchive,
} from "react-icons/fi";
import {
  FaServer,
  FaChartLine,
  FaWarehouse,
  FaChartBar,
  FaHandshake,
  FaTable,
  FaBoxes,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaBalanceScale,
  FaRegNewspaper,
} from "react-icons/fa";
import { TbTruckDelivery, TbInvoice } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import {
  MdAccountCircle,
  MdManageAccounts,
  MdListAlt,
  MdHome,
} from "react-icons/md";
const iconStyles = {
  className: "w-5 h-5 text-inherit",
};
const menuItem = [
  {
    icon: <MdHome {...iconStyles} />,
    name: "Tổng quan",
    path: "/dashboard",
  },
  {
    icon: <FaServer {...iconStyles} />,
    name: "Hệ thống",
    path: "/dashboard/system",
    subpages: [
      {
        name: "Tài khoản",
        path: "/dashboard/system/account",
        icon: <MdAccountCircle {...iconStyles} />,
      },
      {
        name: "Vai trò",
        path: "/dashboard/system/role",
        icon: <MdManageAccounts {...iconStyles} />,
      },
    ],
  },
  {
    icon: <FaTable {...iconStyles} />,
    name: "Danh mục",
    path: "/dashboard/categories",
    subpages: [
      {
        name: "Danh sách nhân viên",
        path: "/dashboard/categories/list-employees",
        icon: <FaUsers {...iconStyles} />,
      },
      {
        name: "Loại sản phẩm",
        path: "/dashboard/categories/type-products",
        icon: <FiBox {...iconStyles} />,
      },
      {
        name: "Đơn vị tính",
        path: "/dashboard/categories/unit",
        icon: <FiClipboard {...iconStyles} />,
      },
      {
        name: "Loại hoá đơn",
        path: "/dashboard/categories/invoice-type",
        icon: <TbInvoice {...iconStyles} />,
      },
      {
        name: "Loại đối tác",
        path: "/dashboard/categories/partner",
        icon: <FiUsers {...iconStyles} />,
      },

      {
        name: "Loại đơn hàng",
        path: "/dashboard/categories/order",
        icon: <FiShoppingCart {...iconStyles} />,
      },
      {
        name: "Trạng thái đơn hàng",
        path: "/dashboard/categories/order-status",
        icon: <FiTag {...iconStyles} />,
      },
      {
        name: "Lý do điều chỉnh kho",
        path: "/dashboard/categories/reason-for-inventory-adjustment",
        icon: <FiTool {...iconStyles} />,
      },
      {
        name: "Kho bãi",
        path: "/dashboard/categories/warehouse",
        icon: <FiPackage {...iconStyles} />,
      },
      {
        name: "Loại giao dịch kho",
        path: "/dashboard/categories/warehouse-transaction-type",
        icon: <FiRepeat {...iconStyles} />,
      },
      {
        name: "Trạng thái vận chuyển",
        path: "/dashboard/categories/delivery-status",
        icon: <TbTruckDelivery {...iconStyles} />,
      },
    ],
  },
  {
    icon: <MdListAlt {...iconStyles} />,
    name: "Quảng bá",
    path: "/dashboard/posts",
    subpages: [
      {
        name: "Bài đăng",
        path: "/dashboard/posts/post-list",
        icon: <FaRegNewspaper {...iconStyles} />,
      },
      // {
      //   name: "Dịch vụ",
      //   path: "/dashboard/business/services",
      //   icon: <FiShoppingCart {...iconStyles} />,
      // },
    ],
  },
  {
    icon: <FaChartLine {...iconStyles} />,
    name: "Kinh doanh",
    path: "/dashboard/business",
    subpages: [
      {
        name: "Danh sách đối tác",
        path: "/dashboard/business/partner-list",
        icon: <FaHandshake {...iconStyles} />,
      },
      {
        name: "Đơn hàng",
        path: "/dashboard/business/order-management",
        icon: <FiShoppingCart {...iconStyles} />,
      },
      {
        name: "Hoá đơn",
        path: "/dashboard/business/invoice-management",
        icon: <FiDollarSign {...iconStyles} />,
      },
    ],
  },
  {
    icon: <FaWarehouse {...iconStyles} />,
    name: "Kho",
    path: "/dashboard/warehouse",
    subpages: [
      {
        name: "Sản phẩm",
        path: "/dashboard/warehouse/product-management",
        icon: <FaBoxes {...iconStyles} />,
      },
      {
        name: "Giao dịch kho",
        path: "/dashboard/warehouse/warehouse-transaction",
        icon: <FaExchangeAlt {...iconStyles} />,
      },
      {
        name: "Chuyển kho",
        path: "/dashboard/warehouse/warehouse-transfer",
        icon: <TbTruckDelivery {...iconStyles} />,
      },
      {
        name: "Điều chỉnh tồn kho",
        path: "/dashboard/warehouse/adjust-inventory",
        icon: <FaExclamationTriangle {...iconStyles} />,
      },
      {
        name: "Tồn kho",
        path: "/dashboard/warehouse/inventory-products",
        icon: <FiArchive {...iconStyles} />,
      },
    ],
  },
  {
    icon: <FaChartBar {...iconStyles} />,
    name: "Báo cáo",
    path: "/dashboard/reports",
    subpages: [
      {
        name: "Doanh thu - lợi nhuận",
        path: "/dashboard/reports/revenue-report",
        icon: <FaChartLine {...iconStyles} />,
      },
      {
        name: "Thu chi",
        path: "/dashboard/reports/income-and-expenditure-report",
        icon: <FiDollarSign {...iconStyles} />,
      },
      {
        name: "Công nợ",
        path: "/dashboard/reports/debt-report",
        icon: <FaBalanceScale {...iconStyles} />,
      },
    ],
  },
];
export default menuItem;
