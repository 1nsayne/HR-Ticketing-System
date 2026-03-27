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
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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

/**
 * User data from Firestore
 */
export interface FirebaseUser {
  uid: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

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
          reject(new Error('auth/sign-in-timeout'));
        }, SIGN_IN_TIMEOUT_MS);
      }),
    ]);

    return userCredential.user;
  } catch (error: any) {
    const errorCode = error?.code || error?.message;
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
 * @returns The user's role or null if not found
 * @throws Error if fetching role fails
 */
export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data() as FirebaseUser;
      return data.role || null;
    }
    return null;
  } catch (error: any) {
    console.error(`Failed to fetch user role for ${uid}:`, error.message);
    return null;
  }
};

/**
 * Get full user data from Firestore
 * @param uid User ID
 * @returns The user's Firestore document or null if not found
 * @throws Error if fetching user data fails
 */
export const getUserData = async (uid: string): Promise<FirebaseUser | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as FirebaseUser;
    }
    return null;
  } catch (error: any) {
    console.error(`Failed to fetch user data for ${uid}:`, error.message);
    return null;
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
