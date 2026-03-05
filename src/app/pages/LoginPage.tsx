import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Building2 } from "lucide-react";
import { mockUsers } from "../data/mockData";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"employee" | "hr" | "admin">("employee");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - set user based on selected role
    let mockUser;
    if (selectedRole === "employee") {
      mockUser = {
        id: "EMP-1234",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        role: "employee" as const,
        department: "Engineering",
      };
    } else if (selectedRole === "hr") {
      mockUser = mockUsers.find(u => u.role === "hr")!;
    } else {
      mockUser = mockUsers.find(u => u.role === "admin")!;
    }

    setUser(mockUser);

    // Route based on role
    if (selectedRole === "admin") {
      navigate("/admin");
    } else if (selectedRole === "hr") {
      navigate("/hr");
    } else {
      navigate("/employee");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="HR Ticketing System Logo" 
              className="w-16 h-16 rounded-2xl shadow-md object-cover"
            />
          </div>
          <div>
            <CardTitle className="text-2xl">HR Ticketing System</CardTitle>
            <CardDescription className="mt-2">
              Sign in to access your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Employee ID / Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your employee ID or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button 
              type="submit" 
              style={{ backgroundColor: 'rgb(176, 191, 0)', borderColor: 'rgb(176, 191, 0)' }}
              className="w-full h-11 hover:bg-opacity-90 text-white"
            >
              Sign In
            </Button>

            {/* Demo toggle for testing */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center mb-2">Demo Mode - Select Role:</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedRole === "employee" ? "default" : "outline"}
                  onClick={() => setSelectedRole("employee")}
                  className="flex-1"
                  size="sm"
                >
                  Employee
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "hr" ? "default" : "outline"}
                  onClick={() => setSelectedRole("hr")}
                  className="flex-1"
                  size="sm"
                >
                  HR
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "admin" ? "default" : "outline"}
                  onClick={() => setSelectedRole("admin")}
                  className="flex-1"
                  size="sm"
                >
                  Admin
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
