/**
 * useAuth Hook
 * Manages authentication state and role information globally
 * Automatically cleans up listeners on unmount
 */

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserData, UserRole } from '../services/authService';

interface AuthState {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing Firebase authentication state and user role
 * @returns Object with user, role, loading, error, and logout function
 */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
    error: null,
  });

  /**
   * Fetch user's role from Firestore
   */
  const fetchUserRole = useCallback(async (uid: string, email?: string | null) => {
    try {
      const userRole = (await getUserData(uid, email))?.role ?? null;
      setState((prevState) => ({
        ...prevState,
        role: userRole,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user role';
      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
        loading: false,
      }));
    }
  }, []);

  /**
   * Listen to authentication state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          // User is logged in
          setState((prevState) => ({
            ...prevState,
            user,
            loading: true,
            error: null,
          }));

          // Fetch their role from Firestore
          await fetchUserRole(user.uid, user.email);
        } else {
          // User is logged out
          setState({
            user: null,
            role: null,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        setState({
          user: null,
          role: null,
          loading: false,
          error: error.message,
        });
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [fetchUserRole]);

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (requiredRoles: UserRole | UserRole[]): boolean => {
      if (!state.role) return false;
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      return roles.includes(state.role);
    },
    [state.role]
  );

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback((): boolean => {
    return state.user !== null;
  }, [state.user]);

  return {
    user: state.user,
    role: state.role,
    loading: state.loading,
    error: state.error,
    hasRole,
    isAuthenticated,
  };
};
