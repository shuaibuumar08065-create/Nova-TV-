import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages for better performance
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const VideoUpload = lazy(() => import('./pages/VideoUpload'));
const Videos = lazy(() => import('./pages/Videos'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'));
const Categories = lazy(() => import('./pages/Categories'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/videos" />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/video/:id" element={<VideoPlayer />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/upload" element={<VideoUpload />} />
              <Route path="/admin/categories" element={<Categories />} />
            </Route>

            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  );
}

export default App;
