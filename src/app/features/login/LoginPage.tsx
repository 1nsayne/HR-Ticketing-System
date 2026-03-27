import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { DarkModeToggle } from "../../components/DarkModeToggle";
import { User } from "../../data/mockData";
import { getUserData, getUserRole, loginWithEmailPassword, type UserRole } from "../../../services/authService";
import logo from "../../../assets/logo.png";
import "../../../styles/login.css";

const SESSION_EXPIRED_STORAGE_KEY = "auth:session-expired";
const BROWSER_CLOSE_EXPIRED_STORAGE_KEY = "auth:browser-close-expired";

// --- Custom SVG Components ---

// Honeycomb Pattern Component
const HoneycombPattern = ({ className }: { className: string }) => (
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
  const { setUser, role, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRouteForRole = (userRole: UserRole) => {
    if (userRole === "admin") return "/admin";
    if (userRole === "hr") return "/hr";
    return "/employee";
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(getRouteForRole(role), { replace: true });
    }
  }, [isAuthenticated, loading, navigate, role]);

  useEffect(() => {
    const didSessionExpire =
      sessionStorage.getItem(SESSION_EXPIRED_STORAGE_KEY) === "1";
    const didBrowserCloseExpire =
      sessionStorage.getItem(BROWSER_CLOSE_EXPIRED_STORAGE_KEY) === "1";

    if (didBrowserCloseExpire) {
      setError("Your previous browser session was closed for more than 5 minutes. Please sign in again.");
      sessionStorage.removeItem(BROWSER_CLOSE_EXPIRED_STORAGE_KEY);
      return;
    }

    if (didSessionExpire) {
      setError("Your session expired due to inactivity. Please sign in again.");
      sessionStorage.removeItem(SESSION_EXPIRED_STORAGE_KEY);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const firebaseUser = await loginWithEmailPassword(email, password);
      const [userData, fetchedRole] = await Promise.all([
        getUserData(firebaseUser.uid),
        getUserRole(firebaseUser.uid),
      ]);

      const resolvedRole = fetchedRole ?? userData?.role ?? "employee";
      const displayName =
        email
          .split("@")[0]
          ?.split(/[._-]/)
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ") || "User";

      const authenticatedUser: User = {
        id: userData?.uid || firebaseUser.uid,
        name: displayName,
        email: userData?.email || firebaseUser.email || email,
        role: resolvedRole,
        department: resolvedRole === "employee" ? "Employee" : undefined,
        assignedCategories: resolvedRole === "hr" ? [] : undefined,
      };

      setUser(authenticatedUser);
      navigate(getRouteForRole(resolvedRole), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#f8f9fa] dark:bg-slate-900 p-4">
       
      {/* Large Honeycomb Backgrounds - positioned to be fully visible */}
      <HoneycombPattern className="top-0 left-0 scale-150" />
      <HoneycombPattern className="bottom-0 right-0 scale-150 rotate-180" />

      {/* Login Card */}
      <div className="w-full max-w-md shadow-2xl border bg-white dark:bg-slate-800 relative z-10 rounded-3xl p-10 mx-4">
        
        <div className="space-y-6 text-center mb-10">
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="DMTS Logo"
              className="w-20 h-20 rounded-3xl shadow-xl object-cover border-4 border-white dark:border-slate-700"
            />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            DMTS
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-900 dark:text-slate-200 block">
              Employee ID / Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your Employee ID or Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-base text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#b0bf00]/20 focus:border-[#b0bf00] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-slate-900 dark:text-slate-200 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-base text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#b0bf00]/20 focus:border-[#b0bf00] transition-all"
            />
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: 'rgb(176, 191, 0)' }}
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl text-white font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] transition-all border-0 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
          {error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
          )}
        </form>

      </div>

      {/* Dark Mode Toggle below card, centered */}
      <div className="mt-12 flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
        <span>Toggle Theme:</span>
        <DarkModeToggle />
      </div>
    </div>
  );
}
