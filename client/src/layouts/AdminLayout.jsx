import React, { useState } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  LayoutDashboard,
  Upload,
  Video,
  Megaphone,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const menus = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Upload Video",
      icon: <Upload size={20} />,
      path: "/admin/upload",
    },
    {
      name: "Videos",
      icon: <Video size={20} />,
      path: "/admin/videos",
    },
    {
      name: "Advertisements",
      icon: <Megaphone size={20} />,
      path: "/admin/ads",
    },
    {
      name: "Users",
      icon: <Users size={20} />,
      path: "/admin/users",
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={20} />,
      path: "/admin/analytics",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Mobile Header */}

      <header className="lg:hidden bg-white shadow px-4 py-3 flex items-center justify-between">

        <button
          onClick={() => setOpen(true)}
          className="text-gray-700"
        >
          <Menu size={28} />
        </button>

        <h1 className="font-bold text-lg">
          NOVA TV
        </h1>

      </header>
{/* Overlay */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full w-72
          bg-white
          shadow-xl
          transition-transform
          duration-300

          ${open ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
          lg:static
          lg:shadow-md
        `}
      >

        <div className="flex items-center justify-between p-5 border-b">

          <div>

            <h2 className="text-xl font-bold">
              NOVA TV
            </h2>

            <p className="text-sm text-gray-500">
              Admin Panel
            </p>

          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden"
          >
            <X size={24} />
          </button>

        </div>

        <nav className="mt-4">

          {menus.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>

                `flex items-center gap-3
                 px-5 py-4
                 transition

                 ${
                   isActive
                     ? "bg-blue-600 text-white"
                     : "text-gray-700 hover:bg-gray-100"
                 }`
              }
            >

              {item.icon}

              <span className="font-medium">
                {item.name}
              </span>

            </NavLink>

          ))}

        </nav>
       <div className="absolute bottom-0 left-0 w-full border-t p-4">

          <button
            onClick={logout}
            className="
              w-full
              flex
              items-center
              gap-3
              rounded-lg
              bg-red-600
              text-white
              px-4
              py-3
              hover:bg-red-700
              transition
            "
          >
            <LogOut size={20} />

            <span className="font-medium">
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* Main Content */}

      <main
        className="
          lg:ml-72
          p-5
          min-h-screen
        "
      >
        <Outlet />
      </main>

    </div>
  );
}
