import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './navigation';
import { initDatabase } from './services/database';
import { loadPersistedAuth } from './utils/authPersistence';

const App: React.FC = () => {
  useEffect(() => {
    const initApp = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');

        await loadPersistedAuth();
        console.log('Auth state restored');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initApp();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#FFFFFF"
      />
      <Navigation />
    </NavigationContainer>
  );
};

export default App;
