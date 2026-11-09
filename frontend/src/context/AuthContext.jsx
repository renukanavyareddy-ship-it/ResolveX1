import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('resolvex_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('resolvex_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate and sync user on mount
  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('resolvex_token');
      if (savedToken) {
        try {
          const res = await authService.getProfile();
          if (res.data.success && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('resolvex_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout(false);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data.success && res.data.data) {
        const { token: newToken, ...userData } = res.data.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('resolvex_token', newToken);
        localStorage.setItem('resolvex_user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.data.success && res.data.data) {
        const { token: newToken, ...userObj } = res.data.data;
        setToken(newToken);
        setUser(userObj);
        localStorage.setItem('resolvex_token', newToken);
        localStorage.setItem('resolvex_user', JSON.stringify(userObj));
        toast.success('Registration successful! Welcome to ResolveX.');
        return { success: true, user: userObj };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = (showToast = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('resolvex_token');
    localStorage.removeItem('resolvex_user');
    if (showToast) {
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('resolvex_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
