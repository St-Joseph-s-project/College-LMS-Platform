import React, { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { hasPermission } from "../constants/routeConfig";
import { getApi } from "../api/apiservice";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication and/or specific permissions
 * Note: Client routes with "client.access" permission bypass permission checks
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  redirectTo = "/login",
}) => {
  const { jwtToken } = useAppSelector((state) => state.jwtSlice);
  const { permissions, isLoaded } = useAppSelector((state) => state.permissions);

  // Check if user is authenticated
  if (!jwtToken) {
    return <Navigate to={redirectTo} replace />;
  }

  // Wait for permissions to load
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Skip permission check for client routes (client.access)
  // This allows all student routes to render without permission validation
  if (requiredPermission === "client.access") {
    return <>{children}</>;
  }

  // Check if user has required permission (for admin routes)
  if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Verify permission with backend (runs only once per mount)
  useEffect(() => {
    if (requiredPermission && requiredPermission !== "client.access") {
      getApi({ url: `/permission/has-permission/${requiredPermission}`, showLoader: false, showToaster: false })
        .then((response) => {
          console.log("Permission verified:", response);
        })
        .catch((error) => {
          console.error("Permission verification failed:", error);
        });
    }
  }, [requiredPermission]);

  return <>{children}</>;
};

export default ProtectedRoute;
