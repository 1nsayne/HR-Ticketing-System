import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { EmployeeNavbar } from "../components/EmployeeNavbar";
import { KPICard } from "../components/KPICard";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Ticket, FolderOpen, CheckCircle, PlusCircle } from "lucide-react";
import { mockTickets } from "../data/mockData";



export default function EmployeeDashboard() {
  const { user } = useAuth();
  
  // Filter tickets for current employee
  const employeeTickets = mockTickets.filter((t) => t.employeeName === user.name);
  
  const openCount = employeeTickets.filter((t) => t.status === "open" || t.status === "in-progress").length;
  const waitingCount = employeeTickets.filter((t) => t.status === "waiting").length;
  const resolvedCount = employeeTickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      
      <EmployeeNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">My Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user.name}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Open Tickets"
            value={openCount}
            icon={FolderOpen}
            color="text-blue-600"
          />
          <KPICard
            title="Waiting"
            value={waitingCount}
            icon={Ticket}
            color="text-orange-600"
          />
          <KPICard
            title="Resolved"
            value={resolvedCount}
            icon={CheckCircle}
            color="text-green-600"
          />
        </div>

        {/* Create New Ticket Button */}
        <div className="mb-6">
          <Link to="/employee/create-ticket">
            <Button 
              style={{ backgroundColor: 'rgb(176, 191, 0)', borderColor: 'rgb(176, 191, 0)' }}
              className="hover:bg-opacity-90 h-11 text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
          </Link>
        </div>

        {/* Tickets Table */}
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Tickets</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">View and track your submitted requests</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="dark:text-gray-300">Ticket ID</TableHead>
                <TableHead className="dark:text-gray-300">Category</TableHead>
                <TableHead className="dark:text-gray-300">Subject</TableHead>
                <TableHead className="dark:text-gray-300">Status</TableHead>
                <TableHead className="dark:text-gray-300">Assigned To</TableHead>
                <TableHead className="dark:text-gray-300">Last Updated</TableHead>
                <TableHead className="dark:text-gray-300"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No tickets found. Create your first ticket to get started.
                  </TableCell>
                </TableRow>
              ) : (
                employeeTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="dark:border-gray-800">
                    <TableCell className="font-medium dark:text-gray-200">{ticket.id}</TableCell>
                    <TableCell className="dark:text-gray-300">{ticket.category}</TableCell>
                    <TableCell className="max-w-xs truncate dark:text-gray-300">{ticket.subject}</TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell className="dark:text-gray-300">{ticket.assignedTo || "Pending"}</TableCell>
                    <TableCell className="dark:text-gray-300">
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link to={`/ticket/${ticket.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
