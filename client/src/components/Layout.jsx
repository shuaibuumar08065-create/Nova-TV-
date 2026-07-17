import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="navbar-brand">
          <Link to="/">NOVA TV</Link>
        </div>
        <nav className="navbar-links">
          <Link to="/videos">Videos</Link>
          {user && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/upload">Upload</Link>
              <Link to="/admin/categories">Categories</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
          {!user && <Link to="/login">Login</Link>}
        </nav>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">© 2026 NOVA TV</footer>
    </div>
  );
};

export default Layout;
