import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "../components/ui/utils";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { DarkModeToggle } from "./DarkModeToggle";

interface HRSidebarProps {
  className?: string;
}

export function HRSidebar({ className }: HRSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { path: "/hr", label: "Dashboard", icon: LayoutDashboard },
    { path: "/hr/employees", label: "Employees", icon: Users },
  ];

  return (
    <div className={`w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 flex flex-col z-40 ${className}`}>
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
            HR
          </div>
          <span className="font-semibold text-lg dark:text-white">DMTS HR</span>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-green-50 text-green-700 dark:bg-gray-800 dark:text-green-400 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900"
              }`}
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'H'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate dark:text-white">{user.name || 'HR User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role || 'hr'}</p>
            </div>
          </div>
          <DarkModeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-sm hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-800"
          onClick={() => navigate("/")}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

