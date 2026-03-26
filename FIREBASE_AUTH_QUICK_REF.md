# Firebase Auth Integration - Quick Reference

## 📁 Complete File Structure

```
HR-Ticketing-System/
├── src/
│   ├── lib/
│   │   └── firebase.ts ✅ (READY - auth already exported)
│   ├── services/
│   │   ├── firestoreService.ts (existing)
│   │   ├── realtimeDbService.ts (existing)
│   │   └── authService.ts ✅ NEW
│   ├── hooks/
│   │   ├── useFirestore.ts (existing)
│   │   ├── useRealtimeDb.ts (existing)
│   │   └── useAuth.ts ✅ NEW
│   ├── scripts/
│   │   └── seedUsers.ts ✅ NEW
│   ├── main.tsx ✅ (UPDATED - added firebase import)
│   └── app/
│       ├── contexts/
│       │   ├── AuthContext.tsx ✅ (UPDATED - now Firebase-based)
│       │   └── ThemeContext.tsx (existing)
│       ├── components/
│       │   ├── ProtectedRoute.tsx ✅ NEW
│       │   └── ... (other components unchanged)
│       ├── features/
│       │   ├── auth/
│       │   │   └── LoginPage.tsx (existing - can be updated)
│       │   ├── employee/
│       │   ├── hr/
│       │   └── admin/
│       ├── App.tsx ✅ (ALREADY HAS AuthProvider)
│       └── routes.ts (existing - can be updated with ProtectedRoute)
├── .env ✅ (existing - already has Firebase config)
├── .env.example ✅ (existing)
├── .gitignore ✅ (already excludes .env)
└── FIREBASE_AUTH_SETUP.md ✅ NEW (comprehensive guide)
```

---

## ✅ Files Already Done

### 1. Firebase Initialization ✅
**File:** `src/lib/firebase.ts`  
**Status:** READY - Already exports `auth`  
**No changes needed.**

### 2. Firebase Config in Env ✅
**Files:** `.env`, `.env.example`  
**Status:** READY - Already has VITE_FIREBASE_* variables  
**No changes needed.**

### 3. App Setup ✅
**File:** `src/app/App.tsx`  
**Status:** READY - Already has `<AuthProvider>`  
**No changes needed.**

**Current content:**
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

### 4. Firebase Initialization in Main ✅
**File:** `src/main.tsx`  
**Status:** UPDATED - Import added at the top  
**Current content:**
```typescript
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Initialize Firebase
import "./lib/firebase";

createRoot(document.getElementById("root")!).render(<App />);
```

---

## 📝 Files to Create

### 1. Auth Service ✅
**File:** `src/services/authService.ts`  
**Contains:**
- `loginWithEmailPassword(email, password)`
- `logout()`
- `getCurrentUser()`
- `getUserRole(uid)`
- `getUserData(uid)`
- `hasRole(uid, requiredRoles)`
- `UserRole` type and `FirebaseUser` interface

### 2. useAuth Hook ✅
**File:** `src/hooks/useAuth.ts`  
**Returns:**
```typescript
{
  user: User | null,
  role: UserRole | null,
  loading: boolean,
  error: string | null,
  hasRole(requiredRoles): boolean,
  isAuthenticated(): boolean
}
```

### 3. AuthContext (Updated) ✅
**File:** `src/app/contexts/AuthContext.tsx`  
**Replaces mock-based auth with Firebase auth**  
**Exports:**
- `<AuthProvider>` - wrap your app with this
- `useAuth()` - hook to access auth state

### 4. ProtectedRoute Component ✅
**File:** `src/app/components/ProtectedRoute.tsx`  
**Usage:**
```typescript
<ProtectedRoute allowedRoles={["admin", "hr"]}>
  <AdminDashboard />
</ProtectedRoute>
```

