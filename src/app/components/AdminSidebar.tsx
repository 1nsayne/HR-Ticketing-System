import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "../components/ui/utils";
import { 
  LayoutDashboard, 
  Ticket, 
  UserCircle, 
  FileText, 
  Settings,
  LogOut
} from "lucide-react";

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 h-screen sticky top-0", className)}>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">HR Tickets</span>
        </div>
      </div>

      <nav className="px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-3 border-t border-gray-200">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-gray-700 hover:bg-gray-50 transition-colors text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}