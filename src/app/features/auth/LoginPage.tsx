import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../../assets/logo.png";
import "../../../styles/login.css";

// --- Mock Data ---
const mockUsers = [
  { id: "HR-001", name: "HR Admin", email: "hr@company.com", role: "hr" as const },
  { id: "SYS-001", name: "System Admin", email: "admin@company.com", role: "admin" as const }
];

// --- Custom SVG Components ---

// Honeycomb Pattern Component
const HoneycombPattern = ({ className }) => (
  <svg 
    className={`absolute pointer-events-none ${className}`} 
    width="250" 
    height="250" 
    viewBox="0 0 450 450" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Pointy-topped hexagon with Radius = 100 */}
      <polygon 
        id="hex" 
        points="0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50" 
      />
    </defs>
    {/* Group with opacity so overlapping strokes don't multiply in darkness */}
    <g opacity="0.6" stroke="#C9D866" strokeWidth="12" fill="none" strokeLinejoin="round">
      <use href="#hex" x="173.2" y="150" />   {/* Center */}
      <use href="#hex" x="86.6" y="0" />      {/* Top Left */}
      <use href="#hex" x="259.8" y="0" />     {/* Top Right */}
      <use href="#hex" x="0" y="150" />       {/* Left */}
      <use href="#hex" x="346.4" y="150" />   {/* Right */}
      <use href="#hex" x="86.6" y="300" />    {/* Bottom Left */}
      <use href="#hex" x="259.8" y="300" />   {/* Bottom Right */}
    </g>
  </svg>
);


// --- Main Page Component ---
export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("employee");

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Mock login - set user based on selected role
    let mockUser;
    if (selectedRole === "employee") {
      mockUser = {
        id: "EMP-1234",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        role: "employee",
        department: "Engineering",
      };
    } else if (selectedRole === "hr") {
      mockUser = mockUsers.find(u => u.role === "hr");
    } else {
      mockUser = mockUsers.find(u => u.role === "admin");
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
    <div className="min-h-screen flex items-center justify-center relative bg-[#f8f9fa] overflow-hidden font-sans">
       
      {/* Large Honeycomb Backgrounds - positioned to be fully visible */}
      <HoneycombPattern className="top-0 left-0 scale-150" />
      <HoneycombPattern className="bottom-0 right-0 scale-150 rotate-180" />

      {/* Login Card */}
      <div className="w-full max-w-sm sm:max-w-md shadow-xl border border-gray-100 login-gradient relative z-10 rounded-2xl p-8 sm:p-10 mx-4">
        
        <div className="space-y-4 text-center mb-8">
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="HR Ticketing System Logo" 
              className="w-16 h-16 rounded-2xl shadow-md object-cover"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black leading-tight">
            HUMAN RESOURCE<br/>TICKETING
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5 text-left">
            <label htmlFor="email" className="text-sm font-medium text-gray-800">
              Employee ID/ Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your Employee ID or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-3 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#b0bf00]/50 transition-shadow"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="password" className="text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-3 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#b0bf00]/50 transition-shadow"
            />
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: 'rgb(176, 191, 0)' }}
            className="w-full h-11 rounded-md text-white font-medium text-base shadow-md hover:opacity-90 active:scale-[0.98] transition-all mt-2"
          >
            Sign In
          </button>

          {/* Demo toggle for testing */}
          <div className="pt-6 mt-6 border-t border-black/5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 text-center mb-3 font-semibold">
              Demo Mode - Select Role
            </p>
            <div className="flex gap-2">
              {['employee', 'hr', 'admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-colors border ${
                    selectedRole === role 
                      ? "bg-gray-800 text-white border-gray-800" 
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

