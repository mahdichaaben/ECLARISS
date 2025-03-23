import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/authcontext/index';
import { SettingsProvider } from 'context/SettingsContext';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";
import Router from "./Router";

// Render the application
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <RouterProvider router={Router} />
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);
