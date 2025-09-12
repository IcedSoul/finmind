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
      console.log('Fetching categories...');
      const categoryList = await apiService.getCategories();
      console.log('Categories fetched:', categoryList);
      set({ categories: categoryList.categories, loading: false });
    } catch (error) {
      console.error('Error fetching categories:', error);
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
