import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './navigation';
import { initDatabase } from './services/database';
import { loadPersistedAuth } from './utils/authPersistence';
import { useAuthStore } from './store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';
import { ThemeProvider } from './contexts/ThemeContext';
import './i18n';

const App: React.FC = () => {
  const { logout } = useAuthStore();

  const checkTokenExpiry = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        const payload = JSON.parse(decode(refreshToken.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp < currentTime) {
          console.log('Refresh token expired, logging out');
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking token expiry:', error);
      logout();
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');

        await loadPersistedAuth();
        console.log('Auth state restored');

        await checkTokenExpiry();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
          backgroundColor="#FFFFFF"
        />
        <Navigation />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
