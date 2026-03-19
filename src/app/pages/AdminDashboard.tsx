import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { AdminSidebar } from "../components/AdminSidebar";
import { KPICard } from "../components/KPICard";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
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
import {
  Calendar,
  Ticket,
  FolderOpen,
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
} from "lucide-react";
import { mockTickets, categories } from "../data/mockData";
import { DashboardGraphs } from "../components/DashboardGraphs";
import { useAuth } from "../contexts/AuthContext";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { format } from "date-fns";
import { cn } from "../components/ui/utils";

export default function AdminDashboard() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
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
  const avgResolutionDays = useMemo(() => {
    const resolved = mockTickets.filter(t => t.status === "resolved" || t.status === "closed");
    if (resolved.length === 0) return 0;
    const avg = resolved.reduce((sum, t) => {
      const days = (new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0) / resolved.length;
    return avg.toFixed(1);
  }, []);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let tickets = mockTickets.filter(t => {
      const createdDate = new Date(t.createdAt);
      const fromOk = !dateRange.from || createdDate >= dateRange.from;
      const toOk = !dateRange.to || createdDate <= dateRange.to;
      return fromOk && toOk;
    });

    if (filterCategory !== "all") {
      tickets = tickets.filter((t) => t.category === filterCategory);
    }
    if (filterStatus !== "all") {
      tickets = tickets.filter((t) => t.status === filterStatus);
    }
    if (filterPriority !== "all") {
      tickets = tickets.filter((t) => t.priority === filterPriority);
    }
    return tickets.slice(0, 10); // Recent 10 for compact table
  }, [filterCategory, filterStatus, filterPriority, dateRange]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminSidebar />

      <div className="flex-1 ml-64 p-0 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Hero Header */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Admin Dashboard
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Analytics and insights for HR ticketing system. Monitor performance and trends.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button size="lg" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <KPICard
              title="Total Tickets"
              value={totalTickets.toLocaleString()}
              icon={Ticket}
              color="text-blue-600 bg-blue-100"
              trend="+12% from last month"
            />
            <KPICard
              title="Open Tickets"
              value={openTickets.toLocaleString()}
              icon={FolderOpen}
              color="text-orange-600 bg-orange-100"
              trend="-3% from last month"
            />
            <KPICard
              title="Overdue"
              value={overdueTickets.toLocaleString()}
              icon={AlertCircle}
              color="text-red-600 bg-red-100"
              trend="+2 from yesterday"
            />
            <KPICard
              title="Avg Resolution"
              value={`${avgResolutionDays} days`}
              icon={Clock}
              color="text-green-600 bg-green-100"
              trend="-0.5 days from last month"
            />
          </div>

          {/* Filters & Date Range */}
          <Card className="shadow-lg border-0 mb-8 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-11">
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
                    <SelectTrigger className="h-11">
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
                    <SelectTrigger className="h-11">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-11 w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, 'PPP')} - {format(dateRange.to, 'PPP')}
                            </>
                          ) : (
                            format(dateRange.from, 'PPP')
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range) => setDateRange({ from: range?.from || new Date(2024, 0, 1), to: range?.to || new Date() })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BarChart3 className="w-7 h-7" />
                Analytics Overview
              </h2>
              <p className="text-gray-600 mb-8">Visual insights into your ticketing performance</p>
              <DashboardGraphs />
            </div>
          </div>

          {/* Recent Tickets */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest 10 filtered tickets</CardDescription>
                </div>
                <Link to="/admin/tickets">
                  <Button variant="outline">
                    View All Tickets
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tickets match your current filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id} className="hover:bg-gray-50/50">
                          <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                          <TableCell className="font-medium">{ticket.employeeName}</TableCell>
                          <TableCell className="text-sm">{ticket.category}</TableCell>
                          <TableCell>
                            <PriorityBadge priority={ticket.priority} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={ticket.status} />
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
