import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ closeMenu }) {
  const location = useLocation();

  const menus = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Upload Video", path: "/admin/upload" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Users", path: "/admin/users" },
    { name: "Ads", path: "/admin/ads" },
    { name: "Settings", path: "/admin/settings" },
    { name: "Analytics", path: "/admin/analytics" },
  ];

  return (
    <div className="h-full bg-slate-900 text-white">
      <div className="p-5 text-2xl font-bold border-b border-slate-700">
        NOVA TV
      </div>

      <div className="p-3 space-y-2">
        {menus.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={`block rounded-lg px-4 py-3 transition ${
              location.pathname === item.path
                ? "bg-red-600"
                : "hover:bg-slate-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
