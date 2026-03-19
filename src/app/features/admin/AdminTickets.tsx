import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AdminSidebar } from "../../components/AdminSidebar";
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
import { Ticket, Search, Filter, LogOut } from "lucide-react";
import { mockTickets, categories } from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminTickets() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

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
  if (searchQuery) {
    filteredTickets = filteredTickets.filter(
      (t) =>
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Stats
  const totalTickets = filteredTickets.length;
  const openTickets = filteredTickets.filter((t) => t.status === "open").length;
  const inProgressTickets = filteredTickets.filter((t) => t.status === "in-progress").length;
  const resolvedTickets = filteredTickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">


          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Tickets Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all HR support tickets</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-sm border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalTickets}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <Ticket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Open</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{openTickets}</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                    <Ticket className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{inProgressTickets}</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                    <Ticket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{resolvedTickets}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                    <Ticket className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
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
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
<h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Tickets ({filteredTickets.length})</h2>
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
                  <TableHead>Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No tickets found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium dark:text-white">{ticket.id}</TableCell>
                      <TableCell className="dark:text-gray-300">{ticket.employeeName}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium dark:text-white">{ticket.category}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">{ticket.subcategory}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{ticket.assignedTo || "Unassigned"}</TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString()}
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
    </div>
  );
}
