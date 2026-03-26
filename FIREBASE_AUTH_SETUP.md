# Firebase Authentication & Role-Based Access Control Setup

## 📋 Overview

This guide covers the Firebase Authentication (Email/Password) and role-based access control integration for your HR Ticketing System.

## 🗂️ New Files Created

```
src/
├── lib/
│   └── firebase.ts (UPDATED - already has getAuth exported)
├── services/
│   └── authService.ts (NEW - Firebase auth & role management)
├── hooks/
│   ├── useAuth.ts (NEW - auth state management)
│   └── useFirestore.ts (existing)
├── app/
│   ├── contexts/
│   │   └── AuthContext.tsx (UPDATED - now Firebase-based)
│   └── components/
│       └── ProtectedRoute.tsx (NEW - role-based route protection)
└── scripts/
    └── seedUsers.ts (NEW - create default accounts)
```

## 🔐 Three Default Accounts

After running the seed script, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | Admin@1234 |
| HR | hr@company.com | Hr@1234 |
| Employee | employee@company.com | Employee@1234 |

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Prepare Environment Variables

Your `.env` file already has Firebase credentials. Verify it has:

```env
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
VITE_FIREBASE_DATABASE_URL=your_value
```

### Step 2: Enable Email/Password Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password**
5. Click **Save**

### Step 3: Update Firestore Security Rules

Go to **Firestore Database** → **Rules** tab and replace with these rules to ensure role-based access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - authenticated users can read their own doc
    // Admin can read all users
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Tickets - everyone authenticated can read, 
    // create/update logic depends on role
    match /tickets/{ticketId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish**.

### Step 4: Run the Seed Script to Create Default Users

This script creates the three default accounts in Firebase Authentication and stores their roles in Firestore:

```bash
npm install -D dotenv ts-node
npx ts-node src/scripts/seedUsers.ts
```

**Expected Output:**
```
🌱 Starting seed script for Firebase users...

✅ Created user: admin@company.com (Role: admin)
✅ Created user: hr@company.com (Role: hr)
✅ Created user: employee@company.com (Role: employee)

✨ Seed script completed!

📋 Summary of default accounts:
-----------------------------------
Email: admin@company.com
Password: Admin@1234
Role: admin
---
Email: hr@company.com
Password: Hr@1234
Role: hr
---
Email: employee@company.com
Password: Employee@1234
Role: employee
---

✌️  Signed out. Ready to log in!
```

**If users already exist:**
```
⏭️  User already exists: admin@company.com (skipping)
```

### Step 5: Verify Firebase Setup

After running the seed script, verify in Firebase Console:

1. Go to **Authentication** → **Users**
   - Should see 3 users listed
2. Go to **Firestore Database** → **users** collection
   - Should see 3 documents with uid, email, and role

---

## 📚 Using Authentication in Your App

### 1. Access Authentication Anywhere with `useAuth` Hook

```typescript
import { useAuth } from '../hooks/useAuth';

export const MyComponent = () => {
  const { user, role, loading, error, hasRole, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>User: {user?.email}</p>
      <p>Role: {role}</p>
      <p>Is Admin: {hasRole('admin')}</p>
      <p>Is HR or Admin: {hasRole(['hr', 'admin'])}</p>
    </div>
  );
};
```

### 2. Access Auth Context Globally

Update your `src/main.tsx` (already done, but verify):

```typescript
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Initialize Firebase
import "./lib/firebase";

createRoot(document.getElementById("root")!).render(<App />);
```

Your `src/app/App.tsx` already wraps the app with `<AuthProvider>`:

```typescript
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
```

Now use auth context anywhere:

```typescript
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { user, role } = useAuth();
  
  return <div>{user?.email} ({role})</div>;
};
```

### 3. Create a Login Page (if not already done)

Your `LoginPage` exists at `src/app/features/auth/LoginPage.tsx`. Update it to use the auth service:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmailPassword } from '../../services/authService';

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
      await loginWithEmailPassword(email, password);
      // Redirect happens automatically via ProtectedRoute
      navigate('/employee'); // or wherever is appropriate
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};
```

---

## 🔒 Protecting Routes with ProtectedRoute

Update your `src/app/routes.ts` to wrap protected routes:

```typescript
import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth";
import { EmployeeDashboard, CreateTicket, TicketDetail } from "./features/employee";
import { HRPage } from "./features/hr";
import { AdminTickets, AdminEmployees } from "./features/admin";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/unauthorized",
    Component: () => <div className="p-8">
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
    </div>,
  },
  {
    path: "/employee",
    Component: () => (
      <ProtectedRoute allowedRoles={["employee", "hr", "admin"]}>
        <EmployeeDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employee/create-ticket",
    Component: () => (
      <ProtectedRoute allowedRoles={["employee", "hr", "admin"]}>
        <CreateTicket />
      </ProtectedRoute>
    ),
  },
  {
    path: "/hr",
    Component: () => (
      <ProtectedRoute allowedRoles={["hr", "admin"]}>
        <HRPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/tickets",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminTickets />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/employees",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminEmployees />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ticket/:id",
    Component: () => (
      <ProtectedRoute allowedRoles={["employee", "hr", "admin"]}>
        <TicketDetail />
      </ProtectedRoute>
    ),
  },
]);
```

---

## 🎯 Auth Service API Reference

### `loginWithEmailPassword(email, password)`
Signs in a user. Returns the Firebase `User` object.

```typescript
import { loginWithEmailPassword } from '../services/authService';

