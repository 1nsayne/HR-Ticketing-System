import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { EmployeeNavbar } from "../../components/EmployeeNavbar";
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

// --- Honeycomb Pattern Component ---
const HoneycombPattern = ({ className }: { className?: string }) => (
  <svg 
    className={`absolute pointer-events-none opacity-20 ${className}`} 
    width="300" 
    height="300" 
    viewBox="0 0 450 450" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <polygon 
        id="hex-employee" 
        points="0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50" 
      />
    </defs>
    <g stroke="#B0BF00" strokeWidth="8" fill="none">
      <use href="#hex-employee" x="173.2" y="150" />
      <use href="#hex-employee" x="86.6" y="0" />
      <use href="#hex-employee" x="259.8" y="0" />
      <use href="#hex-employee" x="0" y="150" />
      <use href="#hex-employee" x="346.4" y="150" />
      <use href="#hex-employee" x="86.6" y="300" />
      <use href="#hex-employee" x="259.8" y="300" />
    </g>
  </svg>
);

export default function EmployeeDashboard() {
  const { user } = useAuth();
  
  // Filter tickets for current employee
  const employeeTickets = mockTickets.filter((t) => t.employeeName === user.name);
  
  const openCount = employeeTickets.filter((t) => t.status === "open" || t.status === "in-progress").length;
  const waitingCount = employeeTickets.filter((t) => t.status === "waiting").length;
  const resolvedCount = employeeTickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Honeycomb Backgrounds - top-right and bottom-left, behind content */}
      <HoneycombPattern className="top-0 right-0 translate-x-[20%] -translate-y-[20%] scale-110 z-0" />
      <HoneycombPattern className="bottom-0 left-0 -translate-x-[20%] translate-y-[20%] scale-110 rotate-180 z-0" />
      
      <EmployeeNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  );
}

