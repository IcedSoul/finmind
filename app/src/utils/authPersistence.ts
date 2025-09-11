import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store';
import { User } from '@/types';

export const loadPersistedAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userStr = await AsyncStorage.getItem('user');

    if (token && userStr) {
      const user: User = JSON.parse(userStr);
      useAuthStore.getState().setCredentials(user, token);
      return { user, token };
    }
    return null;
  } catch (error) {
    console.error('Failed to load persisted auth:', error);
    return null;
  }
};

export const clearPersistedAuth = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to clear persisted auth:', error);
  }
};
