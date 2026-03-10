import React, { useState } from "react";
import { 
  Ticket, 
  FolderOpen, 
  Clock, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Bell,
  Search,
  Filter,
  ChevronRight,
  Menu,
  ArrowLeft,
  Send,
  MoreVertical,
  Paperclip,
  Zap,
  ShieldCheck,
  UserCheck,
  Mail
} from "lucide-react";

// --- Mock UI Components ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "secondary";
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-[#B0BF00] text-white hover:bg-[#99A600]",
    ghost: "text-gray-600 hover:bg-gray-100",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
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
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between relative overflow-hidden group">
    <div className="relative z-10">
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl bg-gray-50 ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const HoneycombPattern: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={`absolute pointer-events-none opacity-20 ${className}`} 
    width="300" 
    height="300" 
    viewBox="0 0 450 450" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <polygon id="hex" points="0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50" />
    </defs>
    <g stroke="#B0BF00" strokeWidth="8" fill="none">
      <use href="#hex" x="173.2" y="150" />
      <use href="#hex" x="86.6" y="0" />
      <use href="#hex" x="259.8" y="0" />
      <use href="#hex" x="0" y="150" />
      <use href="#hex" x="346.4" y="150" />
    </g>
  </svg>
);

interface ToggleProps {
  active: boolean;
  onToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ active, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${active ? 'bg-[#B0BF00]' : 'bg-gray-200'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

// Types
interface TicketData {
  id: string;
  name: string;
  cat: string;
  status: string;
  color: string;
  date: string;
  priority: string;
  subject: string;
}

interface User {
  name: string;
  role: string;
  assignedCategories: string[];
}

interface SettingsState {
  autoRoute: boolean;
  outOfOffice: boolean;
  emailNotifications: boolean;
  slaAlerts: boolean;
  weeklyDigest: boolean;
}

export default function HRPage() {
  const user: User = {
    name: "Alexis Joyce Fausto",
    role: "hr-specialist",
    assignedCategories: ["Payroll", "Benefits", "Onboarding"]
  };

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

  // Settings State
  const [settings, setSettings] = useState<SettingsState>({
    autoRoute: true,
    outOfOffice: false,
    emailNotifications: true,
    slaAlerts: true,
    weeklyDigest: false,
  });

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "employees", label: "Employees", icon: Users },
  ];

