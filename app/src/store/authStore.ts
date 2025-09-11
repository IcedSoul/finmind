import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  setCredentials: (user: User, token: string) => void;
  logout: () => void;
  loadStoredAuth: (data: { user: User; token: string } | null) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  user: null,
  token: null,

  setCredentials: (user: User, token: string) => {
    set({ isAuthenticated: true, user, token });
  },

  logout: () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
    set({ isAuthenticated: false, user: null, token: null });
  },

  loadStoredAuth: (data: { user: User; token: string } | null) => {
    if (data) {
      set({ isAuthenticated: true, user: data.user, token: data.token });
    }
  },
}));
