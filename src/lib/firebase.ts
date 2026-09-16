import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  onSnapshot,
  getDocFromServer,
  writeBatch,
  addDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ProfileData, Project, ContactMessage, CVFileInfo } from '../types';
import { initialProfile, initialProjects } from '../data/portfolioData';

// Initialize Firebase App instance
export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Target Firestore Database instance
export const db = getFirestore(
  firebaseApp,
  firebaseConfig.firestoreDatabaseId || undefined
);

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
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.warn('Firestore Operation Info: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection check with server ping
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'portfolio', 'main'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline.');
      return false;
    }
    return true;
  }
}

// Real-time Profile Listener
export function subscribeToProfile(
  onData: (data: ProfileData) => void,
  onError?: (err: unknown) => void
) {
  const profileDocRef = doc(db, 'portfolio', 'main');
  return onSnapshot(
    profileDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<ProfileData>;
        const merged: ProfileData = {
          ...initialProfile,
          ...data,
          skills: {
            ...initialProfile.skills,
            ...(data.skills || {}),
          },
          socials: {
            ...initialProfile.socials,
            ...(data.socials || {}),
          },
          education: Array.isArray(data.education)
            ? data.education
            : initialProfile.education,
          hobbies: Array.isArray(data.hobbies)
            ? data.hobbies
            : initialProfile.hobbies,
          aboutText: Array.isArray(data.aboutText)
            ? data.aboutText
            : initialProfile.aboutText,
        };
        onData(merged);
      } else {
        saveProfileToFirestore(initialProfile).catch(console.error);
        onData(initialProfile);
      }
    },
    (error) => {
      console.warn('Realtime profile snapshot warning:', error);
      onError?.(error);
    }
  );
}

// Save Profile to Firestore
export async function saveProfileToFirestore(profile: ProfileData): Promise<void> {
  const path = 'portfolio/main';
  try {
    const profileDocRef = doc(db, 'portfolio', 'main');
    const payload = {
      name: profile.name || '',
      title: profile.title || '',
      location: profile.location || '',
      greeting: profile.greeting || '',
      bioNote: profile.bioNote || '',
      githubRepoUrl: profile.githubRepoUrl || '',
      avatarUrl: profile.avatarUrl || '',
      badgeId: profile.badgeId || '',
      aboutText: profile.aboutText || [],
      skills: profile.skills || initialProfile.skills,
      socials: profile.socials || initialProfile.socials,
      education: profile.education || [],
      hobbies: profile.hobbies || [],
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
    };
    await setDoc(profileDocRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save CV file document directly to Cloud Firestore
export async function saveCVToFirestore(cvInfo: CVFileInfo): Promise<void> {
  const path = 'portfolio/cv';
  try {
    const docRef = doc(db, 'portfolio', 'cv');
    await setDoc(docRef, {
      name: cvInfo.name,
      dataUrl: cvInfo.dataUrl,
      size: cvInfo.size,
      updatedAt: cvInfo.updatedAt || new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete CV file document from Cloud Firestore
export async function deleteCVFromFirestore(): Promise<void> {
  const path = 'portfolio/cv';
  try {
    const docRef = doc(db, 'portfolio', 'cv');
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to CV document from Cloud Firestore in real-time
export function subscribeToCV(
  onData: (cvInfo: CVFileInfo | null) => void,
  onError?: (err: unknown) => void
) {
  const docRef = doc(db, 'portfolio', 'cv');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onData({
          name: data.name || 'CV_Asqi_Faizul.pdf',
          dataUrl: data.dataUrl || '',
          size: data.size || 0,
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      } else {
        onData(null);
      }
    },
    (error) => {
      console.warn('Realtime CV snapshot warning:', error);
      onError?.(error);
    }
  );
}

// Real-time Projects Listener
export function subscribeToProjects(
  onData: (projects: Project[]) => void,
  onError?: (err: unknown) => void
) {
  const projectsColRef = collection(db, 'projects');
  return onSnapshot(
    projectsColRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const loaded: Project[] = [];
        snapshot.forEach((d) => {
          loaded.push(d.data() as Project);
        });
        onData(loaded);
      } else {
        seedInitialProjects().catch(console.error);
        onData(initialProjects);
      }
    },
    (error) => {
      console.warn('Realtime projects snapshot warning:', error);
      onError?.(error);
    }
  );
}

// Seed initial projects
export async function seedInitialProjects(): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const project of initialProjects) {
      const docRef = doc(db, 'projects', project.id);
      batch.set(docRef, {
        ...project,
        updatedAt: new Date().toISOString(),
      });
    }
    await batch.commit();
  } catch (err) {
    console.warn('Could not seed initial projects to Firestore:', err);
  }
}

// Save all projects to Firestore
export async function saveProjectsToFirestore(projects: Project[]): Promise<void> {
  const path = 'projects';
  try {
    const batch = writeBatch(db);
    for (const project of projects) {
      const docRef = doc(db, 'projects', project.id);
      batch.set(docRef, {
        ...project,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin',
      });
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save Contact Message to Firestore
export async function sendContactMessageToFirestore(
  name: string,
  email: string,
  message: string
): Promise<string> {
  const path = 'messages';
  try {
    const colRef = collection(db, 'messages');
    const docRef = await addDoc(colRef, {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.warn('Failed to save message to Firestore:', error);
    return '';
  }
}

// Subscribe to messages for admin viewing
export function subscribeToMessages(
  onData: (messages: ContactMessage[]) => void,
  onError?: (err: unknown) => void
) {
  const colRef = collection(db, 'messages');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ContactMessage[] = [];
      snapshot.forEach((d) => {
        const item = d.data();
        list.push({
          id: d.id,
          name: item.name || '',
          email: item.email || '',
          message: item.message || '',
          createdAt: item.createdAt || '',
        });
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(list);
    },
    (error) => {
      console.warn('Realtime messages snapshot warning:', error);
      onError?.(error);
    }
  );
}

// Save Admin Security PIN directly to Cloud Firestore
export async function saveSecurityPINToFirestore(pin: string): Promise<void> {
  const path = 'portfolio/security';
  try {
    const docRef = doc(db, 'portfolio', 'security');
    await setDoc(
      docRef,
      {
        pin: pin.trim(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Get Admin Security PIN directly from Cloud Firestore
export async function getSecurityPINFromFirestore(): Promise<string | null> {
  try {
    const docRef = doc(db, 'portfolio', 'security');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && typeof data.pin === 'string' && data.pin.trim() !== '') {
        return data.pin.trim();
      }
    }
  } catch (err) {
    console.warn('Could not fetch security PIN from Firestore:', err);
  }
  return null;
}

// Subscribe to Admin Security PIN in real-time across all devices (Mobile HP, Desktop, Laptop)
export function subscribeToSecurityPIN(
  onData: (pin: string) => void,
  onError?: (err: unknown) => void
) {
  const docRef = doc(db, 'portfolio', 'security');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && typeof data.pin === 'string' && data.pin.trim() !== '') {
          onData(data.pin.trim());
          return;
        }
      }
      onData('asqi2026');
    },
    (error) => {
      console.warn('Realtime security PIN snapshot warning:', error);
      onError?.(error);
    }
  );
}

