import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import {
  filterRoutesByPermissions,
  ADMIN_ROUTES,
} from "../../constants/routeConfig";
import Sidebar from "../Sidebar";
import NeuralNetworkBackground from "../NeuralNetworkBackground";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { permissions } = useAppSelector((state) => state.permissions);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const allowedRoutes = filterRoutesByPermissions(ADMIN_ROUTES, permissions);

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
<<<<<<< HEAD
        <div className="w-full h-full min-h-[calc(100vh-48px)] bg-white/75 dark:bg-black/50 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-y-auto p-8 flex flex-col items-start">
=======
        <div className="w-full h-full min-h-[calc(100vh-48px)] glass-card rounded-[10px] overflow-y-auto p-4 flex flex-col items-start">
>>>>>>> ashwin/lms_core
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
