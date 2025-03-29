import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/LandingPage/Home";
import About from "./pages/LandingPage/About";
import Service from "./pages/LandingPage/Service";
import Products from "./pages/LandingPage/Products";
import DashBoardHome from "./pages/Dashboard/DashBoardHome";
import AccountList from "./pages/Dashboard/AccountList";
import RoleUser from "./pages/Dashboard/RoleUser";
import TypeProduct from "./pages/Dashboard/TypeProduct";
import UnitPage from "./pages/Dashboard/UnitPage";
import TypePartner from "./pages/Dashboard/TypePartner";
import TypeOrder from "./pages/Dashboard/TypeOrder";
import OrderStatus from "./pages/Dashboard/OrderStatus";
import ReasonInventoryAdjust from "./pages/Dashboard/ReasonInventoryAdjust";
import ListWarehouse from "./pages/Dashboard/ListWarehouse";
import TypeTransactionWareHouse from "./pages/Dashboard/TypeTransactionWareHouse";
import ListPost from "./pages/Dashboard/ListPost";
import ListPartner from "./pages/Dashboard/ListPartner";
import ListOrder from "./pages/Dashboard/ListOrder";
import ListReceipt from "./pages/Dashboard/ListReceipt";
import ListPayment from "./pages/Dashboard/ListPayment";
import ListProduct from "./pages/Dashboard/ListProduct";
import WarehouseTransaction from "./pages/Dashboard/WarehouseTransaction";
import InventoryProduct from "./pages/Dashboard/InventoryProduct";
import RevenueReport from "./pages/Dashboard/RevenueReport";
import OverviewDashboard from "./pages/Dashboard/OverviewDashboard";
import IncomeReport from "./pages/Dashboard/IncomeReport";
import DebtReport from "./pages/Dashboard/DebtReport";
import LoginPage from "./pages/auth/LoginPage";
import AdjustInventory from "./pages/Dashboard/AdjustInventory";
import AddOrder from "./pages/Dashboard/AddOrder";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/service" element={<Service />} />
      <Route path="/products" element={<Products />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashBoardHome />}>
        <Route index element={<OverviewDashboard />} />
        <Route path="system/account" element={<AccountList />} />
        <Route path="system/role" element={<RoleUser />} />
        <Route path="categories/type-products" element={<TypeProduct />} />
        <Route path="categories/unit" element={<UnitPage />} />
        <Route path="categories/partner" element={<TypePartner />} />
        <Route path="categories/order" element={<TypeOrder />} />
        <Route path="categories/order-status" element={<OrderStatus />} />
        <Route
          path="categories/reason-for-inventory-adjustment"
          element={<ReasonInventoryAdjust />}
        />
        <Route path="categories/warehouse" element={<ListWarehouse />} />
        <Route
          path="categories/warehouse-transaction-type"
          element={<TypeTransactionWareHouse />}
        />
        <Route path="posts" element={<ListPost />} />
        <Route path="business/partner-list" element={<ListPartner />} />
        <Route path="business/order-management" element={<ListOrder />} />
        <Route path="business/receipt-management" element={<ListReceipt />} />
        <Route path="business/payment-management" element={<ListPayment />} />
        <Route path="warehouse/product-management" element={<ListProduct />} />
        <Route
          path="warehouse/warehouse-transaction"
          element={<WarehouseTransaction />}
        />
        <Route
          path="warehouse/inventory-products"
          element={<InventoryProduct />}
        />
        <Route
          path="warehouse/adjust-inventory"
          element={<AdjustInventory />}
        />
        <Route path="reports/revenue-report" element={<RevenueReport />} />
        <Route
          path="reports/income-and-expenditure-report"
          element={<IncomeReport />}
        />
        <Route path="reports/debt-report" element={<DebtReport />} />
        <Route path="add-order" element={<AddOrder />} />
      </Route>
    </Routes>
  );
};

export default App;
