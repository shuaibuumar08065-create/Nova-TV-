import axios from 'axios';
import { toast } from 'react-hot-toast';

// Base URL – adjust if your FastAPI runs on a different port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Helper to extract a readable error message
export const getErrorMessage = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
      return data.detail || data.message || JSON.stringify(data) || 'Server error';
    }
    return `Error ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your network.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unexpected error occurred.';
  }
};

// Request interceptor – add token if needed (Telegram Mini App auth)
api.interceptors.request.use(
  (config) => {
    // Example: if you store a token in localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error:', error);

    // Show a toast only if it's not a 401 (maybe handle auth separately)
    if (error.response?.status !== 401) {
      const message = getErrorMessage(error);
      toast.error(message);
    }

    // Pass the error along so that each component can handle it specifically
    return Promise.reject(error);
  }
);

export default api;