  const ticketsData: TicketData[] = [
    { id: "#TK-9281", name: "John Doe", cat: "Payroll", status: "Open", color: "text-blue-600 bg-blue-50", date: "Oct 24, 2023", priority: "High", subject: "Incorrect overtime calculation for September" },
    { id: "#TK-9282", name: "Sarah Hall", cat: "Benefits", status: "In Progress", color: "text-orange-600 bg-orange-50", date: "Oct 23, 2023", priority: "Medium", subject: "Health insurance enrollment query" },
    { id: "#TK-9283", name: "Mike Ross", cat: "Onboarding", status: "Resolved", color: "text-green-600 bg-green-50", date: "Oct 22, 2023", priority: "Low", subject: "Laptop delivery status" },
    { id: "#TK-9284", name: "Emma Wood", cat: "Payroll", status: "Open", color: "text-blue-600 bg-blue-50", date: "Oct 21, 2023", priority: "High", subject: "Direct deposit update" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B0BF00] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">HR</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">Vantage</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedTicket(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? "bg-[#B0BF00]/10 text-[#B0BF00]" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <HoneycombPattern className="-top-20 -right-20 rotate-12" />
        
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold capitalize">
              {selectedTicket ? "Manage Ticket" : (activeTab === "dashboard" ? "Dashboard Overview" : activeTab)}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent text-sm outline-none w-full"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{user.name}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B0BF00] to-[#D4E200] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          
          {/* TICKET MANAGEMENT VIEW */}
          {selectedTicket ? (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setSelectedTicket(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-[#B0BF00] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tickets
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Chat & Conversation */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${selectedTicket.color} mb-3 inline-block`}>
                          {selectedTicket.status}
                        </span>
                        <h1 className="text-2xl font-bold">{selectedTicket.subject}</h1>
                        <p className="text-gray-500 mt-1">Ticket {selectedTicket.id} • Created on {selectedTicket.date}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-50 rounded-lg">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="space-y-8 mt-10">
                      {/* Message: Employee */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                          {selectedTicket.name.charAt(0)}
                        </div>
                        <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                          <p className="text-sm font-bold mb-1">{selectedTicket.name} <span className="text-[10px] text-gray-400 font-normal ml-2">10:15 AM</span></p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Hello HR Team, I noticed that my overtime for the last week of September wasn't reflected in my latest payslip. I worked 8 hours extra. Can you please check?
                          </p>
                        </div>
                      </div>

                      {/* Message: HR (System) */}
                      <div className="flex gap-4 justify-end">
                        <div className="bg-[#B0BF00]/10 rounded-2xl rounded-tr-none p-4 max-w-[85%] text-right border border-[#B0BF00]/20">
                          <p className="text-sm font-bold mb-1 text-[#B0BF00]">System <span className="text-[10px] text-gray-400 font-normal ml-2">10:16 AM</span></p>
                          <p className="text-sm text-gray-600 leading-relaxed italic">
                            Ticket status updated to "In Progress". Assigned to Alexis JoyceFausto.
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#B0BF00] flex items-center justify-center text-white font-bold flex-shrink-0">
                          S
                        </div>
                      </div>
                    </div>

                    {/* Reply Input */}
                    <div className="mt-12 pt-6 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 focus-within:border-[#B0BF00]/50 transition-all">
                        <textarea 
                          placeholder="Type your reply to the employee..."
                          className="w-full bg-transparent border-none outline-none text-sm resize-none h-24"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400">
                              <Paperclip className="w-4 h-4" />
                            </button>
                          </div>
                          <Button className="px-6 py-2">
                            Send Reply
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Metadata & Actions */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-6 text-sm uppercase tracking-wider text-gray-400">Ticket Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Assigned To</p>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                          <div className="w-6 h-6 rounded-full bg-[#B0BF00] text-white text-[10px] flex items-center justify-center font-bold">AT</div>
                          <span className="text-xs font-semibold">Alexis Joyce Fausto</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Priority</p>
                          <select className="w-full text-xs font-bold bg-gray-50 border-none rounded-lg p-2 outline-none">
                            <option>{selectedTicket.priority}</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Category</p>
                          <div className="text-xs font-bold bg-gray-50 border border-gray-100 rounded-lg p-2">{selectedTicket.cat}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      <Button variant="outline" className="w-full justify-center text-sm py-3">
                        Reassign Ticket
                      </Button>
                      <Button className="w-full justify-center text-sm py-3">
                        Mark as Resolved
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">Internal Notes</h3>
                    <textarea 
                      placeholder="Add a private note only HR can see..."
                      className="w-full text-xs bg-gray-50 border border-gray-100 rounded-xl p-3 h-24 outline-none focus:ring-1 focus:ring-[#B0BF00]"
                    />
                    <Button variant="secondary" className="w-full text-xs mt-3">Add Note</Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* REGULAR DASHBOARD / TICKET VIEWS */
            <>
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* Welcome Section */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#B0BF00] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#B0BF00]/20">
                    <div className="relative z-10">
                      <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
                      <p className="mt-2 text-white/80 max-w-md">
                        You have 12 tickets waiting for your attention today across {user.assignedCategories.length} categories.
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
                    <KPICard title="Pending Review" value="12" icon={Ticket} color="text-blue-500" />
                    <KPICard title="In Progress" value="08" icon={FolderOpen} color="text-orange-500" />
                    <KPICard title="Avg. Resolution" value="4.2h" icon={Clock} color="text-[#B0BF00]" />
                  </div>

                  {/* Bottom Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Your Categories</h3>
                        <Button variant="ghost" className="text-xs">Manage Assignments</Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {user.assignedCategories.map((cat) => (
                          <div key={cat} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-[#B0BF00]/30 transition-all cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <FolderOpen className="w-5 h-5 text-gray-400 group-hover:text-[#B0BF00]" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{cat}</p>
                                <p className="text-xs text-gray-500">4 New tickets</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B0BF00]" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
                      <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex gap-4 relative">
                            {i !== 3 && <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-100" />}
                            <div className="w-8 h-8 rounded-full bg-[#B0BF00]/10 flex items-center justify-center flex-shrink-0 z-10">
                              <div className="w-2 h-2 bg-[#B0BF00] rounded-full" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Ticket #120{i} Resolved</p>
                              <p className="text-xs text-gray-400 mt-1">15 mins ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tickets" && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h1 className="text-3xl font-bold">Ticket Management</h1>
                      <p className="text-gray-500 mt-1">Review and resolve employee requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline">
                        <Filter className="w-4 h-4" />
                        Filters
                      </Button>
                      <Button>Export CSV</Button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                    <select 
                        className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#B0BF00] outline-none min-w-[150px]"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {user.assignedCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#B0BF00] outline-none min-w-[150px]">
                        <option>All Statuses</option>
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                    </select>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {ticketsData.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors group">
                            <td className="px-6 py-4 font-bold text-sm">{ticket.id}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                  {ticket.name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium">{ticket.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{ticket.cat}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${ticket.color}`}>
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Button 
                                variant="ghost" 
                                className="text-xs py-1.5 md:opacity-0 group-hover:opacity-100"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                Manage
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "employees" && (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-40">
                  <div className="p-10 rounded-full bg-gray-100 mb-6">
                    <Users size={48} />
                  </div>
                  <h2 className="text-2xl font-bold">Component Under Construction</h2>
                  <p>The {activeTab} module will be available in the next release.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

