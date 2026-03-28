/**
 * Authentication Service
 * Handles Firebase Authentication operations and role management
 */

import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { mockUsers } from '../app/data/mockData';
import { sharedUserData } from '../shared/sharedUserData.js';

export type UserRole = 'admin' | 'hr' | 'employee';

const DEFAULT_SIGN_IN_TIMEOUT_MS = 15000;
const DEFAULT_BROWSER_CLOSE_REAUTH_MS = 5 * 60 * 1000;
const configuredTimeout = Number(import.meta.env.VITE_AUTH_SIGNIN_TIMEOUT_MS);
const configuredBrowserCloseReauth = Number(
  import.meta.env.VITE_AUTH_BROWSER_CLOSE_REAUTH_MS
);
const SIGN_IN_TIMEOUT_MS =
  Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : DEFAULT_SIGN_IN_TIMEOUT_MS;
const BROWSER_CLOSE_REAUTH_MS =
  Number.isFinite(configuredBrowserCloseReauth) &&
  configuredBrowserCloseReauth > 0
    ? configuredBrowserCloseReauth
    : DEFAULT_BROWSER_CLOSE_REAUTH_MS;
const BROWSER_CLOSE_TIMESTAMP_STORAGE_KEY = 'auth:closed-at';
const SIGN_IN_TIMEOUT_PENDING_STORAGE_KEY = 'auth:sign-in-timeout-pending';
const USER_COLLECTION_CANDIDATES = ['users', 'user'] as const;

/**
 * User data from Firestore
 */
export interface FirebaseUser {
  uid: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

type FirestoreUserRecord = Partial<FirebaseUser> & {
  id?: string;
  firstName?: string;
  lastName?: string;
};

const normalizeUserRole = (value: unknown): UserRole | null => {
  if (value === 'admin' || value === 'hr' || value === 'employee') {
    return value;
  }

  return null;
};

const DEMO_ROLE_BY_EMAIL: Record<string, UserRole> = {
  'admin@company.com': 'admin',
  'hr@company.com': 'hr',
  'employee@company.com': 'employee',
  ...Object.fromEntries(
    [...mockUsers, ...sharedUserData].flatMap((user) => {
      const email =
        typeof user.email === 'string' ? user.email.trim().toLowerCase() : '';
      const role = normalizeUserRole(user.role);

      if (!email || !role) return [];

      return [[email, role] as const];
    })
  ),
};

const resolveRoleFromEmail = (email?: string | null): UserRole | null => {
  if (!email) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const knownRole = DEMO_ROLE_BY_EMAIL[normalizedEmail];

  if (knownRole) return knownRole;

  const localPart = normalizedEmail.split('@')[0] || '';

  if (localPart.includes('admin')) return 'admin';
  if (/^hr([._-]|$)/.test(localPart) || localPart.includes('humanresources')) {
    return 'hr';
  }

  return null;
};

const createEmailFallbackUser = (
  uid: string,
  email?: string | null
): FirebaseUser | null => {
  if (!email) return null;

  const role = resolveRoleFromEmail(email);

  if (!role) return null;

  return {
    uid,
    email,
    role,
  };
};

const toFirebaseUser = (
  data: FirestoreUserRecord | undefined,
  fallback: { uid: string; email?: string | null }
): FirebaseUser | null => {
  if (!data) return null;

  const role = normalizeUserRole(data.role);

  if (!role) return null;

  return {
    uid: data.uid || fallback.uid,
    email: data.email || fallback.email || '',
    role,
    createdAt: data.createdAt,
  };
};

const findUserRecordByIdentity = async (
  uid: string,
  email?: string | null
): Promise<FirebaseUser | null> => {
  for (const collectionName of USER_COLLECTION_CANDIDATES) {
    try {
      const userDocSnap = await getDoc(doc(db, collectionName, uid));

      if (userDocSnap.exists()) {
        const resolvedUser = toFirebaseUser(
          userDocSnap.data() as FirestoreUserRecord,
          { uid, email }
        );

        if (resolvedUser) return resolvedUser;
      }
    } catch {
      // Some Firebase projects deny direct reads here. Continue to the next fallback.
    }
  }

  for (const collectionName of USER_COLLECTION_CANDIDATES) {
    try {
      const userQuery = query(
        collection(db, collectionName),
        where('uid', '==', uid),
        limit(1)
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        const resolvedUser = toFirebaseUser(
          userQuerySnapshot.docs[0].data() as FirestoreUserRecord,
          { uid, email }
        );

        if (resolvedUser) return resolvedUser;
      }
    } catch {
      // Some Firebase projects deny collection queries here. Continue to the next fallback.
    }
  }

  if (!email) return null;

  const emailCandidates = Array.from(new Set([email, email.toLowerCase()]));

  for (const collectionName of USER_COLLECTION_CANDIDATES) {
    for (const candidateEmail of emailCandidates) {
      try {
        const userQuery = query(
          collection(db, collectionName),
          where('email', '==', candidateEmail),
          limit(1)
        );
        const userQuerySnapshot = await getDocs(userQuery);

        if (!userQuerySnapshot.empty) {
          const resolvedUser = toFirebaseUser(
            userQuerySnapshot.docs[0].data() as FirestoreUserRecord,
            { uid, email: candidateEmail }
          );

          if (resolvedUser) return resolvedUser;
        }
      } catch {
        // Fall through to local/demo role resolution when Firestore blocks email queries.
      }
    }
  }

  return createEmailFallbackUser(uid, email);
};

/**
 * Sign in with email and password
 * @param email User email
 * @param password User password
 * @returns The authenticated Firebase user
 * @throws Error if authentication fails
 */
export const loginWithEmailPassword = async (
  email: string,
  password: string
): Promise<User> => {
  let didTimeout = false;

  clearPendingTimedOutSignIn();

  try {
    const signInAttempt = (async () => {
      await setPersistence(auth, browserLocalPersistence);
      return signInWithEmailAndPassword(auth, email, password);
    })();

    signInAttempt
      .then(async () => {
        if (didTimeout && auth.currentUser) {
          await signOut(auth);
        }
      })
      .catch(() => {
        // The main await below handles the original error path.
      });

    const userCredential = await Promise.race([
      signInAttempt,
      new Promise<never>((_, reject) => {
        window.setTimeout(() => {
          didTimeout = true;
          markPendingTimedOutSignIn();
          reject(new Error('auth/sign-in-timeout'));
        }, SIGN_IN_TIMEOUT_MS);
      }),
    ]);

    clearPendingTimedOutSignIn();
    return userCredential.user;
  } catch (error: any) {
    const errorCode = error?.code || error?.message;

    if (errorCode !== 'auth/sign-in-timeout') {
      clearPendingTimedOutSignIn();
    }

    const errorMessage = mapAuthError(errorCode);
    throw new Error(errorMessage);
  }
};

/**
 * Sign out the current user
 * @throws Error if sign out fails
 */
export const logout = async (): Promise<void> => {
  try {
    clearBrowserCloseTimestamp();
    await signOut(auth);
  } catch (error: any) {
    throw new Error(`Failed to sign out: ${error.message}`);
  }
};

export const markBrowserCloseTimestamp = (): void => {
  localStorage.setItem(BROWSER_CLOSE_TIMESTAMP_STORAGE_KEY, Date.now().toString());
};

export const clearBrowserCloseTimestamp = (): void => {
  localStorage.removeItem(BROWSER_CLOSE_TIMESTAMP_STORAGE_KEY);
};

const markPendingTimedOutSignIn = (): void => {
  sessionStorage.setItem(SIGN_IN_TIMEOUT_PENDING_STORAGE_KEY, '1');
};

export const clearPendingTimedOutSignIn = (): void => {
  sessionStorage.removeItem(SIGN_IN_TIMEOUT_PENDING_STORAGE_KEY);
};

export const hasPendingTimedOutSignIn = (): boolean => {
  return sessionStorage.getItem(SIGN_IN_TIMEOUT_PENDING_STORAGE_KEY) === '1';
};

export const shouldReauthenticateAfterBrowserClose = (): boolean => {
  const closedAtRaw = localStorage.getItem(BROWSER_CLOSE_TIMESTAMP_STORAGE_KEY);

  if (!closedAtRaw) return false;

  const closedAt = Number(closedAtRaw);

  if (!Number.isFinite(closedAt)) {
    clearBrowserCloseTimestamp();
    return false;
  }

  return Date.now() - closedAt >= BROWSER_CLOSE_REAUTH_MS;
};

/**
 * Get the currently authenticated user
 * @returns The current Firebase user or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Get the current user's Firebase ID token
 * @param forceRefresh Whether to force token refresh
 * @returns The ID token or null if not authenticated
 */
export const getAuthToken = async (forceRefresh = false): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken(forceRefresh);
  } catch (error: any) {
    console.error('Failed to get auth token:', error.message);
    return null;
  }
};

