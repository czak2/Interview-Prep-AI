import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../common/Header";

const MainLayout = ({ onOpenLogin }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-yellow-50">
      {isAuthenticated && <Header onOpenLogin={onOpenLogin} />}
      <Outlet />
    </div>
  );
};

export default MainLayout;
