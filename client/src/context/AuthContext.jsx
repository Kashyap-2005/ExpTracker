import { createContext, useContext, useState } from 'react';

/**
 * AuthContext — global auth state for the entire app.
 *
 * What lives here:
 *  - user     : the decoded user object (name, email, id) — null when logged out
 *  - token    : the JWT string — null when logged out
 *  - login()  : called after a successful /api/auth/login response
 *  - logout() : clears state and removes token from localStorage
 *
 * Phase 2 will wire login() and logout() to actual API calls.
 * For now the context just exposes the shape so any component can import it
 * and not break when Phase 2 fills in the real logic.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Try to restore session from localStorage on first load
  const [user, setUser]   = useState(() => {
    const saved = localStorage.getItem('exptracker_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('exptracker_token'));

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('exptracker_user',  JSON.stringify(userData));
    localStorage.setItem('exptracker_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('exptracker_user');
    localStorage.removeItem('exptracker_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — components do: const { user, login, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
