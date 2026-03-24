# Firebase Integration Setup Guide

## 📋 File Structure Created

```
src/
├── lib/
│   └── firebase.ts                 # Firebase initialization
├── services/
│   ├── firestoreService.ts        # Firestore CRUD operations
│   └── realtimeDbService.ts       # Realtime DB read/write/listen
└── hooks/
    ├── useFirestore.ts             # Firestore hook with state management
    └── useRealtimeDb.ts            # Realtime DB hook with state management
├── .env                            # Environment variables (local only, not in git)
└── .env.example                    # Template for environment variables
```

---

## 🔑 Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to **Project Settings** (gear icon)
4. Under **Your apps**, click on the **Web** icon (if not already created)
5. Copy your Firebase configuration
6. Fill in your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

**⚠️ IMPORTANT:** 
- Never commit `.env` (already in `.gitignore`)
- Keep `.env.example` in git so team members know what variables are needed
- Each developer should have their own `.env` file locally

---

## 🔐 Step 2: Set Up Firestore Security Rules

In Firebase Console:
1. Go to **Firestore Database**
2. Click **Rules** tab
3. Replace with this rule set (for authenticated users):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Allow authenticated users to read/write tickets
    match /tickets/{ticketId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       request.resource.data.createdBy == request.auth.uid;
      allow update, delete: if request.auth.uid == resource.data.createdBy ||
                               request.auth.uid == resource.data.assignedTo;
    }

    // Allow HR to manage all data
    match /{document=**} {
      allow read, write: if request.auth.token.claims.role == 'hr' ||
                            request.auth.token.claims.role == 'admin';
    }
  }
}
```

**Publish** the rules.

---

## 🔐 Step 3: Set Up Realtime Database Security Rules

In Firebase Console:
1. Go to **Realtime Database** (create one if not exists, select "Start in test mode")
2. Click **Rules** tab
3. Replace with this rule set:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "presence": {
      "$uid": {
        ".read": "auth !== null",
        ".write": "$uid === auth.uid"
      }
    },
    "notifications": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    }
  }
}
```

**Publish** the rules.

---

## 🔐 Step 4: Restrict Firebase API Key (CRITICAL)

To prevent API key misuse:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Find your Web API key
5. Click the key to edit it
6. Under **Application restrictions**, select **HTTP referrers**
7. Add your domain (e.g., `https://yourdomain.com/*`)
8. Under **API restrictions**, select **Restrict key** and enable only:
   - Cloud Firestore API
   - Firebase Realtime Database API
   - Firebase Authentication API

---

## 📦 Step 5: Import Firebase in Your App

In your main app file (e.g., `src/main.tsx`), import Firebase to initialize it:

```typescript
import './app/index.css'
import App from './app/App'
import ReactDOM from 'react-dom/client'

// Initialize Firebase at app startup
import './lib/firebase'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 🎣 Step 6: Using Hooks in Your Components

### Using `useFirestore` Hook

**Example: Fetching and creating tickets**

```typescript
import { useState } from 'react'
import { useFirestore } from '../hooks/useFirestore'

interface Ticket {
  id?: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'closed'
  createdBy: string
  createdAt?: string
}

