import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { MdLogout, MdOutlineMenu } from "react-icons/md";
import { logout, getRole } from "@/api/authService";

const SideNav = ({ menuItems, onToggle }) => {
  const [openSubmenu, setOpenSubmenu] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const role = getRole(); // Lấy role từ auth service

  const handleSubmenuToggle = (name) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.subpages &&
        item.subpages.some((subpage) => location.pathname === subpage.path)
      ) {
        setOpenSubmenu((prev) => ({ ...prev, [item.name]: true }));
      }
    });
  }, [location.pathname, menuItems]);

  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  const isRouteActive = (path) => {
    return location.pathname === path;
  };

  const hasActiveChild = (subpages) => {
    return subpages && subpages.some((subpage) => isRouteActive(subpage.path));
  };

  const canAccessMenu = (menuName) => {
    // Cho phép ROLE_ADMIN và ROLE_ADMIN_BGD truy cập tất cả
    if (role === "ROLE_ADMIN" || role === "ROLE_ADMIN_BLD") {
      return true;
    }

    // Kiểm tra quyền cho các role khác
    switch (menuName) {
      case "Hệ thống":
        return false; // Chỉ ROLE_ADMIN và ROLE_ADMIN_BGD mới có quyền
      case "Danh mục":
      case "Quảng bá":
        return role === "ROLE_ADMIN_KD";
      case "Kinh doanh":
        return role === "ROLE_ADMIN_KD" || role === "ROLE_ADMIN_TCKT";
      case "Kho":
        return role === "ROLE_ADMIN_K";
      case "Tổng quan":
      case "Báo cáo":
        return role === "ROLE_ADMIN_TCKT";
      default:
        return true;
    }
  };

  const canAccessSubmenu = (menuName, submenuName) => {
    // Cho phép ROLE_ADMIN và ROLE_ADMIN_BGD truy cập tất cả
    if (role === "ROLE_ADMIN" || role === "ROLE_ADMIN_BLD") {
        return true;
    }

    if (menuName === "Kinh doanh") {
        if (role === "ROLE_ADMIN_KD") {
            return ["Đối tác", "Đơn hàng"].includes(submenuName);
        }
        if (role === "ROLE_ADMIN_TCKT") {
            // Sửa lại để so sánh với "Hoá đơn" thay vì "Hóa đơn"
            const result = submenuName === "Hoá đơn";
            console.log('TCKT checking:', {submenuName, result});
            return result;
        }
        return false;
    }

    return true; // Cho phép các menu khác hiện tất cả submenu
  };

  return (
    <div className="relative h-full">
      <aside
        className={`fixed inset-y-0 left-0  bg-white border-r border-gray-200 h-screen flex flex-col rounded-r-2xl mt-2 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-60"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-5 -right-4 bg-white border border-gray-200 rounded-full p-2 shadow-md z-10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MdOutlineMenu className="h-4 w-4 text-gray-600" />
        </button>
        <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-center">
          {isCollapsed ? (
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          ) : (
            <img src={logo} alt="Logo" className="h-12 w-24 ml-2" />
          )}
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            {menuItems.map((item) => {
              // Kiểm tra quyền truy cập menu
              if (!canAccessMenu(item.name)) {
                return null;
              }

              return (
                <li key={item.name}>
                  {item.subpages && item.subpages.length > 0 ? (
                    <div>
                      <button
                        onClick={() => handleSubmenuToggle(item.name)}
                        className={`flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors group ${
                          isCollapsed ? "justify-center" : ""
                        } ${
                          hasActiveChild(item.subpages)
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }`}
                      >
                        <div
                          className={`flex items-center ${
                            isCollapsed ? "justify-center" : "gap-4"
                          }`}
                        >
                          {item.icon}
                          {!isCollapsed && (
                            <span className="text-base font-medium">
                              {item.name}
                            </span>
                          )}
                        </div>
                        {!isCollapsed &&
                          (openSubmenu[item.name] ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                          ))}
                      </button>
                      {openSubmenu[item.name] && !isCollapsed && (
                        <ul className="mt-1 space-y-1">
                          {item.subpages.map((subItem) => (
                            // Chỉ render submenu nếu có quyền truy cập
                            canAccessSubmenu(item.name, subItem.name) && (
                              <li key={subItem.name}>
                                <NavLink
                                  end
                                  to={subItem.path}
                                  className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors text-sm ml-4 ${
                                      isActive
                                        ? "bg-blue-50 text-blue-600 font-semibold"
                                        : "hover:text-gray-800"
                                    }`
                                  }
                                >
                                  {subItem.icon}
                                  <span>{subItem.name}</span>
                                </NavLink>
                              </li>
                            )
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      end
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center ${
                          isCollapsed ? "justify-center" : "gap-4"
                        } px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors ${
                          isActive ? "bg-blue-100 text-blue-600" : ""
                        }`
                      }
                      title={isCollapsed ? item.name : ""}
                    >
                      {item.icon}
                      {!isCollapsed && (
                        <span className="text-base font-medium">{item.name}</span>
                      )}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 mt-auto border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-4"
            } w-full px-4 py-3 cursor-pointer rounded-md transition-colors`}
            title={isCollapsed ? "Logout" : ""}
          >
            <MdLogout className="h-6 w-6" />
            {!isCollapsed && <a className="text-base font-medium">Đăng xuất</a>}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SideNav;
