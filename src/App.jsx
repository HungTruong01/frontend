import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import About from "./pages/LandingPage/About";
import Home from "./pages/LandingPage/Home";
import NewDetail from "./pages/LandingPage/NewDetail";
import News from "./pages/LandingPage/News";
import Products from "./pages/LandingPage/Products";
import Service from "./pages/LandingPage/Service";

import DashBoardHome from "./pages/Dashboard/DashBoardHome";

import AccountList from "./pages/Dashboard/system/AccountList";
import RoleUser from "./pages/Dashboard/system/RoleUser";

import ListPost from "./pages/Dashboard/ListPost";
import OrderStatus from "./pages/Dashboard/OrderStatus";
import OverviewDashboard from "./pages/Dashboard/OverviewDashboard";
import ReasonInventoryAdjust from "./pages/Dashboard/ReasonInventoryAdjust";
import TypeOrder from "./pages/Dashboard/TypeOrder";
import TypePartner from "./pages/Dashboard/TypePartner";
import TypeProduct from "./pages/Dashboard/TypeProduct";
import TypeTransactionWareHouse from "./pages/Dashboard/TypeTransactionWareHouse";
import ListProduct from "./pages/Dashboard/warehouse/ListProduct";
import UnitPage from "./pages/Dashboard/UnitPage";

import ListWarehouse from "./pages/Dashboard/ListWarehouse";
import InventoryProduct from "./pages/Dashboard/warehouse/InventoryProduct";
import WarehouseTransaction from "./pages/Dashboard/warehouse/WarehouseTransaction";
import WarehouseTransactionDetail from "./pages/Dashboard/warehouse/WarehouseTransactionDetail";
import WarehouseTransfer from "./pages/Dashboard/warehouse/WarehouseTransfer";
import WarehouseTransferDetail from "./pages/Dashboard/warehouse/WarehouseTransferDetail";
import AdjustInventory from "./pages/Dashboard/warehouse/AdjustInventory";
import AdjustInventoryDetail from "./pages/Dashboard/warehouse/AdjustInventoryDetail";

import ListOrder from "./pages/Dashboard/bussiness/ListOrder";
import ListPartner from "./pages/Dashboard/bussiness/ListPartner";
import DebtReport from "./pages/Dashboard/reports/DebtReport";
import IncomeReport from "./pages/Dashboard/reports/IncomeReport";
import RevenueReport from "./pages/Dashboard/reports/RevenueReport";

import LoginPage from "./pages/auth/LoginPage";
import InvoiceType from "./pages/Dashboard/InvoiceType";
import DeliveryStatus from "./pages/Dashboard/DeliveryStatus";
import AddOrder from "./pages/Dashboard/bussiness/AddOrder";
import EditOrder from "./pages/Dashboard/bussiness/EditOrder";
import ListInvoice from "./pages/Dashboard/bussiness/ListInvoice";
import FormEditAccount from "./pages/Dashboard/system/FormEditAccount";
import ErrorPopup from "./components/Dashboard/ErrorPopUp";
import SuccessPopup from "./components/Dashboard/SuccessPopup";
import { isUserLoggedIn } from "./api/authService";

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
        <Route
          path="/news/food-logistics-optimization"
          element={<NewDetail />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/error" element={<ErrorPopup />} />
        <Route path="/success" element={<SuccessPopup />} />

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
          <Route path="system/account" element={<AccountList />} />
          <Route path="system/role" element={<RoleUser />} />
          <Route path="system/edit-account" element={<FormEditAccount />} />
          <Route path="categories/type-products" element={<TypeProduct />} />
          <Route path="categories/unit" element={<UnitPage />} />
          <Route path="categories/partner" element={<TypePartner />} />
          <Route path="categories/order" element={<TypeOrder />} />
          <Route path="categories/order-status" element={<OrderStatus />} />
          <Route path="categories/invoice-type" element={<InvoiceType />} />
          <Route
            path="categories/reason-for-inventory-adjustment"
            element={<ReasonInventoryAdjust />}
          />
          <Route path="categories/warehouse" element={<ListWarehouse />} />
          <Route
            path="categories/warehouse-transaction-type"
            element={<TypeTransactionWareHouse />}
          />
          <Route
            path="categories/delivery-status"
            element={<DeliveryStatus />}
          />
          <Route path="posts/post-list" element={<ListPost />} />
          <Route path="business/partner-list" element={<ListPartner />} />
          <Route path="business/order-management" element={<ListOrder />} />
          <Route path="bussiness/add-order" element={<AddOrder />} />
          <Route
            path="business/order-management/edit/:id"
            element={<EditOrder />}
          />
          <Route path="business/invoice-management" element={<ListInvoice />} />
          <Route
            path="warehouse/product-management"
            element={<ListProduct />}
          />
          <Route
            path="warehouse/warehouse-transaction"
            element={<WarehouseTransaction />}
          />
          <Route
            path="warehouse/warehouse-transaction-detail/:transactionId"
            element={<WarehouseTransactionDetail />}
          />
          <Route
            path="warehouse/inventory-products"
            element={<InventoryProduct />}
          />
          <Route
            path="warehouse/adjust-inventory"
            element={<AdjustInventory />}
          />
          {/* <Route
            path="warehouse/adjust-inventory-detail/:id"
            element={<InventoryAdjustmentDetail />}
          /> */}

          <Route
            path="warehouse/warehouse-transfer"
            element={<WarehouseTransfer />}
          />
          <Route
            path="warehouse/warehouse-transfer/:transferId"
            element={<WarehouseTransferDetail />}
          />
          <Route
            path="warehouse/inventory-products"
            element={<InventoryProduct />}
          />
          <Route
            path="warehouse/adjust-inventory"
            element={<AdjustInventory />}
          />
          <Route
            path="warehouse/adjust-inventory/:adjustmentId"
            element={<AdjustInventoryDetail />}
          />
          <Route path="reports/revenue-report" element={<RevenueReport />} />
          <Route
            path="reports/income-and-expenditure-report"
            element={<IncomeReport />}
          />
          <Route path="reports/debt-report" element={<DebtReport />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
