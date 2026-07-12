import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function Navbar({ onMenu }) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white h-16 px-4 flex items-center justify-between shadow">

      <div className="flex items-center gap-3">

        {user && (
          <button
            onClick={onMenu}
            className="md:hidden"
          >
            <Menu size={28} />
          </button>
        )}

        <Link
          to="/"
          className="text-xl font-bold text-red-500"
        >
          NOVA TV
        </Link>

      </div>

      <div className="flex items-center gap-3">

        {user ? (
          <>
            <Link
              to="/admin/dashboard"
              className="hidden md:block hover:text-red-400"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/upload"
              className="hidden md:block hover:text-red-400"
            >
              Upload
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 px-3 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            Admin Login
          </Link>
        )}

      </div>

    </nav>
  );
}

export default Navbar;
