import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = ({ onOpenLogin }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isLandingPage = location.pathname === "/";

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-sm">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg "
            >
              <path
                d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 7V9M12 15V17M9 11V13C9 14.1046 9.89543 15 11 15H13C14.1046 15 15 14.1046 15 13V11"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <span className="text-2xl font-bold text-gray-900">Interview</span>
            <span className="text-2xl font-bold text-orange-500">Prep</span>
            <span className="text-2xl font-bold text-gray-900">AI</span>
          </div>
        </Link>

        {user && !isLandingPage ? (
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format "
              alt={user.fullName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {user.fullName}
              </div>
              <div
                onClick={handleLogout}
                className={`text-xs cursor-pointer ${
                  isLoggingOut
                    ? "text-gray-400"
                    : "text-orange-500 hover:text-orange-600"
                }`}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
