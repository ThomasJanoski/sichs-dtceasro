export function resolveApiBaseUrl(): string {
  const { hostname, origin } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '/api';
  }

  return `${origin}/api`;
}
