import { create } from 'zustand';
import { Bill, CreateBillRequest, PaginatedResponse } from '@/types';
import { apiService } from '@/services/api';

interface BillsState {
  bills: Bill[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;

  fetchBills: (page?: number, limit?: number) => Promise<void>;
  createBill: (billData: CreateBillRequest) => Promise<void>;
  updateBill: (
    id: string,
    billData: Partial<CreateBillRequest>,
  ) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useBillsStore = create<BillsState>((set, _get) => ({
  bills: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,

  fetchBills: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const response: PaginatedResponse<Bill> = await apiService.getBills(
        page,
        limit,
      );
      set({
        bills: response.items,
        currentPage: response.pagination.page,
        totalPages: response.pagination.total_pages,
        total: response.pagination.total,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch bills',
        loading: false,
      });
    }
  },

  createBill: async (billData: CreateBillRequest) => {
    set({ loading: true, error: null });
    try {
      const newBill = await apiService.createBill(billData);
      set(state => ({
        bills: [newBill, ...state.bills],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create bill',
        loading: false,
      });
    }
  },

  updateBill: async (id: string, billData: Partial<CreateBillRequest>) => {
    set({ loading: true, error: null });
    try {
      const updatedBill = await apiService.updateBill(id, billData);
      set(state => ({
        bills: state.bills.map(bill =>
          bill.id.toString() === id ? updatedBill : bill,
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update bill',
        loading: false,
      });
    }
  },

  deleteBill: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await apiService.deleteBill(id);
      set(state => ({
        bills: state.bills.filter(bill => bill.id.toString() !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete bill',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),
}));
