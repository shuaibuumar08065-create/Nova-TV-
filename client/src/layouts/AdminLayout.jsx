import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-64 hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
