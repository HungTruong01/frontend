import { Navigate } from 'react-router-dom';
import { getRole } from '@/api/authService';

const PrivateRoute = ({ children, menuName }) => {
  const role = getRole();

  // Cho phép ROLE_ADMIN và ROLE_ADMIN_BGD truy cập tất cả
  if (role === "ROLE_ADMIN" || role === "ROLE_ADMIN_BLD") {
    return children;
  }

  // Kiểm tra quyền truy cập dựa theo menuName
  const canAccess = () => {
    switch (menuName) {
      case "Hệ thống":
        return false;
      case "Danh mục":
      case "Quảng bá":
      case "Kinh doanh":
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