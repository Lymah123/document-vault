import React from "react";
// import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-white text-lg font-bold">My App</a>
        <div className="flex space-x-4">
          <a href="/dashboard" className="text-white hover:text-gray-200">Dashboard</a>
          <a href="/login" className="text-white hover:text-gray-200">Login</a>
          <a href="/register" className="text-white hover:text-gray-200">Register</a>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
