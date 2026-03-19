import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { EmployeeSidebar } from "../../components/EmployeeSidebar";
import { KPICard } from "../../components/KPICard";
import { StatusBadge } from "../../components/StatusBadge";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Ticket, FolderOpen, CheckCircle, PlusCircle } from "lucide-react";
import { mockTickets } from "../../data/mockData";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  
  // Filter tickets for current employee
  const employeeTickets = mockTickets.filter((t) => t.employeeName === user.name);
  
  const openCount = employeeTickets.filter((t) => t.status === "open" || t.status === "in-progress").length;
  const waitingCount = employeeTickets.filter((t) => t.status === "waiting").length;
  const resolvedCount = employeeTickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <EmployeeSidebar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
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
                className="bg-blue-400 hover:bg-blue-500 h-11 text-white border-blue-400"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Ticket
              </Button>
            </Link>
          </div>

          {/* Tickets Table */}
          <div className="bg-white/90 dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 ring-1 ring-gray-200/30 dark:ring-gray-700/50 backdrop-blur-sm">
            <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Tickets</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">View and track your submitted requests</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-gray-200/50 dark:border-gray-600 hover:bg-gray-50/70 dark:hover:bg-gray-700/70">
                    <TableHead className="text-lg font-bold text-gray-900 dark:text-gray-50 h-14">Ticket ID</TableHead>
                    <TableHead className="text-lg font-bold text-gray-900 dark:text-gray-50 h-14">Category</TableHead>
                    <TableHead className="text-lg font-bold text-gray-900 dark:text-gray-50 h-14">Subject</TableHead>
                    <TableHead className="text-lg font-bold text-gray-900 dark:text-gray-50 h-14">Status</TableHead>
                    <TableHead className="text-lg font-bold text-gray-900 dark:text-gray-50 h-14">Assigned</TableHead>
                    <TableHead className="text-lg font-bold text-gray-900 dark:text-gray-50 h-14">Updated</TableHead>
                    <TableHead className="text-lg font-bold text-gray-900 dark:text-gray-50 h-14"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center py-12 text-gray-500 dark:text-gray-400">
                        <Ticket className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4 opacity-60" />
                        <p className="text-lg dark:text-gray-400">No tickets found</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Create your first ticket to get started</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    employeeTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="border-b border-gray-200/30 dark:border-gray-700/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-200 group">
                        <TableCell className="font-mono font-semibold text-gray-900 dark:text-gray-50 py-4">{ticket.id}</TableCell>
                        <TableCell className="font-medium text-gray-800 dark:text-gray-200 py-4">{ticket.category}</TableCell>
                        <TableCell className="max-w-md truncate font-medium text-gray-800 dark:text-gray-100 py-4">{ticket.subject}</TableCell>
                        <TableCell>
                          <StatusBadge status={ticket.status} />
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300 py-4 font-medium">{ticket.assignedTo || "Pending"}</TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400 py-4">
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-4">
                          <Link to={`/ticket/${ticket.id}`}>
                            <Button variant="outline" size="sm" className="group-hover:bg-gray-900/10 dark:group-hover:bg-white/10 border-gray-300 dark:border-gray-600 dark:text-gray-200 hover:dark:bg-gray-600/50 transition-all">
                              View Details
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
      </main>
    </div>
  );
}

