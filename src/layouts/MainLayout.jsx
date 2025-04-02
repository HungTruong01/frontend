import React, { useState } from "react";
import Header from "@/components/Dashboard/Header";
import SideNav from "@/components/Dashboard/SideNav";
import menuItem from "@/data/menuItem";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (isCollapsed) => {
    setSidebarCollapsed(isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <div
        className={`transition-all duration-300 flex-shrink-0 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SideNav menuItems={menuItem} onToggle={handleSidebarToggle} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="top-0 mx-4 mt-2 bg-white rounded-lg shadow px-6 py-4">
          <Header />
        </div>
        <main className="flex-1 container mx-auto p-4 bg-gray-200 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
