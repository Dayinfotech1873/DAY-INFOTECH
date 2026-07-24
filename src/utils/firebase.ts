import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { initializeFirestore, doc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const storage = getStorage(app);

// Configure session-only persistence for Firebase Auth so closing browser/tab logs the user out
setPersistence(auth, browserSessionPersistence).catch((err) => {
  console.error('Error setting auth session persistence:', err);
});

export const googleProvider = new GoogleAuthProvider();

// Standard login helper
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

// Standard logout helper
export async function logout() {
  try {
    try {
      sessionStorage.removeItem('custom_user_session');
    } catch (e) {}
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

