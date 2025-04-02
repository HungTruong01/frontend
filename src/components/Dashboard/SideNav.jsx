import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  MdLogout,
  MdOutlineZoomInMap,
  MdOutlineZoomOutMap,
} from "react-icons/md";

const SideNav = ({ menuItems, onLogout, onToggle }) => {
  const [openSubmenu, setOpenSubmenu] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmenuToggle = (name) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  return (
    <div className="relative h-full">
      <button
        onClick={toggleSidebar}
        className="absolute top-8 -right-4 bg-white border border-gray-200 rounded-full p-2 shadow-md z-10"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <MdOutlineZoomOutMap className="h-4 w-4 text-gray-600" />
        ) : (
          <MdOutlineZoomInMap className="h-4 w-4 text-gray-600" />
        )}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 h-screen flex flex-col rounded-r-2xl mt-2 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-center">
          {isCollapsed ? (
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          ) : (
            <img src={logo} alt="Logo" className="h-12 w-24 ml-2" />
          )}
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.subpages && item.subpages.length > 0 ? (
                  <div>
                    <button
                      onClick={() => handleSubmenuToggle(item.name)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors group ${
                        isCollapsed ? "justify-center" : ""
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
                          <li key={subItem.name}>
                            <NavLink
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
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
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
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-auto border-t border-gray-200">
          <button
            onClick={onLogout}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-4"
            } w-full px-4 py-3 cursor-pointer rounded-md transition-colors`}
            title={isCollapsed ? "Logout" : ""}
          >
            <MdLogout className="h-6 w-6" />
            {!isCollapsed && (
              <span className="text-base font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SideNav;
