import { usersTableData, userColumns } from "@/data/userTableData";
import { accountsTableData, accountColumns } from "@/data/accountsTableData";
import {
  partnerTypesTableData,
  partnerTypeColumns,
} from "@/data/partnerTypesTableData";
import { partnersTableData, partnerColumns } from "@/data/partnerTableData";
import {
  productTypesTableData,
  productTypeColumns,
} from "@/data/productTypesTableData";
import { unitsTableData, unitColumns } from "@/data/unitsTableData";
import {
  inventoryAdjustmentReasonsTableData,
  inventoryAdjustmentReasonColumns,
} from "@/data/inventoryAdjustmentReasonsTableData";
import {
  warehousesTableData,
  warehouseColumns,
} from "@/data/warehousesTableData";
import {
  warehouseTransactionTypesTableData,
  warehouseTransactionTypeColumns,
} from "@/data/warehouseTransactionTypesTableData";
import {
  orderStatusesTableData,
  orderStatusColumns,
} from "@/data/orderStatusesTableData";
import {
  orderTypesTableData,
  orderTypeColumns,
} from "@/data/orderTypesTableData";
import { listPostData, listPostColumns } from "@/data/index";
import { orderTableData, orderColumns } from "@/data/orderList";
import { receiptTableData, receiptColumns } from "@/data/invoiceTableData";
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
  account: {
    title: "Quản lý tài khoản",
    tableData: accountsTableData,
    columns: accountColumns,
  },
  role: {
    title: "Phân quyền",
    tableData: usersTableData,
    columns: userColumns,
  },
  "type-products": {
    title: "Loại sản phẩm",
    tableData: productTypesTableData,
    columns: productTypeColumns,
  },
  unit: {
    title: "Đơn vị tính",
    tableData: unitsTableData,
    columns: unitColumns,
  },
  partner: {
    title: "Loại đối tác",
    tableData: partnerTypesTableData,
    columns: partnerTypeColumns,
  },
  order: {
    title: "Loại đơn hàng",
    tableData: orderTypesTableData,
    columns: orderTypeColumns,
  },
  "order-status": {
    title: "Trạng thái đơn hàng",
    tableData: orderStatusesTableData,
    columns: orderStatusColumns,
  },
  "reason-for-inventory-adjustment": {
    title: "Lý do điều chỉnh kho",
    tableData: inventoryAdjustmentReasonsTableData,
    columns: inventoryAdjustmentReasonColumns,
  },
  warehouse: {
    title: "Kho bãi",
    tableData: warehousesTableData,
    columns: warehouseColumns,
  },
  "warehouse-transaction-type": {
    title: "Loại giao dịch kho",
    tableData: warehouseTransactionTypesTableData,
    columns: warehouseTransactionTypeColumns,
  },
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
    tableData: receiptTableData,
    columns: receiptColumns,
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
    title: "Quản lý giao dịch kho",
    tableData: warehouseTransactions,
    columns: warehouseTransactionColumns,
  },
  "adjust-inventory": {
    title: "Quản lý điều chỉnh tồn kho",
    tableData: adjustmentsTableData,
    columns: adjustmentColumns,
  },
  "inventory-products": {
    title: "Quản lý sản phẩm tồn kho",
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
