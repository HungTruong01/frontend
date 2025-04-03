import { partnersTableData, partnerColumns } from "@/data/partnerTableData";
import { listPostData, listPostColumns } from "@/data/index";
import { orderTableData, orderColumns } from "@/data/orderList";
import { invoiceTableData, invoiceColumns } from "@/data/invoiceTableData";
import { paymentTableData, paymentColumns } from "@/data/paymentTableData";
import { productTableData, productColumns } from "@/data/productTableData";
import {
  warehouseTransactions,
  warehouseTransactionColumns,
} from "@/data/warehouseTransactionData";
import { inventoryProducts, inventoryColumns } from "@/data/inventoryProduct";
import {
  adjustmentsTableData,
  adjustmentColumns,
} from "@/data/adjustInventory";
export const tableConfig = {
  "posts-list": {
    title: "Danh sách bài đăng",
    tableData: listPostData,
    columns: listPostColumns,
  },
  "partner-list": {
    title: "Danh sách đối tác",
    tableData: partnersTableData,
    columns: partnerColumns,
  },
  "order-management": {
    title: "Quản lý đơn hàng",
    tableData: orderTableData,
    columns: orderColumns,
  },
  "receipt-management": {
    title: "Quản lý hoá đơn",
    tableData: invoiceTableData,
    columns: invoiceColumns,
  },
  "payment-management": {
    title: "Quản lý phiếu chi",
    tableData: paymentTableData,
    columns: paymentColumns,
  },
  "product-management": {
    title: "Quản lý sản phẩm",
    tableData: productTableData,
    columns: productColumns,
  },
  "warehouse-transaction": {
    title: "Giao dịch kho",
    tableData: warehouseTransactions,
    columns: warehouseTransactionColumns,
  },
  "adjust-inventory": {
    title: "Điều chỉnh tồn kho",
    tableData: adjustmentsTableData,
    columns: adjustmentColumns,
  },
  "inventory-products": {
    title: "Sản phẩm tồn kho",
    tableData: inventoryProducts,
    columns: inventoryColumns,
  },
  reports: {
    title: "Báo cáo thống kê",
    tableData: [],
    columns: ["id", "reportId"],
  },
};

export default tableConfig;
