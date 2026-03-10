import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AdminSidebar } from "../../components/AdminSidebar";
import { KPICard } from "../../components/KPICard";
import { StatusBadge } from "../../components/StatusBadge";
import { PriorityBadge } from "../../components/PriorityBadge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Ticket, FolderOpen, AlertCircle, Clock, Users, LogOut } from "lucide-react";
import { mockTickets, categories, hrStaff } from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";

// --- Honeycomb Pattern Component ---
const HoneycombPattern = ({ className }: { className?: string }) => (
  <svg 
    className={`absolute pointer-events-none ${className}`} 
    width="250" 
    height="250" 
    viewBox="0 0 450 450" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <polygon 
        id="hex-admin" 
        points="0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50" 
      />
    </defs>
    <g opacity="0.6" stroke="#C9D866" strokeWidth="12" fill="none" strokeLinejoin="round">
      <use href="#hex-admin" x="173.2" y="150" />
      <use href="#hex-admin" x="86.6" y="0" />
      <use href="#hex-admin" x="259.8" y="0" />
      <use href="#hex-admin" x="0" y="150" />
      <use href="#hex-admin" x="346.4" y="150" />
      <use href="#hex-admin" x="86.6" y="300" />
      <use href="#hex-admin" x="259.8" y="300" />
    </g>
  </svg>
);

export default function AdminDashboard() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Calculate KPIs
  const totalTickets = mockTickets.length;
  const openTickets = mockTickets.filter(
    (t) => t.status === "open" || t.status === "in-progress"
  ).length;
  const overdueTickets = mockTickets.filter((t) => {
    const daysSinceUpdate =
      (new Date().getTime() - new Date(t.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > 3 && t.status !== "resolved" && t.status !== "closed";
  }).length;

  // Filter tickets
  let filteredTickets = mockTickets;
  if (filterCategory !== "all") {
    filteredTickets = filteredTickets.filter((t) => t.category === filterCategory);
  }
  if (filterStatus !== "all") {
    filteredTickets = filteredTickets.filter((t) => t.status === filterStatus);
  }
  if (filterPriority !== "all") {
    filteredTickets = filteredTickets.filter((t) => t.priority === filterPriority);
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Honeycomb Backgrounds - fully visible corners */}
      <HoneycombPattern className="top-0 left-0 scale-150" />
      <HoneycombPattern className="bottom-0 right-0 scale-150 rotate-180" />
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header with User Info and Logout */}
          <div className="flex justify-end items-center mb-8">
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

          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all HR tickets</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Tickets"
              value={totalTickets}
              icon={Ticket}
              color="text-blue-600"
            />
            <KPICard
              title="Open"
              value={openTickets}
              icon={FolderOpen}
              color="text-orange-600"
            />
            <KPICard
              title="Overdue"
              value={overdueTickets}
              icon={AlertCircle}
              color="text-red-600"
            />
            <KPICard
              title="Avg Resolution Time"
              value="2.4 days"
              icon={Clock}
              color="text-green-600"
            />
          </div>

          {/* HR Assignment Matrix */}
          <Card className="shadow-sm border-gray-200 mb-8">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                HR Assignment Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Subcategories: {category.subcategories.join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Assigned to:</span>
                      <Select defaultValue={category.assignedHR[0]}>
                        <SelectTrigger className="h-9 w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {hrStaff.map((hr) => (
                            <SelectItem key={hr} value={hr}>
                              {hr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">All Tickets</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.employeeName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{ticket.category}</div>
                        <div className="text-gray-500 text-xs">{ticket.subcategory}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                    <TableCell>
                      <Link to={`/ticket/${ticket.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

