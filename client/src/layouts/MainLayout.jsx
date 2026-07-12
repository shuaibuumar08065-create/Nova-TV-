import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";

function MainLayout() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      <Navbar onMenu={() => setMenuOpen(true)} />

      <div className="flex">

        {user && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 min-h-[calc(100vh-64px)]">
              <Sidebar />
            </div>

            {/* Mobile Drawer */}
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setMenuOpen(false)}
                />

                <div className="fixed top-0 left-0 h-full w-72 z-50 shadow-xl">
                  <Sidebar closeMenu={() => setMenuOpen(false)} />
                </div>
              </>
            )}
          </>
        )}

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default MainLayout;
