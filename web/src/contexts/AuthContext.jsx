import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore auth state from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, tokenData) => {
  setUser(userData);
  setToken(tokenData);
  setIsAuthenticated(true);
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', tokenData);
  };

  const logout = () => {
  setUser(null);
  setToken(null);
  setIsAuthenticated(false);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}
