import { createContext, useContext, useState, useEffect } from 'react';
import { restoreSession, clearAuth } from '../api/client';
import { logoutStaff } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('es_user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  // On reload the in-memory access token is gone but the HttpOnly refresh cookie
  // survives. If a staff user is persisted, silently mint a fresh access token so
  // API calls succeed without forcing a re-login. If refresh fails, sign out.
  useEffect(() => {
    if (user && user.role !== 'PARENT' && user.role !== 'STUDENT') {
      restoreSession().catch(() => {
        clearAuth();
        setUser(null);
      });
    }
    // Runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function login(userData) {
    localStorage.setItem('es_user', JSON.stringify(userData));
    setUser(userData);
  }

  async function logout() {
    await logoutStaff();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
