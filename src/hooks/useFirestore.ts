import { useState, useCallback, useEffect, DocumentData, QueryConstraint } from 'react';
import {
  getDoc_,
  getDocs_,
  addDoc_,
  updateDoc_,
  deleteDoc_,
  queryDocs_,
} from '../services/firestoreService';

interface FirestoreState<T> {
  data: T | T[] | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for Firestore operations with state management
 * @template T - The data type for Firestore documents
 */
export const useFirestore = <T extends DocumentData = DocumentData>() => {
  const [state, setState] = useState<FirestoreState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Fetch a single document by ID
   */
  const fetchDoc = useCallback(
    async (collectionPath: string, docId: string) => {
      setState({ data: null, loading: true, error: null });
      try {
        const doc = await getDoc_<T>(collectionPath, docId);
        setState({ data: doc, loading: false, error: null });
        return doc;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState({ data: null, loading: false, error: errorMessage });
        console.error('fetchDoc error:', errorMessage);
      }
    },
    []
  );

  /**
   * Fetch all documents from a collection
   */
  const fetchDocs = useCallback(
    async (collectionPath: string, constraints: QueryConstraint[] = []) => {
      setState({ data: null, loading: true, error: null });
      try {
        const docs = await getDocs_<T>(collectionPath, constraints);
        setState({ data: docs, loading: false, error: null });
        return docs;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState({ data: null, loading: false, error: errorMessage });
        console.error('fetchDocs error:', errorMessage);
      }
    },
    []
  );

  /**
   * Query documents with constraints
   */
  const query = useCallback(
    async (collectionPath: string, constraints: QueryConstraint[]) => {
      setState({ data: null, loading: true, error: null });
      try {
        const docs = await queryDocs_<T>(collectionPath, constraints);
        setState({ data: docs, loading: false, error: null });
        return docs;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState({ data: null, loading: false, error: errorMessage });
        console.error('query error:', errorMessage);
      }
    },
    []
  );

  /**
   * Add a new document
   */
  const add = useCallback(
    async (collectionPath: string, data: T) => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      try {
        const docId = await addDoc_<T>(collectionPath, data);
        setState((prevState) => ({ ...prevState, loading: false }));
        return docId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState((prevState) => ({ ...prevState, loading: false, error: errorMessage }));
        console.error('add error:', errorMessage);
        throw error;
      }
    },
    []
  );

  /**
   * Update an existing document
   */
  const update = useCallback(
    async (collectionPath: string, docId: string, data: Partial<T>) => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      try {
        await updateDoc_<Partial<T>>(collectionPath, docId, data);
        setState((prevState) => ({ ...prevState, loading: false }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState((prevState) => ({ ...prevState, loading: false, error: errorMessage }));
        console.error('update error:', errorMessage);
        throw error;
      }
    },
    []
  );

  /**
   * Delete a document
   */
  const remove = useCallback(
    async (collectionPath: string, docId: string) => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      try {
        await deleteDoc_<T>(collectionPath, docId);
        setState((prevState) => ({ ...prevState, loading: false }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState((prevState) => ({ ...prevState, loading: false, error: errorMessage }));
        console.error('remove error:', errorMessage);
        throw error;
      }
    },
    []
  );

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
    fetchDoc,
    fetchDocs,
    query,
    add,
    update,
    remove,
    reset,
  };
};
