import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { mockTickets } from "../../data/mockData";
import logo from "../../../assets/logo.png";
import { 
  Ticket, 
  FolderOpen,
  Clock,
  LogOut, 
  LayoutDashboard,
  ChevronRight, 
} from "lucide-react";
import { DarkModeToggle } from "../../components/DarkModeToggle";
import { HRTickets } from "./HRTickets";

// --- UI Components ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "secondary";
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-[#B0BF00] text-white hover:bg-[#99A600]",
    ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
    outline: "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
    secondary: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
  };
  return (
    <button className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between relative overflow-hidden group">
    <div className="relative z-10">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700 ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default function HRPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Get HR's assigned categories from user.assignedCategories
  const assignedCategories = user.assignedCategories || [];
  
  // Filter tickets that are assigned to this HR user and match their categories
  const hrTickets = mockTickets.filter(ticket => 
    ticket.assignedTo === user.name || 
    (ticket.category && assignedCategories.includes(ticket.category))
  );

  // Calculate stats based on filtered tickets
  const pendingCount = hrTickets.filter(t => t.status === "open").length;
  const inProgressCount = hrTickets.filter(t => t.status === "in-progress").length;
  const resolvedCount = hrTickets.filter(t => t.status === "resolved").length;

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "tickets", label: "Tickets", icon: Ticket },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      {/* Sidebar - Fixed */}
      <aside 
        className={`
          ${isSidebarOpen ? "w-64" : "w-20"}
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col z-50
          overflow-hidden
        `}
      >
        <div className="p-6 flex items-center gap-3 flex-shrink-0">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl" />
          <span className="font-bold text-xl tracking-tight dark:text-white">DMTS</span>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4 overflow-hidden">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedTicketId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? "bg-[#B0BF00]/10 text-[#B0BF00]" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
            <DarkModeToggle />
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-sm hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#B0BF00] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#B0BF00]/20">
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
                  <p className="mt-2 text-white/80 max-w-md">
                    You have {pendingCount + inProgressCount} tickets waiting for your attention today across {assignedCategories?.length || 0} categories.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6 bg-white border-none text-[#B0BF00] hover:bg-gray-100"
                    onClick={() => setActiveTab("tickets")}
                  >
                    View My Tickets
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="hidden md:block opacity-30">
                  <Ticket className="w-[120px] h-[120px]" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard 
                  title="Pending Review" 
                  value={pendingCount.toString()} 
                  icon={Ticket} 
                  color="text-blue-500" 
                />
                <KPICard 
                  title="In Progress" 
                  value={inProgressCount.toString()} 
                  icon={FolderOpen} 
                  color="text-orange-500" 
                />
                <KPICard 
                  title="Resolved" 
                  value={resolvedCount.toString()} 
                  icon={Clock} 
                  color="text-[#B0BF00]" 
                />
              </div>

              {/* Bottom Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg dark:text-white">Your Categories</h3>
                    <Button variant="ghost" className="text-xs">Manage Assignments</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {assignedCategories?.map((cat) => (
                      <div key={cat} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-transparent hover:border-[#B0BF00]/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm">
                            <FolderOpen className="w-5 h-5 text-gray-400 group-hover:text-[#B0BF00]" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm dark:text-white">{cat}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">4 New tickets</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B0BF00]" />
                      </div>
                    )) || <p>No categories assigned</p>}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-6 dark:text-white">Recent Activity</h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== 3 && <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-100 dark:bg-gray-700" />}
                        <div className="w-8 h-8 rounded-full bg-[#B0BF00]/10 flex items-center justify-center flex-shrink-0 z-10">
                          <div className="w-2 h-2 bg-[#B0BF00] rounded-full" />
                        </div>
                        <div>
                          <p className="text-sm font-medium dark:text-white">Ticket #120{i} Resolved</p>
                          <p className="text-xs text-gray-400 mt-1">15 mins ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tickets View */}
          {activeTab === "tickets" && (
            <HRTickets
              tickets={hrTickets}
              assignedCategories={assignedCategories}
              onSelectTicket={setSelectedTicketId}
              selectedTicketId={selectedTicketId}
            />
          )}
        </div>
      </main>
    </div>
  );
}
