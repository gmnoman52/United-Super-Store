import * as Linking from 'expo-linking';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirebaseAuth } from './firebase.web';
import { requireSupabase } from './supabase';

export { completeAuthFromUrl } from './auth-callback-session';
export const authRedirectUrl = () => Linking.createURL('/account');

export async function signInWithGoogle(): Promise<boolean> {
  const firebaseAuth = getFirebaseAuth();
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(firebaseAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.idToken) throw new Error('Google did not return a sign-in credential. Please try again');
    // This is Google's ID token, not Firebase's project-specific user token.
    const { error } = await requireSupabase().auth.signInWithIdToken({
      provider: 'google', token: credential.idToken, access_token: credential.accessToken,
    });
    if (error) throw new Error('Google connected, but store access is not configured yet. Enable Google in Supabase with the Firebase Google OAuth client ID');
    return true;
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return false;
    if (code === 'auth/operation-not-allowed') throw new Error('Enable Google in Firebase Authentication before signing in');
    if (code === 'auth/unauthorized-domain') throw new Error('Add this website domain to Firebase Authentication authorised domains');
    if (code === 'auth/popup-blocked') throw new Error('Allow the Google sign-in popup, then try again');
    throw error;
  } finally {
    await signOut(firebaseAuth).catch(() => {});
  }
}
