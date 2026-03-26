# Firebase Auth - Integration Examples

Complete code examples for integrating Firebase Authentication with your existing components and routes.

---

## 1️⃣ Update LoginPage

**File:** `src/app/features/auth/LoginPage.tsx`

### Before (Mock Auth)
```typescript
// Old mock-based login
const [user, setUser] = useAuth();
// ... mock login logic
```

### After (Firebase Auth)

**Full Updated LoginPage:**

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmailPassword } from '../../services/authService';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert } from '../../components/ui/alert';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Firebase login
      const user = await loginWithEmailPassword(email, password);
      console.log('Logged in as:', user.email);

      // Redirect happens automatically via ProtectedRoute based on role
      // For now, just redirect to employee dashboard
      // (ProtectedRoute will override if user lacks permissions)
      navigate('/employee');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            HR Ticketing System
          </h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Demo Credentials:
            </p>
            <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <p>👨‍💼 Admin: admin@company.com / Admin@1234</p>
              <p>👩‍💼 HR: hr@company.com / Hr@1234</p>
              <p>👤 Employee: employee@company.com / Employee@1234</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
```

---

## 2️⃣ Update Routes with ProtectedRoute

**File:** `src/app/routes.ts`

### Complete Updated Routes File

```typescript
import { createBrowserRouter, RouteObject } from 'react-router';
import { LoginPage } from './features/auth';
import {
  EmployeeDashboard,
  CreateTicket,
  TicketDetail,
} from './features/employee';
import { HRPage } from './features/hr';
import { AdminTickets, AdminEmployees } from './features/admin';
import AdminDashboard from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

// Unauthorized page
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-gray-600 mb-8">
        You don't have permission to access this page.
      </p>
      <a href="/" className="text-blue-600 hover:underline">
        Return to Dashboard
      </a>
    </div>
  </div>
);

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/unauthorized',
    Component: UnauthorizedPage,
  },

  // Employee Routes (employee, hr, admin can access)
  {
    path: '/employee',
    Component: () => (
      <ProtectedRoute allowedRoles={['employee', 'hr', 'admin']}>
        <EmployeeDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/employee/create-ticket',
    Component: () => (
      <ProtectedRoute allowedRoles={['employee', 'hr', 'admin']}>
        <CreateTicket />
      </ProtectedRoute>
    ),
  },

  // HR Routes (hr, admin can access)
  {
    path: '/hr',
    Component: () => (
      <ProtectedRoute allowedRoles={['hr', 'admin']}>
        <HRPage />
      </ProtectedRoute>
    ),
  },

  // Admin Routes (admin only)
  {
    path: '/admin',
    Component: () => (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/tickets',
    Component: () => (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminTickets />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/employees',
    Component: () => (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminEmployees />
      </ProtectedRoute>
    ),
  },

  // Ticket Detail (all authenticated users)
  {
    path: '/ticket/:id',
    Component: () => (
      <ProtectedRoute allowedRoles={['employee', 'hr', 'admin']}>
        <TicketDetail />
      </ProtectedRoute>
    ),
  },
]) as RouteObject[];
```

---

## 3️⃣ Add Logout Button to Navbar

**File:** `src/app/components/HRNavbar.tsx` (or whichever navbar)

```typescript
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export const HRNavbar = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold">HR Dashboard</h1>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <p className="text-gray-700">{user?.email}</p>
              <p className="text-gray-500">Role: {role}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
```

---

## 4️⃣ Using Auth in any Component

### Example 1: Show User Info

```typescript
import { useAuth } from '../contexts/AuthContext';

export const UserProfile = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {user.email}</p>
      <p>UID: {user.uid}</p>
      <p>Role: {role}</p>
    </div>
  );
};
```

### Example 2: Show Content Based on Role

```typescript
import { useAuth } from '../contexts/AuthContext';

export const ContentCard = () => {
  const { role, hasRole } = useAuth();

  return (
    <div className="card">
      <h3>Tickets</h3>
      
      {hasRole('admin') && (
        <button>Delete Ticket (Admin Only)</button>
      )}

      {hasRole(['hr', 'admin']) && (
        <button>Assign Ticket</button>
      )}

      {hasRole('employee') && (
        <button>Create New Ticket</button>
      )}
    </div>
  );
};
```

### Example 3: Conditional Navigation

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (role === 'admin') {
      navigate('/admin/tickets');
    } else if (role === 'hr') {
      navigate('/hr');
    } else {
      navigate('/employee');
    }
  };

  return (
    <button onClick={handleViewAll}>
      Go to Dashboard
    </button>
  );
};
```

