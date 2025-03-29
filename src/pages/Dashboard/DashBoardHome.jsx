import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

const DashBoardHome = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default DashBoardHome;
