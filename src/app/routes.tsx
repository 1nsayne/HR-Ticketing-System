import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "./features/login";
import { EmployeeDashboard, CreateTicket, TicketDetail } from "./features/employee";
import { HRPage } from "./features/hr";
import { AdminTickets, AdminEmployees } from "./features/admin";
import AdminDashboard from "./pages/AdminDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/unauthorized",
    Component: UnauthorizedPage,
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute allowedRoles={["employee", "hr", "admin"]}>
        <EmployeeDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employee/create-ticket",
    element: (
      <ProtectedRoute allowedRoles={["employee", "hr", "admin"]}>
        <CreateTicket />
      </ProtectedRoute>
    ),
  },
  {
    path: "/hr",
    element: (
      <ProtectedRoute allowedRoles={["hr", "admin"]}>
        <HRPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/tickets",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminTickets />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/employees",
    element: (
      <ProtectedRoute allowedRoles={["admin", "hr"]}>
        <AdminEmployees />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ticket/:id",
    element: (
      <ProtectedRoute allowedRoles={["employee", "hr", "admin"]}>
        <TicketDetail />
      </ProtectedRoute>
    ),
  },
]);