/**
 * Get the role of a user from Firestore
 * @param uid User ID
 * @param email Optional email used as a fallback lookup key
 * @returns The user's role or null if not found
 * @throws Error if fetching role fails
 */
export const getUserRole = async (
  uid: string,
  email?: string | null
): Promise<UserRole | null> => {
  try {
    const userData = await findUserRecordByIdentity(uid, email);
    return userData?.role || null;
  } catch (error: any) {
    console.error(`Failed to fetch user role for ${uid}:`, error.message);
    return createEmailFallbackUser(uid, email)?.role || null;
  }
};

/**
 * Get full user data from Firestore
 * @param uid User ID
 * @param email Optional email used as a fallback lookup key
 * @returns The user's Firestore document or null if not found
 * @throws Error if fetching user data fails
 */
export const getUserData = async (
  uid: string,
  email?: string | null
): Promise<FirebaseUser | null> => {
  try {
    return await findUserRecordByIdentity(uid, email);
  } catch (error: any) {
    console.error(`Failed to fetch user data for ${uid}:`, error.message);
    return createEmailFallbackUser(uid, email);
  }
};

/**
 * Map Firebase authentication error codes to user-friendly messages
 * @param errorCode Firebase error code
 * @returns User-friendly error message
 */
const mapAuthError = (errorCode: string): string => {
  const errorMap: { [key: string]: string } = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-not-found': 'User not found. Please check your email',
    'auth/wrong-password': 'Incorrect password. Please try again',
    'auth/user-disabled': 'This account has been disabled',
    'auth/too-many-requests': 'Too many failed login attempts. Try again later',
    'auth/email-already-in-use': 'Email is already in use',
    'auth/weak-password': 'Password is too weak',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/sign-in-timeout': `Sign in timed out after ${Math.round(
      SIGN_IN_TIMEOUT_MS / 1000
    )} seconds. Please try again.`,
  };

  return errorMap[errorCode] || `Authentication error: ${errorCode}`;
};

/**
 * Check if user has a specific role
 * @param uid User ID
 * @param requiredRoles Array of required roles
 * @returns True if user has one of the required roles
 */
export const hasRole = async (
  uid: string,
  requiredRoles: UserRole[]
): Promise<boolean> => {
  try {
    const role = await getUserRole(uid);
    return role ? requiredRoles.includes(role) : false;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};
