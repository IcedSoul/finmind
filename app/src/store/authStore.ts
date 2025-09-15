import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setCredentials: (
    user: User,
    accessToken: string,
    refreshToken: string,
  ) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  loadStoredAuth: (
    data: { user: User; accessToken: string; refreshToken: string } | null,
  ) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  setCredentials: async (
    user: User,
    accessToken: string,
    refreshToken: string,
  ) => {
    await AsyncStorage.setItem('access_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user, accessToken, refreshToken });
  },

  updateUser: async (user: User) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set(state => ({ ...state, user }));
  },

  logout: () => {
    AsyncStorage.removeItem('access_token');
    AsyncStorage.removeItem('refresh_token');
    AsyncStorage.removeItem('user');
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },

  loadStoredAuth: (
    data: { user: User; accessToken: string; refreshToken: string } | null,
  ) => {
    if (data) {
      set({
        isAuthenticated: true,
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    }
  },
}));
