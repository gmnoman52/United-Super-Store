import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { requireSupabase } from './supabase';
import { completeAuthFromUrl } from './auth-callback-session';
export { completeAuthFromUrl } from './auth-callback-session';

export const authRedirectUrl = () => Platform.OS === 'web' ? Linking.createURL('/account') : 'unitedsuperstore://account';

export async function signInWithGoogle(): Promise<boolean> {
  const client = requireSupabase();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY! }, signal: controller.signal,
    });
    if (!response.ok) throw new Error('Couldn’t connect to sign-in. Please try again');
    const settings = await response.json();
    if (settings.external?.google !== true) throw new Error('Google sign-in is not available yet. Please use email and password');
  } finally { clearTimeout(timeout); }
  const redirectTo = authRedirectUrl();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: Platform.OS !== 'web', queryParams: { prompt: 'select_account' } },
  });
  if (error) throw error;
  if (Platform.OS === 'web') return true;
  if (!data.url) throw new Error('Couldn’t open Google sign-in. Please try again');
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') return false;
  await completeAuthFromUrl(result.url);
  return true;
}
