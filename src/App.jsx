import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/LandingPage/Home";
import About from "./pages/LandingPage/About";
import Service from "./pages/LandingPage/Service";
import Products from "./pages/LandingPage/Products";

import DashBoardHome from "./pages/Dashboard/DashBoardHome";

import AccountList from "./pages/Dashboard/system/AccountList";
import RoleUser from "./pages/Dashboard/system/RoleUser";

import TypeProduct from "./pages/Dashboard/TypeProduct";
import UnitPage from "./pages/Dashboard/UnitPage";
import TypePartner from "./pages/Dashboard/TypePartner";
import TypeOrder from "./pages/Dashboard/TypeOrder";
import OrderStatus from "./pages/Dashboard/OrderStatus";
import ReasonInventoryAdjust from "./pages/Dashboard/ReasonInventoryAdjust";
import TypeTransactionWareHouse from "./pages/Dashboard/TypeTransactionWareHouse";
import ListPost from "./pages/Dashboard/ListPost";
import ListProduct from "./pages/Dashboard/warehouse/ListProduct";
import OverviewDashboard from "./pages/Dashboard/OverviewDashboard";

import ListWarehouse from "./pages/Dashboard/ListWarehouse";
import WarehouseTransaction from "./pages/Dashboard/warehouse/WarehouseTransaction";
import InventoryProduct from "./pages/Dashboard/warehouse/InventoryProduct";

import RevenueReport from "./pages/Dashboard/reports/RevenueReport";
import IncomeReport from "./pages/Dashboard/reports/IncomeReport";
import DebtReport from "./pages/Dashboard/reports/DebtReport";

import LoginPage from "./pages/auth/LoginPage";
import AdjustInventory from "./pages/Dashboard/warehouse/AdjustInventory";

import ListPartner from "./pages/Dashboard/bussiness/ListPartner";
import ListOrder from "./pages/Dashboard/bussiness/ListOrder";
import AddOrder from "./pages/Dashboard/bussiness/AddOrder";
import EditOrder from "./pages/Dashboard/bussiness/EditOrder";
import InvoiceList from "./pages/Dashboard/bussiness/InvoiceList";
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
        <Route path="posts-list" element={<ListPost />} />

        <Route path="business/partner-list" element={<ListPartner />} />
        <Route path="business/order-management" element={<ListOrder />} />
        <Route path="bussiness/add-order" element={<AddOrder />} />
        <Route path="business/order-management/edit" element={<EditOrder />} />
        <Route path="business/invoice-management" element={<InvoiceList />} />
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
      </Route>
    </Routes>
  );
};

export default App;
