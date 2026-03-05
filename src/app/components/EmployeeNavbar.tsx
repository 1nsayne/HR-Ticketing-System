import { Link, useLocation } from "react-router";
import { cn } from "../components/ui/utils";
import { Home, PlusCircle } from "lucide-react";
import logo from "../../assets/logo.png";

export function EmployeeNavbar() {
  const location = useLocation();

  const navItems = [
    { path: "/employee", label: "Home", icon: Home },
    { path: "/employee/create-ticket", label: "Create Ticket", icon: PlusCircle },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-lg">HR Ticketing</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}