export const TicketComponent = () => {
  const firestore = useFirestore<Ticket>()
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({})

  // Fetch all tickets
  const handleFetchTickets = async () => {
    await firestore.fetchDocs('tickets')
  }

  // Add a new ticket
  const handleCreateTicket = async () => {
    try {
      const docId = await firestore.add('tickets', {
        title: newTicket.title!,
        description: newTicket.description!,
        status: 'open',
        createdBy: 'user123',
      })
      console.log('Ticket created with ID:', docId)
      setNewTicket({}) // Reset form
      await handleFetchTickets() // Refresh list
    } catch (error) {
      console.error('Failed to create ticket:', error)
    }
  }

  // Update a ticket
  const handleUpdateTicket = async (ticketId: string) => {
    try {
      await firestore.update('tickets', ticketId, {
        status: 'in-progress',
      })
      await handleFetchTickets() // Refresh list
    } catch (error) {
      console.error('Failed to update ticket:', error)
    }
  }

  return (
    <div>
      {firestore.loading && <p>Loading...</p>}
      {firestore.error && <p className="text-red-600">Error: {firestore.error}</p>}
      
      {Array.isArray(firestore.data) && (
        <div>
          {firestore.data.map((ticket: any) => (
            <div key={ticket.id}>
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              <span className={`badge badge-${ticket.status}`}>{ticket.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Using `useRealtimeDb` Hook

**Example: Real-time presence tracking**

```typescript
import { useEffect } from 'react'
import { useRealtimeDb } from '../hooks/useRealtimeDb'

interface UserPresence {
  online: boolean
  lastSeen: string
}

export const PresenceComponent = ({ userId }: { userId: string }) => {
  const realtimeDb = useRealtimeDb<UserPresence>()

  // Set user as online on mount
  useEffect(() => {
    const presencePath = `presence/${userId}`
    
    realtimeDb.setValue(presencePath, {
      online: true,
      lastSeen: new Date().toISOString(),
    })

    // Cleanup: set offline on unmount
    return () => {
      realtimeDb.setValue(presencePath, {
        online: false,
        lastSeen: new Date().toISOString(),
      })
    }
  }, [userId])

  return <div>Status: {realtimeDb.data?.online ? '🟢 Online' : '⚫ Offline'}</div>
}
```

**Example: Real-time listener for notifications**

```typescript
import { useEffect, useState } from 'react'
import { useRealtimeDb } from '../hooks/useRealtimeDb'

interface Notification {
  id: string
  message: string
  timestamp: string
}

export const NotificationsComponent = ({ userId }: { userId: string }) => {
  const realtimeDb = useRealtimeDb<Notification>()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const notificationsPath = `notifications/${userId}`

    // Listen to new notifications
    const unsubscribe = realtimeDb.listenToAdded(
      notificationsPath,
      (data, key) => {
        setNotifications((prev) => [...prev, { id: key, ...data }])
      }
    )

    // Cleanup listener on unmount
    return () => {
      unsubscribe()
    }
  }, [userId])

  return (
    <div>
      <h3>Notifications ({notifications.length})</h3>
      {notifications.map((notif) => (
        <div key={notif.id} className="notification">
          {notif.message}
        </div>
      ))}
    </div>
  )
}
```

---

## 🗂️ Using Query Constraints

### Firestore Queries

```typescript
import { where, orderBy, limit } from 'firebase/firestore'
import { useFirestore } from '../hooks/useFirestore'

const MyComponent = () => {
  const firestore = useFirestore()

  // Query: Get open tickets ordered by creation date, limit 10
  const handleQueryTickets = async () => {
    await firestore.query('tickets', [
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc'),
      limit(10),
    ])
  }

  // ...
}
```

### Realtime Database Queries

```typescript
import { orderByChild, limitToLast } from 'firebase/database'
import { useRealtimeDb } from '../hooks/useRealtimeDb'

const MyComponent = () => {
  const realtimeDb = useRealtimeDb()

  // Query: Get last 5 posts ordered by timestamp
  const handleQueryPosts = async () => {
    const posts = await realtimeDb.getValue('posts')
    // For Realtime DB, you typically fetch then filter on client
  }

  // ...
}
```

---

## ❌ What NOT to Do

1. **Don't hardcode Firebase credentials** → Use `.env` variables
2. **Don't commit `.env`** → Already in `.gitignore`
3. **Don't expose API key without restrictions** → Follow Step 4 above
4. **Don't use rules in "test mode" in production** → Use the security rules provided
5. **Don't forget to clean up listeners** → The hook handles this automatically with `useEffect` cleanup
6. **Don't modify components' JSX or styles** → Only add data-fetching logic

---

## ✅ Integration Checklist

- [ ] Firebase package installed (`npm install firebase`)
- [ ] `.env` file filled with your Firebase credentials
- [ ] `.env` added to `.gitignore`
- [ ] `.env.example` committed to repository
- [ ] `src/lib/firebase.ts` created and initialized
- [ ] `src/services/firestoreService.ts` created
- [ ] `src/services/realtimeDbService.ts` created
- [ ] `src/hooks/useFirestore.ts` created
- [ ] `src/hooks/useRealtimeDb.ts` created
- [ ] Firebase initialized in `src/main.tsx` (import firebase)
- [ ] Firestore Security Rules deployed
- [ ] Realtime Database Security Rules deployed
- [ ] Firebase API key restricted in Google Cloud Console
- [ ] Firebase Authentication enabled (if using auth)

---

## 🚀 Next Steps

1. **Set up Firebase Authentication** (optional, but recommended for security):
   ```typescript
   // In your auth context
   import { auth } from '../lib/firebase'
   import { onAuthStateChanged } from 'firebase/auth'
   ```

2. **Add loading skeletons** to components while `loading` is `true`

3. **Add error boundaries** to handle errors gracefully

4. **Test with your data** by creating/reading/updating/deleting documents

5. **Monitor Firebase usage** in the Console to watch for any anomalies

---

## 🐛 Troubleshooting

**Environment variables not loading?**
- Ensure variables start with `VITE_`
- Restart the dev server after changing `.env`
- Use `import.meta.env.VITE_*` (not `process.env`)

**Permission denied errors?**
- Check Firestore/Realtime DB Security Rules
- Ensure user is authenticated (if required by rules)
- Check custom claims in Firebase Authentication

**Listener not updating?**
- Ensure listener is active (not unsubscribed)
- Check browser console for listener setup errors
- Verify data is being written to the correct path

**Slow queries?**
- Add composite indexes (Firebase will suggest when needed)
- Use `limit()` to reduce data transfer
- Paginate large result sets
