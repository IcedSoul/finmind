import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/utils/constants';
import { useAuthStore } from '@/store';
import type {
  User,
  Bill,
  LoginRequest,
  RegisterRequest,
  CreateBillRequest,
  PaginatedResponse,
  CategoryListResponse,
} from '@/types';

class ApiService {
  private async getHeaders(): Promise<Record<string, string>> {
    const accessToken = await AsyncStorage.getItem('access_token');
    console.log(
      'Access Token from AsyncStorage:',
      accessToken ? 'exists' : 'not found',
    );
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      await AsyncStorage.setItem('access_token', data.access_token);
      await AsyncStorage.setItem('refresh_token', data.refresh_token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false,
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    });

    if (response.status === 401 && !isRetry) {
      const refreshSuccess = await this.refreshToken();
      if (refreshSuccess) {
        return this.request<T>(endpoint, options, true);
      } else {
        useAuthStore.getState().logout();
        throw new Error('Authentication failed. Please login again.');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(
    credentials: LoginRequest,
  ): Promise<{ access_token: string; refresh_token: string; user: User }> {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(
    userData: RegisterRequest,
  ): Promise<{ access_token: string; refresh_token: string; user: User }> {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<User> {
    return this.request('/api/v1/user/profile');
  }

  async getBills(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Bill>> {
    return this.request<PaginatedResponse<Bill>>(
      `/api/v1/bills?page=${page}&limit=${limit}`,
      {
        method: 'GET',
      },
    );
  }

  async createBill(billData: CreateBillRequest): Promise<Bill> {
    return this.request('/api/v1/bills', {
      method: 'POST',
      body: JSON.stringify(billData),
    });
  }

  async updateBill(
    id: string,
    billData: Partial<CreateBillRequest>,
  ): Promise<Bill> {
    return this.request(`/api/v1/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(billData),
    });
  }

  async deleteBill(id: string): Promise<void> {
    return this.request(`/api/v1/bills/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories(): Promise<CategoryListResponse> {
    return await this.request<CategoryListResponse>('/api/v1/categories');
  }

  async updateProfile(data: { name: string }): Promise<User> {
    return this.request<User>('/api/v1/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
