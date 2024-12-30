import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProfileSettings from "./pages/ProfileSettings";
import Security from "./pages/Security";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Include the Navbar globally */}
        <Navbar />
        <Routes>
          {/* Redirect root (/) to the login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
