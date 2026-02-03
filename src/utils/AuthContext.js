import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // For testing: clear stored user on app start
        await AsyncStorage.removeItem('splitease_user');
        
        const storedUser = await AsyncStorage.getItem('splitease_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to restore user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData) => {
    try {
      const userToStore = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        loginTime: new Date().toISOString(),
      };
      await AsyncStorage.setItem('splitease_user', JSON.stringify(userToStore));
      setUser(userToStore);
      return true;
    } catch (error) {
      console.error('Failed to login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('splitease_user');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Failed to logout:', error);
      return false;
    }
  };

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn, login, logout }}>
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
