import axios from 'axios';

// Base URL comes from Vite env (frontend/myapp/.env). Falls back to local dev.
const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true, // required so the HttpOnly refresh-token cookie is sent
});

// The access token is kept in memory only (never localStorage) per the security
// model in PASSDOWN §5.1 — an XSS payload can read localStorage, not JS memory.
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token ?? null;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAuth() {
  accessToken = null;
  localStorage.removeItem('es_user');
}

// Attach the bearer token to every outgoing request.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Exchange the refresh cookie for a new access token. Deduped so that a burst of
// concurrent 401s (e.g. the dashboard firing 8 calls at once) triggers a single
// /auth/refresh round-trip.
let refreshPromise = null;

export function restoreSession() {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh')
      .then((res) => {
        setAccessToken(res.data.accessToken);
        return res.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// On a 401 (expired access token) refresh once and replay the original request.
// If refresh itself fails, clear auth and bounce to the login screen.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes('/auth/');

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const token = await restoreSession();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (refreshError) {
        clearAuth();
        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
