import axios from 'axios';

/**
 * Pre-configured Axios instance.
 *
 * All API calls go through this instead of raw axios so we have one place
 * to set the base URL and attach the JWT token.
 *
 * Phase 2 will add a request interceptor that reads the token from
 * localStorage and attaches it as an Authorization header automatically.
 * For now the base URL is all we need.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor (Phase 2 will activate this) ─────────────────────────
// Attaches the JWT to every outgoing request if one exists in localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('exptracker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
// If the server returns 401 (token expired / invalid), clear local storage.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('exptracker_token');
      localStorage.removeItem('exptracker_user');
    }
    return Promise.reject(error);
  }
);

export default api;
