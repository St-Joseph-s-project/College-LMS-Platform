import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import type { RouteConfig } from "../constants/routeConfig";

interface RouteRendererProps {
  routes: RouteConfig[];
  basePath: string;
}

/**
 * Dynamically renders routes from configuration
 */
export const RouteRenderer: React.FC<RouteRendererProps> = ({ routes, basePath }) => {
  const renderRoute = (route: RouteConfig) => {
    // Calculate relative path
    const relativePath = route.path.replace(basePath, "").replace(/^\//, "");

    // If route has a component, render it
    if (route.component) {
      const Component = route.component;
      return (
        <Route
          key={route.path}
          path={relativePath}
          element={
            <ProtectedRoute requiredPermission={route.permission}>
              <Component />
            </ProtectedRoute>
          }
        />
      );
    }

    return null;
  };

  const renderRoutes = (routeList: RouteConfig[]): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];

    routeList.forEach((route) => {
      // Render the route itself if it has a component
      if (route.component) {
        elements.push(renderRoute(route));
      }

      // Render children recursively
      if (route.children) {
        elements.push(...renderRoutes(route.children));
      }
    });

    return elements;
  };

  return <>{renderRoutes(routes)}</>;
};

export default RouteRenderer;
