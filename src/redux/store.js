import { configureStore } from "@reduxjs/toolkit";
import orderSlice from "./slices/orderSlice";
import partnerSlice from "./slices/partnerSlice";
import productSlice from "./slices/productSlice";
import warehouseTransactionSlice from "./slices/warehouseTransactionSlice";
import deliveryStatus from "./slices/deliveryStatusSlice";
import invoiceSlice from "./slices/invoiceSlice";
import invoiceTypeSlice from "./slices/invoiceTypeSlice";
import warehouseSlice from "./slices/warehouseSlice";
import employeeSlice from "./slices/employeeSlice";
import transactionTypeSlice from "./slices/transactionTypeSlice";
const store = configureStore({
  reducer: {
    order: orderSlice,
    partner: partnerSlice,
    product: productSlice,
    warehouseTransaction: warehouseTransactionSlice,
    deliveryStatus: deliveryStatus,
    invoices: invoiceSlice,
    invoiceTypes: invoiceTypeSlice,
    warehouse: warehouseSlice,
    employee: employeeSlice,
    transactionType: transactionTypeSlice,
  },
});

export default store;
