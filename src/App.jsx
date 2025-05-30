import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import About from "@/pages/LandingPage/About";
import Home from "@/pages/LandingPage/Home";
import NewDetail from "@/pages/LandingPage/NewDetail";
import News from "@/pages/LandingPage/News";
import Products from "@/pages/LandingPage/Products";
import Service from "@/pages/LandingPage/Service";

import DashBoardHome from "@/pages/Dashboard/DashBoardHome";

import AccountList from "@/pages/Dashboard/system/AccountList";
import RoleUser from "@/pages/Dashboard/system/RoleUser";

import ListPost from "@/pages/Dashboard/ListPost";
import OrderStatus from "@/pages/Dashboard/categories/OrderStatus";
import OverviewDashboard from "@/pages/Dashboard/OverviewDashboard";
import ReasonInventoryAdjust from "@/pages/Dashboard/categories/ReasonInventoryAdjust";
import TypeOrder from "@/pages/Dashboard/categories/TypeOrder";
import TypePartner from "@/pages/Dashboard/categories/TypePartner";
import TypeProduct from "@/pages/Dashboard/categories/TypeProduct";
import TypeTransactionWareHouse from "@/pages/Dashboard/categories/TypeTransactionWareHouse";
import ListProduct from "@/pages/Dashboard/warehouse/ListProduct";
import UnitPage from "@/pages/Dashboard/categories/UnitPage";
import ListEmployees from "@/pages/Dashboard/categories/ListEmployees";

import ListWarehouse from "@/pages/Dashboard/categories/ListWarehouse";
import InventoryProduct from "@/pages/Dashboard/warehouse/InventoryProduct";
import WarehouseTransaction from "@/pages/Dashboard/warehouse/WarehouseTransaction";
import WarehouseTransactionDetail from "@/pages/Dashboard/warehouse/WarehouseTransactionDetail";
import WarehouseTransfer from "@/pages/Dashboard/warehouse/WarehouseTransfer";
import WarehouseTransferDetail from "@/pages/Dashboard/warehouse/WarehouseTransferDetail";
import AdjustInventory from "@/pages/Dashboard/warehouse/AdjustInventory";
import AdjustInventoryDetail from "@/pages/Dashboard/warehouse/AdjustInventoryDetail";
import ImportBatch from "@/pages/Dashboard/warehouse/ImportBatch";

import ListOrder from "@/pages/Dashboard/bussiness/ListOrder";
import ListPartner from "@/pages/Dashboard/bussiness/ListPartner";
import DebtReport from "@/pages/Dashboard/reports/DebtReport";
import IncomeReport from "@/pages/Dashboard/reports/IncomeReport";
import RevenueReport from "@/pages/Dashboard/reports/RevenueReport";

import LoginPage from "@/pages/auth/LoginPage";
import InvoiceType from "@/pages/Dashboard/categories/InvoiceType";
import DeliveryStatus from "@/pages/Dashboard/categories/DeliveryStatus";

import OrderForm from "@/components/Dashboard/order/OrderForm";
import ListInvoice from "@/pages/Dashboard/bussiness/ListInvoice";
import { isUserLoggedIn } from "@/api/authService";
import Config from "@/pages/Dashboard/system/Config";
import ConfigPage from "@/pages/Dashboard/ConfigPage";
import PrivateRoute from "./utils/PrivateRoute";

