import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
    loadStoredAuth: (
      state,
      action: PayloadAction<{ user: User; token: string } | null>,
    ) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      }
    },
  },
});

export const { setCredentials, logout, loadStoredAuth } = authSlice.actions;
export default authSlice.reducer;
