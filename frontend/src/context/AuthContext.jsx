import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('astro_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user data on startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('astro_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            setProfile(res.data.profile || null);
          }
        } catch (err) {
          console.warn('[Auth Init Failed]:', err.message);
          localStorage.removeItem('astro_token');
          localStorage.removeItem('astro_user');
          setUser(null);
          setProfile(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const saveAuthSession = (tokenVal, userData, profileData = null) => {
    localStorage.setItem('astro_token', tokenVal);
    setToken(tokenVal);
    setUser(userData);
    setProfile(profileData);
  };

  // Executive Login
  const executiveLogin = async (email, password) => {
    const res = await api.post('/auth/executive/login', { email, password });
    if (res.data.success) {
      saveAuthSession(res.data.token, res.data.user, res.data.profile);
    }
    return res.data;
  };

  // Executive Signup
  const executiveRegister = async (payload) => {
    const res = await api.post('/auth/executive/register', payload);
    if (res.data.success) {
      saveAuthSession(res.data.token, res.data.user, res.data.profile);
    }
    return res.data;
  };

  // Normal User Login
  const userLogin = async (email, password) => {
    const res = await api.post('/auth/user/login', { email, password });
    if (res.data.success) {
      saveAuthSession(res.data.token, res.data.user, null);
    }
    return res.data;
  };

  // Normal User Signup
  const userRegister = async (payload) => {
    const res = await api.post('/auth/user/register', payload);
    if (res.data.success) {
      saveAuthSession(res.data.token, res.data.user, null);
    }
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('astro_token');
    localStorage.removeItem('astro_user');
    setUser(null);
    setProfile(null);
    setToken(null);
  };

  // Refresh user state
  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile || null);
      }
    } catch (err) {
      console.warn('[Refresh User Error]:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        isExecutive: user?.role === 'EXECUTIVE',
        isCustomer: user?.role === 'NORMAL_USER',
        executiveLogin,
        executiveRegister,
        userLogin,
        userRegister,
        logout,
        refreshUser,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
