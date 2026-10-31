import { fetchBaseQuery } from '@reduxjs/toolkit/query';

import { handleApiError } from './handleApiError';
import { logout, setToken } from './slices/userSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// One refresh at a time (also across the requests that fail together).
let refreshing = null;

/**
 * Swaps the httpOnly refresh cookie for a new access token (POST auth/refresh). The cookie itself is
 * rotated by the server and never readable from JavaScript. Resolves the token, null only when the server
 * says the session is over (401/403); rejects for temporary problems (offline, 5xx, rate limit) so the
 * admin stays signed in.
 */
const refreshAccessToken = () => {
  refreshing ??= (async () => {
    // 409 = another tab is swapping the same cookie (or a reply was lost): give the server a moment.
    const backoff = [1500, 4000];
    for (let attempt = 0; ; attempt += 1) {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(`${BASE_URL}auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Client': 'web' },
        body: '{}',
      });
      if (res.ok) {
        // eslint-disable-next-line no-await-in-loop
        const body = await res.json();
        return body?.data?.token ?? null;
      }
      if (res.status === 401 || res.status === 403) return null;
      if (res.status === 409 && attempt < backoff.length) {
        // eslint-disable-next-line no-await-in-loop
        await wait(backoff[attempt]);
      } else {
        throw new Error(`Refresh failed (${res.status})`);
      }
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
};

const isOnLoginPage = () =>
  typeof window !== 'undefined' && ['/', '/admin', '/auth/jwt/sign-in'].includes(window.location.pathname);

export const createCustomFetchBaseQuery = () => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    // Sends/receives the refresh cookie on /auth routes (it is scoped to /api/auth by the server).
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.user?.user?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      // Tells the API this is a browser, so refresh tokens go into an httpOnly cookie, not the response body.
      headers.set('X-Client', 'web');
      return headers;
    },
  });

  return async (arg, api, extraOptions) => {
    let result = await baseQuery(arg, api, extraOptions);

    if (result.error?.status === 401 && api.getState()?.user?.user?.token) {
      // Access tokens last 15 minutes: refresh silently and replay the request.
      // undefined = temporary failure: keep the admin signed in and just fail this request.
      const token = await refreshAccessToken().catch(() => undefined);
      if (token) {
        api.dispatch(setToken(token));
        result = await baseQuery(arg, api, extraOptions);
      } else if (token === null && !isOnLoginPage()) {
        api.dispatch(logout());
        window.location.replace('/admin');
      }
    }

    if (result.error) console.error('API Error:', handleApiError(result.error));
    return result;
  };
};
