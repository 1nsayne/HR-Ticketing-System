import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import {
  getAuthToken,
  getUserData,
  getUserRole,
  logout as firebaseLogout,
  type UserRole as FirebaseUserRole,
} from "../../services/authService";
import { User, UserRole, currentUser as defaultUser } from "../data/mockData";

interface AuthContextType {
  user: User;
  role: UserRole;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createFallbackUser = (
  email?: string | null,
  uid?: string,
  role: FirebaseUserRole = "employee"
): User => {
  const emailValue = email ?? "";
  const nameFromEmail =
    emailValue
      .split("@")[0]
      ?.split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "User";

  return {
    id: uid ?? defaultUser.id,
    name: nameFromEmail,
    email: emailValue || defaultUser.email,
    role,
    department: role === "employee" ? defaultUser.department : undefined,
    assignedCategories: role === "hr" ? [] : undefined,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(defaultUser);
  const [role, setRole] = useState<UserRole>(defaultUser.role);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setIsAuthenticated(false);
        setUserState(defaultUser);
        setRole(defaultUser.role);
        setToken(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [userData, fetchedRole] = await Promise.all([
          getUserData(firebaseUser.uid),
          getUserRole(firebaseUser.uid),
        ]);
        const authToken = await getAuthToken();

        const resolvedRole = (fetchedRole ?? userData?.role ?? "employee") as UserRole;
        const hydratedUser: User = {
          ...createFallbackUser(firebaseUser.email, firebaseUser.uid, resolvedRole),
          ...(userData
            ? {
                id: userData.uid || firebaseUser.uid,
                email: userData.email || firebaseUser.email || defaultUser.email,
                role: resolvedRole,
              }
            : {}),
        };

        setUserState(hydratedUser);
        setRole(resolvedRole);
        setToken(authToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to restore authenticated user:", error);
        const fallbackUser = createFallbackUser(
          firebaseUser.email,
          firebaseUser.uid,
          "employee"
        );

        setUserState(fallbackUser);
        setRole(fallbackUser.role);
        setToken(null);
        setIsAuthenticated(true);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const setUser = (nextUser: User) => {
    setUserState(nextUser);
    setRole(nextUser.role);
    setIsAuthenticated(true);
  };

  const clearUser = () => {
    setUserState(defaultUser);
    setRole(defaultUser.role);
    setToken(null);
    setIsAuthenticated(false);
  };

  const logout = async () => {
    try {
      await firebaseLogout();
    } finally {
      flushSync(() => {
        clearUser();
      });
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    const nextToken = await getAuthToken(true);
    setToken(nextToken);
    return nextToken;
  };

  const hasPermission = useMemo(() => {
    const permissions: Record<UserRole, string[]> = {
      employee: [
        "create_ticket",
        "view_own_tickets",
        "comment_own_tickets",
      ],
      hr: [
        "view_assigned_tickets",
        "update_ticket_status",
        "add_comments",
        "view_own_tickets",
        "create_ticket",
        "comment_own_tickets",
      ],
      admin: [
        "view_all_tickets",
        "reassign_tickets",
        "manage_categories",
        "manage_users",
        "manage_hr_assignments",
        "update_ticket_status",
        "add_comments",
        "create_ticket",
        "view_own_tickets",
        "comment_own_tickets",
      ],
    };

    return (permission: string): boolean => {
      return permissions[role]?.includes(permission) || false;
    };
  }, [role]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        isAuthenticated,
        setUser,
        clearUser,
        logout,
        refreshToken,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
