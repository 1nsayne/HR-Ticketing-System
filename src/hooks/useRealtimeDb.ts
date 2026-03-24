import { useState, useCallback, useEffect, Unsubscribe } from 'react';
import {
  getDBValue_,
  setDBValue_,
  updateDBValue_,
  deleteDBValue_,
  listenToDBValue_,
  listenToChildAdded_,
  listenToChildChanged_,
  listenToChildRemoved_,
} from '../services/realtimeDbService';

interface RealtimeDBState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for Firebase Realtime Database operations with state management
 * Automatically cleans up listeners on unmount
 * @template T - The data type for the database value
 */
export const useRealtimeDb = <T = any>() => {
  const [state, setState] = useState<RealtimeDBState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const [unsubscribe, setUnsubscribe] = useState<Unsubscribe | null>(null);

  /**
   * Fetch a single value from the database (one-time read)
   */
  const getValue = useCallback(async (path: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const value = await getDBValue_<T>(path);
      setState({ data: value, loading: false, error: null });
      return value;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ data: null, loading: false, error: errorMessage });
      console.error('getValue error:', errorMessage);
    }
  }, []);

  /**
   * Set a value in the database (overwrites)
   */
  const setValue = useCallback(async (path: string, data: T) => {
    setState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      await setDBValue_<T>(path, data);
      setState((prevState) => ({ ...prevState, data, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState((prevState) => ({ ...prevState, loading: false, error: errorMessage }));
      console.error('setValue error:', errorMessage);
      throw error;
    }
  }, []);

  /**
   * Update fields in the database (merges)
   */
  const updateValue = useCallback(
    async (path: string, updates: Partial<T>) => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      try {
        await updateDBValue_<T>(path, updates);
        setState((prevState) => ({
          ...prevState,
          data: { ...prevState.data, ...updates } as T,
          loading: false,
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState((prevState) => ({ ...prevState, loading: false, error: errorMessage }));
        console.error('updateValue error:', errorMessage);
        throw error;
      }
    },
    []
  );

  /**
   * Delete a value from the database
   */
  const deleteValue = useCallback(async (path: string) => {
    setState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      await deleteDBValue_(path);
      setState({ data: null, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState((prevState) => ({ ...prevState, loading: false, error: errorMessage }));
      console.error('deleteValue error:', errorMessage);
      throw error;
    }
  }, []);

  /**
   * Listen to real-time changes at a path
   * Automatically sets up and cleans up the listener
   */
  const listen = useCallback((path: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const unsub = listenToDBValue_<T>(path, (data) => {
        setState({ data, loading: false, error: null });
      });
      setUnsubscribe(() => unsub);
      return unsub;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ data: null, loading: false, error: errorMessage });
      console.error('listen error:', errorMessage);
      return () => {};
    }
  }, []);

  /**
   * Listen to child added events (incremental loading)
   * Returns unsubscribe function
   */
  const listenToAdded = useCallback(
    (path: string, callback: (data: T, key: string) => void) => {
      try {
        const unsub = listenToChildAdded_<T>(path, callback);
        setUnsubscribe(() => unsub);
        return unsub;
      } catch (error) {
        console.error('listenToAdded error:', error);
        return () => {};
      }
    },
    []
  );

  /**
   * Listen to child changed events
   * Returns unsubscribe function
   */
  const listenToChanged = useCallback(
    (path: string, callback: (data: T, key: string) => void) => {
      try {
        const unsub = listenToChildChanged_<T>(path, callback);
        setUnsubscribe(() => unsub);
        return unsub;
      } catch (error) {
        console.error('listenToChanged error:', error);
        return () => {};
      }
    },
    []
  );

  /**
   * Listen to child removed events
   * Returns unsubscribe function
   */
  const listenToRemoved = useCallback(
    (path: string, callback: (key: string) => void) => {
      try {
        const unsub = listenToChildRemoved_(path, callback);
        setUnsubscribe(() => unsub);
        return unsub;
      } catch (error) {
        console.error('listenToRemoved error:', error);
        return () => {};
      }
    },
    []
  );

  /**
   * Cleanup listener on unmount
   */
  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /**
   * Manually unsubscribe from listener
   */
  const stopListening = useCallback(() => {
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(null);
    }
  }, [unsubscribe]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    getValue,
    setValue,
    updateValue,
    deleteValue,
    listen,
    listenToAdded,
    listenToChanged,
    listenToRemoved,
    stopListening,
    reset,
  };
};
