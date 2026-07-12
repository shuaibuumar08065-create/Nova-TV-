import React from "react";
import ReactDOM from "react-dom/client";
import { init } from "@telegram-apps/sdk";

import App from "./App";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext";

try {
  init();

  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
} catch (err) {
  console.log("Telegram SDK:", err);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
