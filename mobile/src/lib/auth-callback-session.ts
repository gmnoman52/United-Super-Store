import { requireSupabase } from './supabase';
import { parseAuthCallback } from './auth-callback-params';
const callbacks = new Map<string, Promise<void>>();

export function completeAuthFromUrl(url: string): Promise<void> {
  const pending = callbacks.get(url);
  if (pending) return pending;
  const completion = (async () => {
    const callback = parseAuthCallback(url);
    const client = requireSupabase();
    const result = callback.code
      ? await client.auth.exchangeCodeForSession(callback.code)
      : await client.auth.setSession({ access_token: callback.access_token!, refresh_token: callback.refresh_token! });
    if (result.error) throw result.error;
  })();
  callbacks.set(url, completion);
  // Browser return and the native deep-link listener can receive the same one-use code.
  void completion.finally(() => setTimeout(() => callbacks.delete(url), 30000)).catch(() => {});
  return completion;
}
