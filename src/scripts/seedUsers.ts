/**
 * Seed script to create default users in Firebase Authentication and Firestore
 * Run once manually: npx ts-node src/scripts/seedUsers.ts
 * 
 * Creates three default accounts:
 * - Admin: admin@company.com / Admin@1234
 * - HR: hr@company.com / Hr@1234
 * - Employee: employee@company.com / Employee@1234
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Default users to create
const defaultUsers = [
  {
    email: 'admin@company.com',
    password: 'Admin@1234',
    role: 'admin' as const,
  },
  {
    email: 'hr@company.com',
    password: 'Hr@1234',
    role: 'hr' as const,
  },
  {
    email: 'employee@company.com',
    password: 'Employee@1234',
    role: 'employee' as const,
  },
];

interface UserRole {
  uid: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  createdAt: Timestamp;
}

async function seedUsers() {
  try {
    console.log('🌱 Starting seed script for Firebase users...\n');

    for (const user of defaultUsers) {
      try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        );

        const uid = userCredential.user.uid;

        // Create corresponding user document in Firestore
        const userDocRef = doc(db, 'users', uid);
        const userData: UserRole = {
          uid,
          email: user.email,
          role: user.role,
          createdAt: Timestamp.now(),
        };

        await setDoc(userDocRef, userData);

        console.log(
          `✅ Created user: ${user.email} (Role: ${user.role})`
        );
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(
            `⏭️  User already exists: ${user.email} (skipping)`
          );
        } else {
          console.error(`❌ Error creating user ${user.email}:`, error.message);
        }
      }
    }

    console.log('\n✨ Seed script completed!');
    console.log('\n📋 Summary of default accounts:');
    console.log('-----------------------------------');
    defaultUsers.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log('---');
    });

    // Sign out the last created user
    await signOut(auth);
    console.log('\n✌️  Signed out. Ready to log in!');

    process.exit(0);
  } catch (error) {
    console.error('Fatal error during seed:', error);
    process.exit(1);
  }
}

seedUsers();
