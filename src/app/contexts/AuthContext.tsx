import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole, currentUser as defaultUser } from "../data/mockData";

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const hasPermission = (permission: string): boolean => {
    const role = user.role;

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

    return permissions[role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasPermission }}>
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
