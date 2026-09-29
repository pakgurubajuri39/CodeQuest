import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  getDocFromServer,
  Unsubscribe
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { UserProfile, UserStatus } from '../types/game';

// User-provided Firebase Configuration with environment variable fallback
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA-D3wM6Xs6P1rpZk4AkYeyOSWUXms8koU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "codequest-25b35.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "codequest-25b35",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "codequest-25b35.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "213680532019",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:213680532019:web:90410e241ae29220011146"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Standardized Firestore error handler conforming to skill requirements
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Warning/Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test as required by skill guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore connection: Client is offline or network restricted.");
    }
    return false;
  }
}

// Real-time listener for students collection
export function subscribeToStudents(
  onData: (students: UserProfile[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const studentsCol = collection(db, 'students');

  return onSnapshot(
    studentsCol,
    (snapshot) => {
      const list: UserProfile[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as UserProfile;
        list.push({ ...data, id: d.id });
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'students');
      if (onError) onError(error);
    }
  );
}

// Save or update student document in Firestore
export async function saveStudent(student: UserProfile): Promise<boolean> {
  const path = `students/${student.id}`;
  try {
    await setDoc(doc(db, 'students', student.id), {
      ...student,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

// Update student approval status in Firestore
export async function updateStudentApprovalStatus(studentId: string, status: UserStatus): Promise<boolean> {
  const path = `students/${studentId}`;
  try {
    await updateDoc(doc(db, 'students', studentId), {
      status,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

// Seed initial default students if Firestore collection is empty
export async function seedInitialStudentsIfEmpty(defaultStudents: UserProfile[]): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'students'));
    if (snap.empty) {
      for (const student of defaultStudents) {
        await setDoc(doc(db, 'students', student.id), {
          ...student,
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'students');
  }
}
