import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: { background: '#333', color: '#fff' },
          success: { duration: 3000 },
          error: { duration: 6000 },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
