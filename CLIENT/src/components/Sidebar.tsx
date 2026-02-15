import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { RouteConfig } from "../constants/routeConfig";

interface SidebarProps {
  routes: RouteConfig[];
  onNavigate: (path: string, permission: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ routes, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setExpandedMenus([]); // Close all menus when collapsing
    }
  };

  const toggleMenu = (path: string) => {
    if (isCollapsed) return; // Don't toggle when collapsed
    setExpandedMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (route: RouteConfig, level: number = 0) => {
    const hasChildren = route.children && route.children.length > 0;
    const isExpanded = expandedMenus.includes(route.path);

    return (
      <div key={route.path}>
        <div
          onClick={() => {
            if (hasChildren) {
              toggleMenu(route.path);
            } else {
              onNavigate(route.path, route.permission);
            }
          }}
          style={{
            padding: isCollapsed ? "12px 8px" : "12px 16px",
            cursor: "pointer",
            backgroundColor: isActive(route.path) ? "#e0e7ff" : "transparent",
            borderLeft: isActive(route.path) ? "3px solid #4f46e5" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: isCollapsed ? "0" : "12px",
            justifyContent: isCollapsed ? "center" : "flex-start",
            transition: "all 0.2s",
            marginLeft: isCollapsed ? "0" : `${level * 16}px`,
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>{route.icon || "•"}</span>
          {!isCollapsed && (
            <>
              <span style={{ flex: 1, fontSize: "14px" }}>{route.label}</span>
              {hasChildren && <span style={{ fontSize: "12px" }}>{isExpanded ? "▼" : "▶"}</span>}
            </>
          )}
        </div>
        {hasChildren && isExpanded && !isCollapsed && (
          <div>
            {route.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        width: isCollapsed ? "60px" : "240px",
        height: "100vh",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: isCollapsed ? "16px 8px" : "16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
        }}
      >
        {!isCollapsed && <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>Menu</h2>}
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            padding: "4px",
          }}
        >
          {isCollapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {routes.map((route) => renderMenuItem(route))}
      </nav>
    </div>
  );
};

export default Sidebar;
