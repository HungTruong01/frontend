import { Navigate } from 'react-router-dom';
import { getRole } from '@/api/authService';

const PrivateRoute = ({ children, menuName, subMenuName }) => {
  const role = getRole();

  // Chỉ ROLE_ADMIN mới có quyền truy cập tất cả
  if (role === "ROLE_ADMIN") {
    return children;
  }

  const canAccess = () => {
    switch (menuName) {
      case "Hệ thống":
        return role === "ROLE_ADMIN_QTV";
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
        return role === "ROLE_ADMIN_BLD" || role === "ROLE_ADMIN_TCKT";
      default:
        return false;
    }
  };

  if (!canAccess()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;