const user = await loginWithEmailPassword('admin@company.com', 'Admin@1234');
console.log(user.uid); // Firebase user ID
```

### `logout()`
Signs out the current user.

```typescript
import { logout } from '../services/authService';

await logout();
```

### `getCurrentUser()`
Returns the currently authenticated `User` or `null`.

```typescript
import { getCurrentUser } from '../services/authService';

const user = getCurrentUser();
if (user) {
  console.log(user.email);
}
```

### `getUserRole(uid)`
Fetches a user's role from Firestore.

```typescript
import { getUserRole } from '../services/authService';

const role = await getUserRole('user-uid-here');
console.log(role); // 'admin' | 'hr' | 'employee' | null
```

### `getUserData(uid)`
Fetches the full user document from Firestore.

```typescript
import { getUserData } from '../services/authService';

const userData = await getUserData('user-uid-here');
console.log(userData.email, userData.role);
```

### `hasRole(uid, requiredRoles)`
Check if a user has a specific role (async).

```typescript
import { hasRole } from '../services/authService';

const isAdmin = await hasRole('user-uid', ['admin']);
const isHROrAdmin = await hasRole('user-uid', ['hr', 'admin']);
```

---

## 🪝 useAuth Hook API Reference

```typescript
const { user, role, loading, error, hasRole, isAuthenticated } = useAuth();
```

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Firebase user object or null |
| `role` | `'admin' \| 'hr' \| 'employee' \| null` | User's role from Firestore |
| `loading` | `boolean` | True while fetching auth state or role |
| `error` | `string \| null` | Error message if any |
| `hasRole(roles)` | `(roles: Role[]) => boolean` | Check if user has a role (sync) |
| `isAuthenticated()` | `() => boolean` | Check if user is logged in |

---

## 🛡️ Security Best Practices

1. **Never hardcode credentials** → Use `.env` variables
2. **Never store sensitive data in localStorage** → Firebase handles this
3. **Always verify role on client AND server (Firestore Rules)** → Rules are enforced server-side
4. **Restrict API key** → Done in Google Cloud Console (see FIREBASE_SETUP.md)
5. **Use HTTPS only** → Production requirement
6. **Enable App Check** (optional but recommended for production):
   - Firebase Console → App Check → Enable
   - Choose reCAPTCHA v3 or device check

---

## 🧪 Testing the Setup

1. **Log in as Admin:**
   ```
   Email: admin@company.com
   Password: Admin@1234
   ```
   Should access all pages.

2. **Log in as HR:**
   ```
   Email: hr@company.com
   Password: Hr@1234
   ```
   Should access HR and Employee pages, not Admin.

3. **Log in as Employee:**
   ```
   Email: employee@company.com
   Password: Employee@1234
   ```
   Should only access Employee pages.

4. **Try accessing unauthorized page:**
   Should redirect to `/unauthorized`.

---

## 🐛 Troubleshooting

**"useAuth must be used within an <AuthProvider"**
- Make sure `<AuthProvider>` wraps your entire app in `App.tsx` ✓ (Already done)

**Loading spinner never stops**
- Check browser console for errors
- Verify Firebase credentials in `.env`
- Ensure `firebase.ts` is imported in `main.tsx` ✓ (Already done)

**Can't log in with seed users**
- Verify seed script ran successfully (check Firebase Console)
- Check that Email/Password auth is enabled in Firebase Console
- Clear browser cache and try again

**Role is always null**
- Check that `users` collection exists in Firestore
- Verify the `users/{uid}` document has a `role` field
- Check Firestore Security Rules allow reading your own document

**Firestore Security Rules rejecting writes**
- Ensure user is authenticated (`request.auth != null`)
- Verify user's role in Firestore matches the rule
- Check rule syntax in Firebase Console for errors

---

## 📦 What's Included

✅ Firebase Authentication (Email/Password)  
✅ Role-based access control (3 roles: admin, hr, employee)  
✅ Firestore integration for role storage  
✅ Protected routes with role checking  
✅ Global auth context  
✅ Auth service with reusable functions  
✅ useAuth hook with automatic role fetching  
✅ Seed script for default accounts  
✅ TypeScript support throughout  
✅ No UI/design changes to existing components  

---

## ✅ Checklist

- [ ] Firebase Email/Password auth enabled in Console
- [ ] `.env` file has Firebase credentials
- [ ] Firestore Security Rules deployed
- [ ] Seed script ran successfully (`npx ts-node src/scripts/seedUsers.ts`)
- [ ] Default users appear in Firebase Console → Authentication
- [ ] Users collection appears in Firestore with 3 documents
- [ ] `firebase.ts` imported in `main.tsx`
- [ ] `AuthProvider` wraps app in `App.tsx`
- [ ] Can log in with any of the 3 default accounts
- [ ] Role-based routing works (try unauthorized routes)
