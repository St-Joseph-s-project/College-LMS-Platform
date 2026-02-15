import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { hasPermission } from "../constants/routeConfig";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication and/or specific permissions
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

  // Check if user has required permission
  if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
