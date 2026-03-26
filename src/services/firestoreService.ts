import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  Query,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Generic Firestore Service Layer
 * Provides reusable CRUD operations for Firestore collections
 */

/**
 * Get a single document by ID
 * @template T - The data type of the document
 * @param collectionPath - The Firestore collection path
 * @param docId - The document ID
 * @returns The document data with ID, or null if not found
 */
export const getDoc_ = <T extends DocumentData = DocumentData>(
  collectionPath: string,
  docId: string
): Promise<(T & { id: string }) | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        resolve({
          id: docSnap.id,
          ...docSnap.data(),
        } as T & { id: string });
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(new Error(`Failed to fetch document: ${error}`));
    }
  });
}

/**
 * Get all documents from a collection with optional filters
 * @template T - The data type of documents
 * @param collectionPath - The Firestore collection path
 * @param constraints - Optional Firestore query constraints
 * @returns Array of documents with their IDs
 */
export const getDocs_ = <T extends DocumentData = DocumentData>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const q: Query<DocumentData> = query(
        collection(db, collectionPath),
        ...constraints
      );
      const querySnapshot = await getDocs(q);

      const documents: (T & { id: string })[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        } as T & { id: string });
      });

      resolve(documents);
    } catch (error) {
      reject(new Error(`Failed to fetch documents: ${error}`));
    }
  });
}

/**
 * Add a new document to a collection
 * @template T - The data type of the document
 * @param collectionPath - The Firestore collection path
 * @param data - The document data
 * @returns The ID of the newly created document
 */
export const addDoc_ = <T extends DocumentData = DocumentData>(
  collectionPath: string,
  data: T
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = await addDoc(collection(db, collectionPath), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      resolve(docRef.id);
    } catch (error) {
      reject(new Error(`Failed to add document: ${error}`));
    }
  });
}

/**
 * Update an existing document
 * @template T - The data type of the document
 * @param collectionPath - The Firestore collection path
 * @param docId - The document ID
 * @param data - The partial data to update
 */
export const updateDoc_ = <T extends Partial<DocumentData> = Partial<DocumentData>>(
  collectionPath: string,
  docId: string,
  data: T
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      resolve();
    } catch (error) {
      reject(new Error(`Failed to update document: ${error}`));
    }
  });
}

/**
 * Delete a document
 * @param collectionPath - The Firestore collection path
 * @param docId - The document ID
 */
export const deleteDoc_ = <T extends DocumentData = DocumentData>(
  collectionPath: string,
  docId: string
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionPath, docId);
      await deleteDoc(docRef);
      resolve();
    } catch (error) {
      reject(new Error(`Failed to delete document: ${error}`));
    }
  });
}

/**
 * Query documents with multiple constraints
 * Example: queryDocs_('users', [where('status', '==', 'active'), orderBy('name')])
 * @template T - The data type of documents
 * @param collectionPath - The Firestore collection path
 * @param constraints - Array of Firestore QueryConstraints (where, orderBy, limit, etc.)
 * @returns Array of matching documents with their IDs
 */
export const queryDocs_ = <T extends DocumentData = DocumentData>(
  collectionPath: string,
  constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> => {
  return getDocs_<T>(collectionPath, constraints);
}

/**
 * Batch write helper for multiple operations
 * @template T - The data type of documents
 * @param collectionPath - The Firestore collection path
 * @param operations - Array of { type: 'add'|'update'|'delete', id?: string, data?: T }
 */
export const batchWrite_ = <T extends DocumentData = DocumentData>(
  collectionPath: string,
  operations: Array<{
    type: 'add' | 'update' | 'delete';
    id?: string;
    data?: T;
  }>
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const operation of operations) {
        switch (operation.type) {
          case 'add':
            await addDoc_<T>(collectionPath, operation.data!);
            break;
          case 'update':
            await updateDoc_<T>(collectionPath, operation.id!, operation.data!);
            break;
          case 'delete':
            await deleteDoc_(collectionPath, operation.id!);
            break;
        }
      }
      resolve();
    } catch (error) {
      reject(new Error(`Batch write failed: ${error}`));
    }
  });
}
