import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { MdLogout } from "react-icons/md";

const SideNav = ({ menuItems, onLogout }) => {
  const [openSubmenu, setOpenSubmenu] = useState({});

  const handleSubmenuToggle = (name) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-gray-300 flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-24 ml-2" />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.subpages && item.subpages.length > 0 ? (
                <div>
                  <button
                    onClick={() => handleSubmenuToggle(item.name)}
                    className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      {item.icon}
                      <span className="text-base font-medium">{item.name}</span>
                    </div>
                    {openSubmenu[item.name] ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    )}
                  </button>
                  {openSubmenu[item.name] && (
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
                    `flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors ${
                      isActive ? "bg-blue-100 text-blue-600" : ""
                    }`
                  }
                >
                  {item.icon}
                  <span className="text-base font-medium">{item.name}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-auto border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 w-full px-4 py-3 cursor-pointer rounded-md transition-colors"
        >
          <MdLogout className="h-6 w-6" />
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
