import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CLIENT_ROUTES } from "../../constants/routeConfig";
import Sidebar from "../Sidebar";
import NeuralNetworkBackground from "../NeuralNetworkBackground";

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Client routes - no permission filtering, show all routes
  const allowedRoutes = CLIENT_ROUTES;

  const handleNavigate = async (path: string, _: string) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-color)] relative overflow-hidden">
      <NeuralNetworkBackground />
      <Sidebar
        routes={allowedRoutes}
        onNavigate={handleNavigate}
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
      />
      <main
        className="flex-1 transition-all duration-500 relative z-10"
        style={{
          marginLeft: isCollapsed ? "152px" : "332px",
          padding: "24px 24px 24px 0"
        }}
      >
        <div className="w-full h-full min-h-[calc(100vh-48px)] bg-white/75 dark:bg-black/50 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-y-auto p-8 flex flex-col items-start">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
