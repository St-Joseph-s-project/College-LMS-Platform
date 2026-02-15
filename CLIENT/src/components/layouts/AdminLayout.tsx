import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import {
  filterRoutesByPermissions,
  ADMIN_ROUTES,
} from "../../constants/routeConfig";
import Sidebar from "../Sidebar";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { permissions } = useAppSelector((state) => state.permissions);
  const [sidebarWidth, _] = useState(240);

  const allowedRoutes = filterRoutesByPermissions(ADMIN_ROUTES, permissions);

  const handleNavigate = async (path: string, _: string) => {
    navigate(path);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar routes={allowedRoutes} onNavigate={handleNavigate} />
      <main
        style={{
          flex: 1,
          marginLeft: sidebarWidth === 60 ? "60px" : "240px",
          padding: "24px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
