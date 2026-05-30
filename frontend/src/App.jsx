import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import ClientPage from "./pages/ClientPage";
import "./App.css";

export default function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚕</span>
            <span className="logo-text">MedAI <em>Assistant</em></span>
          </div>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="nav-icon">🩺</span> Symptoms
            </NavLink>
            <NavLink to="/client" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="nav-icon">📋</span> My History
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span className="nav-icon">🛡️</span> Admin
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/client" element={<ClientPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>⚠️ This tool provides general health information only — not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
