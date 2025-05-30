import { Navigate } from 'react-router-dom';
import { getRole } from '@/api/authService';

const PrivateRoute = ({ children, menuName, subMenuName }) => {
  const role = getRole();

  // Cho phép ROLE_ADMIN và ROLE_ADMIN_BGD truy cập tất cả
  if (role === "ROLE_ADMIN" || role === "ROLE_ADMIN_BLD") {
    return children;
  }

  const canAccess = () => {
    switch (menuName) {
      case "Hệ thống":
        return false;
      case "Kinh doanh":
        // Kiểm tra submenu Hóa đơn
        if (subMenuName === "Hóa đơn") {
          return role === "ROLE_ADMIN_TCKT";
        }
        return role === "ROLE_ADMIN_KD";
      case "Danh mục":
      case "Quảng bá":
        return role === "ROLE_ADMIN_KD";
      case "Kho":
        return role === "ROLE_ADMIN_K";
      case "Tổng quan":
      case "Báo cáo":
        return role === "ROLE_ADMIN_TCKT";
      default:
        return true;
    }
  };

  if (!canAccess()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;