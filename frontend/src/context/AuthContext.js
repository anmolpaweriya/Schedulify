import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Config axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  // Register User
  const register = async (userData) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', userData);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Login User
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Logout User
  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Update profile
  const updateProfile = async (formData) => {
    setError(null);
    try {
      const res = await axios.put('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
