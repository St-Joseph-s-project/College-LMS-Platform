import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import type { RouteConfig } from "../constants/routeConfig";

/**
 * Render routes as an array of <Route> elements. Call this function
 * inside a <Routes> or as children of a parent <Route> so the router
 * receives actual <Route> elements (not a custom component).
 */
export const RouteRenderer = (routes: RouteConfig[], basePath: string): React.ReactNode => {
  const renderRoute = (route: RouteConfig) => {
    const relativePath = route.path.replace(basePath, "").replace(/^\//, "");

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
      if (route.component) {
        elements.push(renderRoute(route));
      }
      if (route.children) {
        elements.push(...renderRoutes(route.children));
      }
    });

    return elements;
  };

  return <>{renderRoutes(routes)}</>;
};

export default RouteRenderer;
