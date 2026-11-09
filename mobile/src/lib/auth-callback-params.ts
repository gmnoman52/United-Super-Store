export function parseAuthCallback(url: string) {
  const parsed = new URL(url);
  const fragment = new URLSearchParams(parsed.hash.slice(1));
  const get = (name: string) => parsed.searchParams.get(name) ?? fragment.get(name);
  const error = get('error_description') || get('error');
  if (error) throw new Error(error);
  const code = get('code');
  if (code) return { code, type: get('type') };
  const access_token = get('access_token');
  const refresh_token = get('refresh_token');
  if (access_token && refresh_token) return { access_token, refresh_token, type: get('type') };
  throw new Error('Sign-in did not return a complete session. Please try again');
}
