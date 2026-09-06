import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ariso_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ariso_admin_token');
    if (token) {
      authAPI.getMe()
        .then((res) => {
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('ariso_admin_user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data?.success) {
      localStorage.setItem('ariso_admin_token', res.data.token);
      localStorage.setItem('ariso_admin_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('ariso_admin_token');
    localStorage.removeItem('ariso_admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
