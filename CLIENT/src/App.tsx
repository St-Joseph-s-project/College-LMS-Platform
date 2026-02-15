import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import ClientLayout from "./components/layouts/ClientLayout";
import { Page404, Unauthorized } from "./pages";
import { ADMIN_PERMISSIONS, CLIENT_PERMISSIONS } from "./constants/permissions";
import { ADMIN_ROUTES, CLIENT_ROUTES } from "./constants/routeConfig";
import { RouteRenderer } from "./config/RouteRenderer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/dashboard/client" replace />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Dashboard Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute requiredPermission={ADMIN_PERMISSIONS.DASHBOARD}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <RouteRenderer routes={ADMIN_ROUTES} basePath="/dashboard/admin" />
        </Route>

        {/* Client Dashboard Routes */}
        <Route
          path="/dashboard/client"
          element={
            <ProtectedRoute requiredPermission={CLIENT_PERMISSIONS.DASHBOARD}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <RouteRenderer routes={CLIENT_ROUTES} basePath="/dashboard/client" />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
