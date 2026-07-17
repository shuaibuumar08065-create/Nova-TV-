import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (e.g., via token)
    const token = localStorage.getItem('access_token');
    if (token) {
      // Optionally verify token with backend
      api
        .get('/api/auth/me')
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem('access_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      const { access_token, user } = response.data;
      localStorage.setItem('access_token', access_token);
      setUser(user);
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    toast.success('Logged out');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
