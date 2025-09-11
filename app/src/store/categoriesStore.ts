import { create } from 'zustand';
import { Category } from '@/types';
import { apiService } from '@/services/api';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useCategoriesStore = create<CategoriesState>(set => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await apiService.getCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch categories',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),
}));
