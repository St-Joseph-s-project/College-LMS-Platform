import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import ClientLayout from "./components/layouts/ClientLayout";
import { Page404, Unauthorized, Login } from "./pages";
import { ADMIN_PERMISSIONS } from "./constants/permissions";
import { ADMIN_ROUTES, CLIENT_ROUTES } from "./constants/routeConfig";
import { RouteRenderer } from "./config/RouteRenderer";
import { useAppSelector } from "./redux/hooks"
import { Loader } from "./components";

function App() {
  const isLoading: boolean = useAppSelector((s: any) => s.loading.isLoading);
  const { jwtToken } = useAppSelector((state) => state.jwtSlice);
  const { role } = useAppSelector((state) => state.permissions);
  return (
    <BrowserRouter>
      {isLoading && (
        <Loader isLoading={isLoading} />
      )}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            jwtToken ? (
              <Navigate to={role === "ADMIN" ? "/dashboard/admin" : "/dashboard/student"} replace />
            ) : (
              <Login />
            )
          }
        />
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
          {RouteRenderer(ADMIN_ROUTES, "/dashboard/admin")}
        </Route>


        {/* Client Dashboard Routes - authenticated users only (no permission filter) */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          {RouteRenderer(CLIENT_ROUTES, "/dashboard/student")}
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
