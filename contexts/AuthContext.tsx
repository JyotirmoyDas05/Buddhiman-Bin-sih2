import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, RegisterData, User } from '../types';

const API_BASE = 'https://api.masksandmachetes.com/api/notifications';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('🔍 Checking if user is already logged in...');
      
      const savedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('authToken');
      
      if (savedUser && token) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ Found existing login:', userData.phone);
      } else {
        console.log('❌ No existing login found');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      console.log(`📱 [AuthContext] Sending OTP to ${phone}...`);
      console.log(`🌐 [AuthContext] Calling: ${API_BASE}/Wauth/login`);
      
      const requestBody = {
        phone: phone,
        action: 'sendOtp'
      };
      
      console.log(`📦 [AuthContext] Request body:`, requestBody);
      
      const response = await fetch(`${API_BASE}/Wauth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`📊 [AuthContext] Response status:`, response.status);
      const result = await response.json();
      console.log(`📋 [AuthContext] Response body:`, result);
      
      if (result.success) {
        console.log('✅ [AuthContext] OTP sent successfully');
        return true;
      } else {
        console.error('❌ [AuthContext] OTP sending failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error sending OTP:', error);
      return false;
    }
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log(`🔐 [AuthContext] Verifying OTP for ${phone}...`);
      
      const requestBody = {
        phone: phone,
        otp: otp,
        action: 'verifyOtp'
      };
      
      console.log(`📦 [AuthContext] Login request:`, requestBody);
      
      const response = await fetch(`${API_BASE}/Wauth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`📊 [AuthContext] Login response status:`, response.status);
      const result = await response.json();
      console.log(`📋 [AuthContext] Login response:`, result);
      
      if (result.success && result.token) {
        // ✅ Save additional metadata for MongoDB
        const loginData = {
          ...result.user,
          lastLogin: new Date().toISOString(),
          loginCount: (result.user.loginCount || 0) + 1
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(loginData));
        await AsyncStorage.setItem('authToken', result.token);
        await AsyncStorage.setItem('loginTimestamp', new Date().toISOString());
        
        setUser(loginData);
        console.log('✅ [AuthContext] Login successful - saved to phone storage');
        return true;
      } else {
        console.error('❌ [AuthContext] Login failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ [AuthContext] Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      console.log(`📝 [AuthContext] Starting registration for: ${userData.phone}...`);
      console.log(`📋 [AuthContext] Registration data:`, userData);
      console.log(`🌐 [AuthContext] Calling: ${API_BASE}/Wauth/login`);
      
      const requestBody = {
        phone: userData.phone,
        name: userData.name,
        email: userData.email,
        address: userData.address,
        householdMembers: userData.householdMembers,
        action: 'sendOtp'
      };
      
      console.log(`📦 [AuthContext] Register request body:`, requestBody);
      
      const response = await fetch(`${API_BASE}/Wauth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`📊 [AuthContext] Register response status:`, response.status);
      const result = await response.json();
      console.log(`📋 [AuthContext] Register response:`, result);
      
      if (result.success) {
        await AsyncStorage.setItem('pendingRegistration', JSON.stringify(userData));
        console.log('✅ [AuthContext] Registration OTP sent - user data saved');
        return true;
      } else {
        console.error('❌ [AuthContext] Registration failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ [AuthContext] Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Logout with proper navigation
  const logout = async () => {
    try {
      console.log('👋 [AuthContext] Logging out user...');
      
      // Clear all stored data
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('loginTimestamp');
      await AsyncStorage.removeItem('pendingRegistration');
      
      // Reset user state
      setUser(null);
      
      console.log('✅ [AuthContext] Logout complete - redirecting to auth');
      
      // ✅ Navigate back to auth flow
      router.replace('/(auth)/register');
      
    } catch (error) {
      console.error('❌ [AuthContext] Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    sendOTP,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
