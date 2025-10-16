import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./common/ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import Dashboard from "../pages/Dashboard";
import InterviewSessionDetails from "../pages/InterviewDetails";
import MainLayout from "./layout/MainLayout";
import LoginModal from "./modals/LoginModal";
import SignupModal from "./modals/SignupModal";

const AppRoutes = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && location.pathname === "/") {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, location.pathname]);

  const openLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const openSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage onGetStarted={openLogin} />
            )
          }
        />
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:sessionId"
            element={
              <ProtectedRoute>
                <InterviewSessionDetails />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
          }
        />
      </Routes>

      {!isAuthenticated && (
        <>
          {showLoginModal && (
            <LoginModal onClose={closeModals} onSwitchToSignup={openSignup} />
          )}
          {showSignupModal && (
            <SignupModal onClose={closeModals} onSwitchToLogin={openLogin} />
          )}
        </>
      )}
    </>
  );
};

export default AppRoutes;
