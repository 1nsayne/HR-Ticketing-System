import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import {
  clearBrowserCloseTimestamp,
  clearPendingTimedOutSignIn,
  getAuthToken,
  getUserData,
  hasPendingTimedOutSignIn,
  logout as firebaseLogout,
  markBrowserCloseTimestamp,
  shouldReauthenticateAfterBrowserClose,
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
const DEFAULT_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const configuredInactivityTimeout = Number(
  import.meta.env.VITE_AUTH_INACTIVITY_TIMEOUT_MS
);
const INACTIVITY_TIMEOUT_MS =
  Number.isFinite(configuredInactivityTimeout) && configuredInactivityTimeout > 0
    ? configuredInactivityTimeout
    : DEFAULT_INACTIVITY_TIMEOUT_MS;
const SESSION_EXPIRED_STORAGE_KEY = "auth:session-expired";
const BROWSER_CLOSE_EXPIRED_STORAGE_KEY = "auth:browser-close-expired";
const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

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
  const inactivityTimeoutRef = useRef<number | null>(null);
  const isSessionExpiringRef = useRef(false);

  const clearInactivityTimeout = () => {
    if (inactivityTimeoutRef.current !== null) {
      window.clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
  };

  const clearUser = () => {
    clearInactivityTimeout();
    clearBrowserCloseTimestamp();
    setUserState(defaultUser);
    setRole(defaultUser.role);
    setToken(null);
    setIsAuthenticated(false);
  };

  const expireSessionForInactivity = async () => {
    if (isSessionExpiringRef.current) return;

    isSessionExpiringRef.current = true;

    try {
      sessionStorage.setItem(SESSION_EXPIRED_STORAGE_KEY, "1");
      await firebaseLogout();
    } catch (error) {
      console.error("Failed to sign out after inactivity:", error);
    } finally {
      flushSync(() => {
        clearUser();
      });
      window.location.replace("/login");
    }
  };

  const resetInactivityTimeout = () => {
    clearInactivityTimeout();

    if (!isAuthenticated) return;

    inactivityTimeoutRef.current = window.setTimeout(() => {
      void expireSessionForInactivity();
    }, INACTIVITY_TIMEOUT_MS);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        clearInactivityTimeout();
        isSessionExpiringRef.current = false;
        setIsAuthenticated(false);
        setUserState(defaultUser);
        setRole(defaultUser.role);
        setToken(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        if (hasPendingTimedOutSignIn()) {
          clearPendingTimedOutSignIn();
          await firebaseLogout();
          return;
        }

        if (shouldReauthenticateAfterBrowserClose()) {
          sessionStorage.setItem(BROWSER_CLOSE_EXPIRED_STORAGE_KEY, "1");
          await firebaseLogout();
          return;
        }

        const userData = await getUserData(firebaseUser.uid, firebaseUser.email);
        const authToken = await getAuthToken();

        const resolvedRole = (userData?.role ?? "employee") as UserRole;
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
        clearBrowserCloseTimestamp();
        resetInactivityTimeout();
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
        resetInactivityTimeout();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handlePageHide = () => {
      if (auth.currentUser) {
        markBrowserCloseTimestamp();
      }
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  const setUser = (nextUser: User) => {
    setUserState(nextUser);
    setRole(nextUser.role);
    setIsAuthenticated(true);
    resetInactivityTimeout();
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

  useEffect(() => {
    if (!isAuthenticated) {
      clearInactivityTimeout();
      return;
    }

    const handleActivity = () => {
      resetInactivityTimeout();
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    resetInactivityTimeout();

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      clearInactivityTimeout();
    };
  }, [isAuthenticated]);

  const refreshToken = async (): Promise<string | null> => {
    const nextToken = await getAuthToken(true);
    setToken(nextToken);
    resetInactivityTimeout();
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
