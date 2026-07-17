import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./hooks/useAuth";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VideoUpload from "./pages/VideoUpload";
import VideoEdit from "./pages/VideoEdit";
import Videos from "./pages/Videos";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Ads from "./pages/Ads";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import VideoPlayer from "./pages/VideoPlayer";
import Search from "./pages/Search";

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      {/* Public */}

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="video/:id" element={<VideoPlayer />} />
        <Route path="search" element={<Search />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* Admin */}

      <Route element={<ProtectedRoute />}>

        <Route path="/admin" element={<AdminLayout />}>

          <Route
            index
            element={<Navigate to="/admin/dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="upload"
            element={<VideoUpload />}
          />
          
          <Route
            path="videos"
            element={<Videos />}
          />

          <Route
            path="edit/:id"
            element={<VideoEdit />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
            path="users"
            element={<Users />}
          />

          <Route
            path="ads"
            element={<Ads />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

        </Route>

      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
