// Public API calls used by the landing site (no admin session).
const BASE = import.meta.env.VITE_BASE_URL;

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Something went wrong. Please try again.');
  return json;
}

export const SCREENS = '/assets/landing/screens';
export const BRAND = '#FB923C';
export const BRAND_DARK = '#E88154';
export const SUPPORT_EMAIL = 'support@nomnombabies.com';
