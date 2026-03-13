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
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">My Tickets</h2>
              <p className="text-sm text-gray-600 mt-1">View and track your submitted requests</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No tickets found. Create your first ticket to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  employeeTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell>{ticket.assignedTo || "Pending"}</TableCell>
                      <TableCell>
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
      </main>
    </div>
  );
}

