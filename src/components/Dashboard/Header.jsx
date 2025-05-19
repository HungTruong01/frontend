import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { getLoggedInUser } from "@/api/authService";

const Navbar = () => {
  const username = getLoggedInUser();

  return (
    <nav className="flex items-center justify-between p-3 bg-white">
      <div>
        <p className="text-lg font-medium text-blue-600">
          {username ? `Chào mừng ${username}!` : ""}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-7 w-7 text-gray-600" />
          <div className="hidden md:block">
            <p className="text-xs font-medium text-gray-800">
              {username || "Chưa đăng nhập"}
            </p>
            <p className="text-[10px] text-gray-500">Tài khoản</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
