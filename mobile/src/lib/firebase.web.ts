import { getApp, getApps, initializeApp } from 'firebase/app';
import { browserPopupRedirectResolver, getAuth, initializeAuth, inMemoryPersistence } from 'firebase/auth';

// Firebase web configuration is public project identification, not an admin credential.
const firebaseConfig = {
  apiKey: 'AIzaSyDZIbmullJi2JK5aD7_OrHHY8IKOmEcBrE',
  authDomain: 'united-super-store-e6131.firebaseapp.com',
  projectId: 'united-super-store-e6131',
  storageBucket: 'united-super-store-e6131.firebasestorage.app',
  messagingSenderId: '594020358252',
  appId: '1:594020358252:web:d8fcf23ca2f3935b302049',
};
// Supabase owns the application session; Firebase only obtains the Google credential.
// Initialise only when the browser starts sign-in, never during static page rendering.
export function getFirebaseAuth() {
  const name = 'united-google';
  const existing = getApps().some(app => app.name === name);
  const app = existing ? getApp(name) : initializeApp(firebaseConfig, name);
  return existing ? getAuth(app) : initializeAuth(app, {
    persistence: inMemoryPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });
}
