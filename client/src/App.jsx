import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./hooks/useAuth";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import VideoUpload from "./pages/VideoUpload";
import VideoEdit from "./pages/VideoEdit";
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

      <Route
        path="/"
        element={<MainLayout />}
      >
        <Route
          index
          element={<Home />}
        />

        <Route
          path="video/:id"
          element={<VideoPlayer />}
        />

        <Route
          path="search"
          element={<Search />}
        />
      </Route>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route element={<ProtectedRoute />}>

        <Route
          path="/admin/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/admin/upload"
          element={<VideoUpload />}
        />

        <Route
          path="/admin/edit/:id"
          element={<VideoEdit />}
        />

        <Route
          path="/admin/categories"
          element={<Categories />}
        />

        <Route
          path="/admin/users"
          element={<Users />}
        />

        <Route
          path="/admin/ads"
          element={<Ads />}
        />

        <Route
          path="/admin/settings"
          element={<Settings />}
        />

        <Route
          path="/admin/analytics"
          element={<Analytics />}
        />

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
