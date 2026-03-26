import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "../components/ui/utils";
import { 
  LayoutDashboard, 
  Plus,
  LogOut 
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { DarkModeToggle } from "./DarkModeToggle";

interface EmployeeSidebarProps {
  className?: string;
}

export function EmployeeSidebar({ className }: EmployeeSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/employee", label: "Dashboard", icon: LayoutDashboard },
    { path: "/employee/create-ticket", label: "Create Ticket", icon: Plus },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={cn("w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 flex flex-col", className)}>
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-semibold text-lg dark:text-white">DMTS</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
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
                  ? "bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-400 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
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
          className="w-full justify-start h-12 text-sm hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-800"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

