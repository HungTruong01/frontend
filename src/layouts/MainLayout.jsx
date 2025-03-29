import React from "react";
import Header from "@/components/Dashboard/Header";
import SideNav from "@/components/Dashboard/SideNav";
import menuItem from "@/data/menuItem";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-200">
      <div className="w-64 flex-shrink-0">
        <SideNav menuItems={menuItem} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-10 mx-4 mt-2 bg-white rounded-lg shadow px-6 py-4">
          <Header />
        </div>
        <main className="flex-1 container mx-auto p-4 bg-gray-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
