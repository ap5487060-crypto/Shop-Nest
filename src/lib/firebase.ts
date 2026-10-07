import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCyOaNTOLW9ik50oq8Lzk0dcVLrL01X_W0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'shop-nest-c1185.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'shop-nest-c1185',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'shop-nest-c1185.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '814766287917',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:814766287917:web:861b6052ffb1be95779ca4',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-Q3PP42Q9RJ'
};

// Initialize Firebase once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics initialization (browser only and if supported)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.warn('Firebase Analytics init skipped:', err);
      }
    }
  });
}
