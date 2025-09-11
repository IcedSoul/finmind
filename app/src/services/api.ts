import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/utils/constants';
import type {
  User,
  Bill,
  LoginRequest,
  RegisterRequest,
  CreateBillRequest,
  PaginatedResponse,
} from '@/types';

class ApiService {
  private async getHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(
    credentials: LoginRequest,
  ): Promise<{ token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(
    userData: RegisterRequest,
  ): Promise<{ token: string; user: User }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<User> {
    return this.request('/auth/profile');
  }

  async getBills(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Bill>> {
    return this.request(`/bills?page=${page}&limit=${limit}`);
  }

  async createBill(billData: CreateBillRequest): Promise<Bill> {
    return this.request('/bills', {
      method: 'POST',
      body: JSON.stringify(billData),
    });
  }

  async updateBill(
    id: string,
    billData: Partial<CreateBillRequest>,
  ): Promise<Bill> {
    return this.request(`/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(billData),
    });
  }

  async deleteBill(id: string): Promise<void> {
    return this.request(`/bills/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories(): Promise<any[]> {
    return this.request('/categories');
  }
}

export const apiService = new ApiService();
