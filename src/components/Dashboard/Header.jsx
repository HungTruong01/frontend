import React from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-3 bg-white">
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 placeholder-gray-400"
          />
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative text-gray-600 hover:text-gray-800 focus:outline-none">
          <BellIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-7 w-7 text-gray-600" />
          <div className="hidden md:block">
            <p className="text-xs font-medium text-gray-800">Admin User</p>
            <p className="text-[10px] text-gray-500">Quản lý</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