---

## 5️⃣ Using Auth Service Outside React

### In Utilities/Helpers

```typescript
// src/utils/permissionHelper.ts

import { hasRole, getCurrentUser } from '../services/authService';

export const canDeleteTicket = async (): Promise<boolean> => {
  const user = getCurrentUser();
  if (!user) return false;

  return await hasRole(user.uid, ['admin']);
};

export const canAssignTicket = async (): Promise<boolean> => {
  const user = getCurrentUser();
  if (!user) return false;

  return await hasRole(user.uid, ['admin', 'hr']);
};
```

### In API Calls

```typescript
// src/services/ticketApi.ts

import { getCurrentUser } from './authService';

export const getMyTickets = async () => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  return fetch(`/api/tickets?userId=${user.uid}`, {
    headers: {
      'Authorization': `Bearer ${await user.getIdToken()}`,
    },
  });
};
```

---

## 6️⃣ Redirect After Login

### Smart Redirect Based on Role

```typescript
// In LoginPage.tsx, replace navigate call:

const handleLogin = async (e: React.FormEvent) => {
  // ... login code ...

  try {
    const user = await loginWithEmailPassword(email, password);
    const role = await getUserRole(user.uid);

    // Redirect based on role
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'hr') {
      navigate('/hr');
    } else {
      navigate('/employee');
    }
  } catch (err) {
    // ... error handling ...
  }
};
```

**Import needed:**
```typescript
import { getUserRole } from '../../services/authService';
```

---

## 7️⃣ Handle Auth Errors Gracefully

```typescript
// Authentication error handler
import { loginWithEmailPassword } from '../services/authService';

const handleLogin = async (email: string, password: string) => {
  try {
    await loginWithEmailPassword(email, password);
  } catch (error) {
    if (error instanceof Error) {
      // Firebase auth error - already user-friendly
      if (error.message.includes('not found')) {
        showError('Email not registered. Please contact HR.');
      } else if (error.message.includes('password')) {
        showError('Incorrect password.');
      } else if (error.message.includes('too many')) {
        showError('Too many failed attempts. Try again later.');
      } else {
        showError(error.message);
      }
    }
  }
};
```

---

## 8️⃣ Create Role-Specific Wrappers

```typescript
// src/components/AdminOnly.tsx

import { ProtectedRoute } from './ProtectedRoute';

export const AdminOnly = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

// Usage:
// <AdminOnly>
//   <DeleteTicketButton />
// </AdminOnly>
```

```typescript
// src/components/HROnly.tsx

import { ProtectedRoute } from './ProtectedRoute';

export const HROnly = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['hr', 'admin']}>
    {children}
  </ProtectedRoute>
);
```

---

## 9️⃣ Add Auth to Existing Components

### Before: Using Mock Data

```typescript
import { useAuth as useMockAuth } from '../contexts/AuthContext';

export const TicketList = () => {
  const { user } = useMockAuth(); // Was mock user

  return <div>{user.email}</div>;
};
```

### After: Using Firebase Auth

```typescript
import { useAuth } from '../contexts/AuthContext';

export const TicketList = () => {
  const { user, loading } = useAuth(); // Now Firebase user

  if (loading) return <div>Loading...</div>;

  return <div>{user?.email}</div>;
};
```

---

## 🔟 Debug Auth State

```typescript
// Temporary component for debugging (remove in production)

export const AuthDebug = () => {
  const { user, role, loading, error } = useAuth();

  if (!process.env.NODE_ENV === 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white text-xs max-w-xs rounded">
      <h4 className="font-bold mb-2">Auth Debug:</h4>
      <p>Loading: {loading ? '✓' : '✗'}</p>
      <p>User: {user?.email || 'None'}</p>
      <p>Role: {role || 'None'}</p>
      <p>Error: {error || 'None'}</p>
    </div>
  );
};

// Add to App.tsx temporarily:
// <AuthDebug />
```

---

## Summary

These examples cover:

✅ Complete LoginPage with Firebase auth  
✅ Protected routes by role  
✅ Logout functionality  
✅ Role-based content display  
✅ Using auth outside React components  
✅ Smart redirects after login  
✅ Error handling  
✅ Role-specific wrappers  
✅ Updating existing components  
✅ Debugging auth state  

All examples follow your existing code style and use the components already in your project!
