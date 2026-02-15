import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CLIENT_ROUTES } from "../../constants/routeConfig";
import Sidebar from "../Sidebar";

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();

  // Client routes - no permission filtering, show all routes
  const allowedRoutes = CLIENT_ROUTES;

  const handleNavigate = async (path: string) => {
    navigate(path);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar routes={allowedRoutes} onNavigate={handleNavigate} />
      <main
        style={{
          flex: 1,
          padding: "24px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
