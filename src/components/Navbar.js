import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-white shadow-lg border-b border-blue-100 px-6 py-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Left aligned */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-900 transition-all duration-300">
              SheRox
            </h1>
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="flex items-center space-x-8">
          <Link 
            to="/" 
            className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 group"
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 bg-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </Link>
          <Link 
            to="/about" 
            className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 group"
          >
            <span className="relative z-10">About</span>
            <div className="absolute inset-0 bg-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </Link>
          <Link 
            to="/contact" 
            className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 group"
          >
            <span className="relative z-10">Contact</span>
            <div className="absolute inset-0 bg-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </Link>
          <Link 
            to="/dashboard" 
            className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 group"
          >
            <span className="relative z-10">Dashboard</span>
            <div className="absolute inset-0 bg-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </Link>
        </div>

        {/* Right Side - Auth */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ backgroundColor: 'rgb(59 130 246 / 0.9)' }}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  <span className="text-blue-800 text-sm font-medium">
                    {user.name} ({user.email})
                  </span>
                </div>
                <Link 
                  to="/settings" 
                  className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Subtle bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"
        style={{ backgroundColor: 'rgb(59 130 246 / 0.5)' }}
      ></div>
    </nav>
  );
};

export default Navbar;