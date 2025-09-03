import axios from 'axios';
import {
  Bill,
  CreateBillRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const billService = {
  async getBills(params: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
  }): Promise<ApiResponse<PaginatedResponse<Bill>>> {
    try {
      const response = await api.get('/bills', { params });
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

  async createBill(billData: CreateBillRequest): Promise<ApiResponse<Bill>> {
    try {
      const response = await api.post('/bills', billData);
      return {
        success: true,
        data: response.data.bill,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },

  async updateBill(
    id: string,
    data: Partial<CreateBillRequest>,
  ): Promise<ApiResponse<Bill>> {
    try {
      const response = await api.put(`/bills/${id}`, data);
      return {
        success: true,
        data: response.data.bill,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },

  async deleteBill(id: string): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/bills/${id}`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },

  async syncBills(
    bills: Bill[],
  ): Promise<ApiResponse<{ synced_count: number }>> {
    try {
      const response = await api.post('/bills/sync', { bills });
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

  async getStatistics(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/bills/statistics');
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
