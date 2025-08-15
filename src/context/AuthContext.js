// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toastService from '../services/ToastService';

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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        // Verify token is still valid
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
        setToken(savedToken);
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, clear everything
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (loginData) => {
    try {
      // ตอนนี้ Backend รับ employeeId แล้ว
      const response = await authAPI.login({
        employeeId: parseInt(loginData.employeeId), // Convert เป็น number
        password: loginData.password
      });
      
      const { token: newToken, employee } = response.data;

      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(employee));

      // Update state
      setToken(newToken);
      setUser(employee);
      setIsAuthenticated(true);

      console.log('Auth state updated:', { token: newToken, user: employee });

      toastService.success('เข้าสู่ระบบสำเร็จ!');
      return { success: true };
    } catch (error) {
      console.error('Login API Error:', error);
      const message = error.response?.data?.message || 'เข้าสู่ระบบล้มเหลว';
      toastService.error(message);
      return { success: false, message };
    }
  };

  const signup = async (signupData) => {
    try {
      const response = await authAPI.signup(signupData);
      
      if (response.data.success) {
        toastService.success(response.data.message);
        return { success: true };
      } else {
        toastService.error(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'ลงทะเบียนล้มเหลว';
      toastService.error(message);
      return { success: false, message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      toastService.success(response.data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'เปลี่ยนรหัสผ่านล้มเหลว';
      toastService.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    toastService.info('ออกจากระบบแล้ว');
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    signup,
    changePassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};