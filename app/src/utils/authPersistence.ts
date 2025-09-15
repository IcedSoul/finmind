import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store';
import { User } from '@/types';

export const loadPersistedAuth = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const userStr = await AsyncStorage.getItem('user');

    if (accessToken && refreshToken && userStr) {
      const user: User = JSON.parse(userStr);
      useAuthStore.getState().setCredentials(user, accessToken, refreshToken);
      return { user, accessToken, refreshToken };
    }
    return null;
  } catch (error) {
    console.error('Failed to load persisted auth:', error);
    return null;
  }
};

export const clearPersistedAuth = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to clear persisted auth:', error);
  }
};
