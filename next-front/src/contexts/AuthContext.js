'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  setAuthToken, 
  getAuthToken, 
  setUserData, 
  getUserData, 
  removeAuthData 
} from '@/lib/auth';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

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
    const initializeAuth = async () => {
      try {
        // Only run on client side
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const token = getAuthToken();
        const userData = getUserData();
        
        if (token && userData) {
          setUser(userData);
          // Verify token is still valid
          try {
            const response = await api.get('/user');
            setUser(response.data);
            setUserData(response.data);
          } catch (error) {
            // Token is invalid, remove auth data
            removeAuthData();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        removeAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setUserData(user);
      setUser(user);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      const { user, message } = response.data;
      
      toast.success(message || 'Registration successful! Please wait for approval.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors;
      
      if (errors) {
        Object.values(errors).forEach(errorArray => {
          errorArray.forEach(err => toast.error(err));
        });
      } else {
        toast.error(message);
      }
      
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthData();
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};