// Component để bảo vệ các route
function AuthenticatedRoute({ children }) {
  const isAuth = isUserLoggedIn();
  if (isAuth) {
    return children;
  }
  return <Navigate to="/login" />; // Redirect về trang login nếu chưa đăng nhập
}

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/products" element={<Products />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewDetail />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute>
              <DashBoardHome />
            </AuthenticatedRoute>
          }
        >
          <Route index element={<OverviewDashboard />} />
          <Route
            path="system/account"
            element={
              <PrivateRoute menuName="Hệ thống">
                <AccountList />
              </PrivateRoute>
            }
          />
          <Route
            path="system/role"
            element={
              <PrivateRoute menuName="Hệ thống">
                <RoleUser />
              </PrivateRoute>
            }
          />
          <Route
            path="system/config"
            element={
              <PrivateRoute menuName="Hệ thống">
                <ConfigPage />
              </PrivateRoute>
            }
          />
          <Route
            path="categories/list-employees"
            element={
              <PrivateRoute menuName="Danh mục">
                <ListEmployees />
              </PrivateRoute>
            }
          />

          <Route
            path="categories/type-products"
            element={
              <PrivateRoute menuName="Danh mục">
                <TypeProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="categories/unit"
            element={
              <PrivateRoute menuName="Danh mục">
                <UnitPage />
              </PrivateRoute>
            }
          />
          <Route
            path="categories/partner"
            element={
              <PrivateRoute menuName="Danh mục">
                <TypePartner />
              </PrivateRoute>
            }
          />
          <Route
            path="categories/order"
            element={
              <PrivateRoute menuName="Danh mục">
                <TypeOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="categories/order-status"
            element={
              <PrivateRoute menuName="Danh mục">
                <OrderStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="categories/invoice-type"
            element={
              <PrivateRoute menuName="Danh mục">
                <InvoiceType />
              </PrivateRoute>
            }
          />
          <Route
            path="categories/reason-for-inventory-adjustment"
            element={
              <PrivateRoute menuName="Danh mục">
                <ReasonInventoryAdjust />
              </PrivateRoute>
            }
          />
          <Route path="categories/warehouse" element={<ListWarehouse />} />
          <Route
            path="categories/warehouse-transaction-type"
            element={
              <PrivateRoute menuName="Danh mục">
                <TypeTransactionWareHouse />
              </PrivateRoute>
            }
          />
          <Route
            path="categories/delivery-status"
            element={
              <PrivateRoute menuName="Danh mục">
                <DeliveryStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="posts/post-list"
            element={
              <PrivateRoute menuName="Quảng bá">
                <ListPost />
              </PrivateRoute>
            }
          />
          <Route
            path="business/partner-list"
            element={
              <PrivateRoute menuName="Kinh doanh">
                <ListPartner />
              </PrivateRoute>
            }
          />
          <Route
            path="business/order-management"
            element={
              <PrivateRoute menuName="Kinh doanh">
                <ListOrder />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/business/order-management/create"
            element={
              <PrivateRoute menuName="Kinh doanh">
                <OrderForm mode="add" />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/business/order-management/edit/:id"
            element={
              <PrivateRoute menuName="Kinh doanh">
                <OrderForm mode="edit" />
              </PrivateRoute>
            }
          />
          <Route
            path="business/invoice-management"
            element={
              <PrivateRoute menuName="Kinh doanh">
                <ListInvoice />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse/product-management"
            element={
              <PrivateRoute menuName="Kho">
                <ListProduct />
              </PrivateRoute>
            }
          />
          <Route path="warehouse/import-products" element={<ImportBatch />} />
          <Route
            path="warehouse/warehouse-transaction"
            element={
              <PrivateRoute menuName="Kho">
                <WarehouseTransaction />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse/warehouse-transaction-detail/:transactionId"
            element={
              <PrivateRoute menuName="Kho">
                <WarehouseTransactionDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse/inventory-products"
            element={
              <PrivateRoute menuName="Kho">
                <InventoryProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse/adjust-inventory"
            element={
              <PrivateRoute menuName="Kho">
                <AdjustInventory />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="warehouse/adjust-inventory-detail/:id"
            element={<InventoryAdjustmentDetail />}
          /> */}

          <Route
            path="warehouse/warehouse-transfer"
            element={
              <PrivateRoute menuName="Kho">
                <WarehouseTransfer />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse/warehouse-transfer/:transferId"
            element={
              <PrivateRoute menuName="Kho">
                <WarehouseTransferDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse/inventory-products"
            element={
              <PrivateRoute menuName="Kho">
                <InventoryProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse/adjust-inventory"
            element={
              <PrivateRoute menuName="Kho">
                <AdjustInventory />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse/adjust-inventory/:adjustmentId"
            element={
              <PrivateRoute menuName="Kho">
                <AdjustInventoryDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="reports/revenue-report"
            element={
              <PrivateRoute menuName="Báo cáo">
                <RevenueReport />
              </PrivateRoute>
            }
          />
          <Route
            path="reports/income-and-expenditure-report"
            element={
              <PrivateRoute menuName="Báo cáo">
                <IncomeReport />
              </PrivateRoute>
            }
          />
          <Route
            path="reports/debt-report"
            element={
              <PrivateRoute menuName="Báo cáo">
                <DebtReport />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