### 5. Seed Script ✅
**File:** `src/scripts/seedUsers.ts`  
**Run once:** `npx ts-node src/scripts/seedUsers.ts`  
**Creates:**
- admin@company.com / Admin@1234 (role: admin)
- hr@company.com / Hr@1234 (role: hr)
- employee@company.com / Employee@1234 (role: employee)

---

## 🔧 Optional: Update LoginPage

**File:** `src/app/features/auth/LoginPage.tsx`  
**Action:** Use the `loginWithEmailPassword()` service instead of mock login

**Before (mock):**
```typescript
const [user, setUser] = useAuth(); // From old mock context
```

**After (Firebase):**
```typescript
import { loginWithEmailPassword } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmailPassword(email, password);
      navigate('/employee');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Your existing form JSX */}
    </form>
  );
};
```

---

## 🔐 Optional: Update Routes with ProtectedRoute

**File:** `src/app/routes.ts`

**Before:**
```typescript
{
  path: "/admin",
  Component: AdminDashboard,
}
```

**After:**
```typescript
{
  path: "/admin",
  Component: () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  ),
}
```

---

## 📚 Updating Firestore Security Rules

**File:** Firebase Console → Firestore Database → Rules tab

**Replace with:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Tickets collection
    match /tickets/{ticketId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🚀 Setup Checklist

```
Step 1: File Creation
  ☐ src/services/authService.ts
  ☐ src/hooks/useAuth.ts
  ☐ src/scripts/seedUsers.ts
  ☐ src/app/components/ProtectedRoute.tsx
  ☐ FIREBASE_AUTH_SETUP.md

Step 2: File Updates
  ☐ src/main.tsx - add firebase import
  ☐ src/app/contexts/AuthContext.tsx - replace mock auth

Step 3: Firebase Console
  ☐ Enable Email/Password authentication
  ☐ Deploy Firestore Security Rules
  ☐ Verify .env has Firebase credentials

Step 4: Data Setup
  ☐ Install deps: npm install -D dotenv ts-node
  ☐ Run seed script: npx ts-node src/scripts/seedUsers.ts
  ☐ Verify in Firebase Console: 3 users created

Step 5: Testing
  ☐ Try logging in with admin@company.com
  ☐ Try logging in with hr@company.com
  ☐ Try accessing unauthorized routes
  ☐ Verify role-based redirects work

Step 6: Optional Enhancements
  ☐ Update LoginPage to use auth service
  ☐ Wrap routes with ProtectedRoute
  ☐ Add logout button to navbar
```

---

## 🎯 Key Functions to Know

### In Components

```typescript
// Access auth state
import { useAuth } from '../../contexts/AuthContext';
const { user, role, loading } = useAuth();

// Check role
import { useAuth } from '../../hooks/useAuth';
const { hasRole } = useAuth();
if (hasRole(['admin'])) { /* show admin stuff */ }

// Protected route
import { ProtectedRoute } from '../../components/ProtectedRoute';
<ProtectedRoute allowedRoles={["admin"]}>
  <AdminPanel />
</ProtectedRoute>
```

### In Services/Utils

```typescript
// Outside of React components
import { loginWithEmailPassword, logout, getUserRole } from '../services/authService';

await loginWithEmailPassword('admin@company.com', 'Admin@1234');
await logout();
const role = await getUserRole(uid);
```

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "useAuth must be used within AuthProvider" | Check that `<AuthProvider>` wraps your app in `App.tsx` |
| Loading spinner never stops | Check browser console, verify `.env` has Firebase config |
| Login not working | Enable Email/Password in Firebase Console |
| Role is always null | Check Firestore has `users/{uid}` documents with `role` field |
| Can't access admin pages | Check user role in Firestore `users` collection |
| Firestore permission denied | Deploy the provided security rules |

---

## 📖 Full Documentation

See `FIREBASE_AUTH_SETUP.md` for complete setup guide with:
- Detailed step-by-step instructions
- Code examples for all features
- API reference for all functions
- Troubleshooting guide
- Security best practices
