import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } else {
        // Clear stale data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user && authService.isAuthenticated(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
