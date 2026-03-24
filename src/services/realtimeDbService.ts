import {
  ref,
  get,
  set,
  update,
  remove,
  onValue,
  Unsubscribe,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  query,
  orderByChild,
  limitToLast,
  limitToFirst,
  startAt,
  endAt,
} from 'firebase/database';
import { realtimeDb } from '../lib/firebase';

/**
 * Generic Firebase Realtime Database Service Layer
 * Provides reusable read/write/listen operations for Realtime Database
 */

/**
 * Get a single value from the database once
 * @template T - The data type expected
 * @param path - The database path (e.g., 'users/user1')
 * @returns The data at that path, or null if not found
 */
export const getDBValue_<T = any>(path: string): Promise<T | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const dbRef = ref(realtimeDb, path);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        resolve(snapshot.val() as T);
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(new Error(`Failed to fetch from database: ${error}`));
    }
  });
}

/**
 * Set a value at a path (overwrites existing data)
 * @template T - The data type to set
 * @param path - The database path
 * @param data - The data to set
 */
export const setDBValue_<T = any>(path: string, data: T): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const dbRef = ref(realtimeDb, path);
      await set(dbRef, data);
      resolve();
    } catch (error) {
      reject(new Error(`Failed to set value in database: ${error}`));
    }
  });
}

/**
 * Update specific fields at a path (merges with existing data)
 * @template T - The partial data type to update
 * @param path - The database path
 * @param updates - The fields to update (partial object)
 */
export const updateDBValue_<T = any>(path: string, updates: Partial<T>): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const dbRef = ref(realtimeDb, path);
      await update(dbRef, updates as any);
      resolve();
    } catch (error) {
      reject(new Error(`Failed to update value in database: ${error}`));
    }
  });
}

/**
 * Delete a value at a path
 * @param path - The database path
 */
export const deleteDBValue_(path: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const dbRef = ref(realtimeDb, path);
      await remove(dbRef);
      resolve();
    } catch (error) {
      reject(new Error(`Failed to delete from database: ${error}`));
    }
  });
}

/**
 * Listen to changes at a path (real-time listener)
 * Returns unsubscribe function to cleanup
 * @template T - The data type expected
 * @param path - The database path
 * @param callback - Function called with data whenever it changes
 * @returns Unsubscribe function to stop listening
 */
export const listenToDBValue_<T = any>(
  path: string,
  callback: (data: T | null) => void
): Unsubscribe {
  try {
    const dbRef = ref(realtimeDb, path);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val() as T);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`Error listening to database path: ${error}`);
        callback(null);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error(`Failed to set up listener: ${error}`);
    return () => {};
  }
}

/**
 * Listen to child added events
 * Useful for incrementally loading lists
 * @template T - The data type expected for each child
 * @param path - The database path
 * @param callback - Function called when a child is added
 * @returns Unsubscribe function to stop listening
 */
export const listenToChildAdded_<T = any>(
  path: string,
  callback: (data: T, key: string) => void
): Unsubscribe {
  try {
    const dbRef = ref(realtimeDb, path);
    const unsubscribe = onChildAdded(
      dbRef,
      (snapshot) => {
        callback(snapshot.val() as T, snapshot.key || '');
      },
      (error) => {
        console.error(`Error listening to child added events: ${error}`);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error(`Failed to set up child added listener: ${error}`);
    return () => {};
  }
}

/**
 * Listen to child changed events
 * Useful for real-time updates to existing items
 * @template T - The data type expected for each child
 * @param path - The database path
 * @param callback - Function called when a child changes
 * @returns Unsubscribe function to stop listening
 */
export const listenToChildChanged_<T = any>(
  path: string,
  callback: (data: T, key: string) => void
): Unsubscribe {
  try {
    const dbRef = ref(realtimeDb, path);
    const unsubscribe = onChildChanged(
      dbRef,
      (snapshot) => {
        callback(snapshot.val() as T, snapshot.key || '');
      },
      (error) => {
        console.error(`Error listening to child changed events: ${error}`);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error(`Failed to set up child changed listener: ${error}`);
    return () => {};
  }
}

/**
 * Listen to child removed events
 * Useful for handling deleted items
 * @param path - The database path
 * @param callback - Function called when a child is removed
 * @returns Unsubscribe function to stop listening
 */
export const listenToChildRemoved_(
  path: string,
  callback: (key: string) => void
): Unsubscribe {
  try {
    const dbRef = ref(realtimeDb, path);
    const unsubscribe = onChildRemoved(
      dbRef,
      (snapshot) => {
        callback(snapshot.key || '');
      },
      (error) => {
        console.error(`Error listening to child removed events: ${error}`);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error(`Failed to set up child removed listener: ${error}`);
    return () => {};
  }
}

/**
 * Query with ordering and limiting
 * Example: queryDB_('posts', orderByChild('timestamp'), limitToLast(10))
 * @template T - The data type expected
 * @param path - The database path
 * @param constraints - Firebase query constraints
 * @returns The queried data
 */
export const queryDB_<T = any>(
  path: string,
  ...constraints: Parameters<typeof query>
): Promise<{ [key: string]: T }> {
  return new Promise(async (resolve, reject) => {
    try {
      const dbRef = ref(realtimeDb, path);
      const q = query(dbRef, ...constraints);
      const snapshot = await get(q);

      if (snapshot.exists()) {
        resolve(snapshot.val() as { [key: string]: T });
      } else {
        resolve({});
      }
    } catch (error) {
      reject(new Error(`Query failed: ${error}`));
    }
  });
}
