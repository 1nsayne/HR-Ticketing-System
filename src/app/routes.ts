import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth";
import { EmployeeDashboard, CreateTicket, TicketDetail } from "./features/employee";
import { HRPage } from "./features/hr";
import { AdminTickets, AdminEmployees } from "./features/admin";
import AdminDashboard from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/employee",
    Component: EmployeeDashboard,
  },
  {
    path: "/employee/create-ticket",
    Component: CreateTicket,
  },
  {
    path: "/hr",
    Component: HRPage,
  },
  // Removed HR/employees - using /admin/employees instead
  // {
  //   path: "/hr/employees",
  //   Component: HREmployees,
  // },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/tickets",
    Component: AdminTickets,
  },
  {
    path: "/admin/employees",
    Component: AdminEmployees,
  },
  {
    path: "/ticket/:id",
    Component: TicketDetail,
  },
]);
