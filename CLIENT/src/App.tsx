import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import ClientLayout from "./components/layouts/ClientLayout";
import { Page404, Unauthorized, Login } from "./pages";
import { ADMIN_PERMISSIONS, CLIENT_PERMISSIONS } from "./constants/permissions";
import { ADMIN_ROUTES, CLIENT_ROUTES } from "./constants/routeConfig";
import { RouteRenderer } from "./config/RouteRenderer";
import { useAppSelector } from "./redux/hooks"
import { Loader } from "./components";

function App() {
  const isLoading: boolean = useAppSelector((s: any) => s.loading.isLoading);

  return (
    <BrowserRouter>
      {isLoading && (
        <Loader isLoading={isLoading} />
      )}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
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
          {RouteRenderer({ routes: ADMIN_ROUTES, basePath: "/dashboard/admin" })}
        </Route>

        {/* Client Dashboard Routes - No permission filtering */}
        <Route
          path="/dashboard/client"
          element={
            <ProtectedRoute requiredPermission={CLIENT_PERMISSIONS.ACCESS}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          {RouteRenderer({ routes: CLIENT_ROUTES, basePath: "/dashboard/client" })}
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
