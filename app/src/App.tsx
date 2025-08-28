import React, {useEffect} from 'react';
import {StatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store';
import Navigation from './navigation';
import {Loading} from './components';
import {initDatabase} from './services/database';

const App: React.FC = () => {
  useEffect(() => {
    const initApp = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initApp();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading overlay />} persistor={persistor}>
        <NavigationContainer>
          <StatusBar
            barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
            backgroundColor="#FFFFFF"
          />
          <Navigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;