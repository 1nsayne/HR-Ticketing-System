import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "../components/ui/utils";
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Settings,
  LogOut 
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/tickets", label: "Tickets", icon: Ticket },
    { path: "/admin/employees", label: "Employees", icon: Users },
  ];

  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-40", className)}>
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-semibold text-lg">DMTS</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-sm hover:bg-red-50 hover:text-red-600 border border-gray-200"
          onClick={() => navigate("/")}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

