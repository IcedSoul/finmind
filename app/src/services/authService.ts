import axios from 'axios';
import { LoginRequest, RegisterRequest, ApiResponse, User } from '@/types';
import { API_BASE_URL } from '@/utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  async login(
    credentials: LoginRequest,
  ): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const response = await api.post('/api/v1/auth/login', credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },

  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<{ token: string; message: string }>> {
    try {
      const response = await api.post('/api/v1/auth/register', userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },

  async validateToken(token: string): Promise<ApiResponse<User>> {
    try {
      const response = await api.get('/api/v1/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
};
