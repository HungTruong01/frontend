import React from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-end p-3 bg-white">
      <div className="flex items-center space-x-4">
        <button className="relative text-gray-600 hover:text-gray-800 focus:outline-none">
          <BellIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-7 w-7 text-gray-600" />
          <div className="hidden md:block">
            <p className="text-xs font-medium text-gray-800">Admin</p>
            <p className="text-[10px] text-gray-500">Quản lý</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
