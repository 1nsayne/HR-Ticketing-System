import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { KPICard } from "../components/KPICard";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Ticket, FolderOpen, Clock, LogOut } from "lucide-react";
import { mockTickets, categories } from "../data/mockData";

export default function HRDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter tickets assigned to current HR user based on their category assignments
  let hrTickets = mockTickets.filter((ticket) => {
    // Check if ticket category is in HR's assigned categories
    const isInAssignedCategory = user.assignedCategories?.includes(ticket.category);
    return isInAssignedCategory;
  });

  // Calculate KPIs for this HR user
  const totalTickets = hrTickets.length;
  const openTickets = hrTickets.filter(
    (t) => t.status === "open" || t.status === "in-progress"
  ).length;
  const waitingTickets = hrTickets.filter((t) => t.status === "waiting").length;

  // Apply filters
  let filteredTickets = hrTickets;
  if (filterCategory !== "all") {
    filteredTickets = filteredTickets.filter((t) => t.category === filterCategory);
  }
  if (filterStatus !== "all") {
    filteredTickets = filteredTickets.filter((t) => t.status === filterStatus);
  }

  // Get only categories assigned to this HR user
  const assignedCategories = categories.filter((cat) =>
    user.assignedCategories?.includes(cat.name)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgb(176, 191, 0)' }}
              >
                <span className="text-white font-bold text-sm">HR</span>
              </div>
              <div>
                <span className="font-semibold text-lg">HR Ticketing</span>
                <p className="text-xs text-gray-500">HR Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role.toUpperCase()}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Assigned Tickets</h1>
          <p className="text-gray-600 mt-1">
            Manage tickets for:{" "}
            <span className="font-medium">{user.assignedCategories?.join(", ")}</span>
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Total Assigned"
            value={totalTickets}
            icon={Ticket}
            color="text-blue-600"
          />
          <KPICard
            title="Open/In Progress"
            value={openTickets}
            icon={FolderOpen}
            color="text-orange-600"
          />
          <KPICard
            title="Waiting"
            value={waitingTickets}
            icon={Clock}
            color="text-yellow-600"
          />
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {assignedCategories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">My Assigned Tickets</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Employee Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No tickets found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.employeeName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{ticket.category}</div>
                        <div className="text-gray-500 text-xs">{ticket.subcategory}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <Link to={`/ticket/${ticket.id}`}>
                        <Button variant="ghost" size="sm">
                          Manage
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
