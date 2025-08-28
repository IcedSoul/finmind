import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {BillState, Bill, CreateBillRequest, PaginatedResponse} from '@/types';
import {billService} from '@/services/billService';

const initialState: BillState = {
  bills: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
};

export const fetchBills = createAsyncThunk(
  'bills/fetchBills',
  async (params: {page?: number; limit?: number; category?: string; type?: string}, {rejectWithValue}) => {
    try {
      const response = await billService.getBills(params);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch bills');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  },
);

export const createBill = createAsyncThunk(
  'bills/createBill',
  async (billData: CreateBillRequest, {rejectWithValue}) => {
    try {
      const response = await billService.createBill(billData);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create bill');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  },
);

export const updateBill = createAsyncThunk(
  'bills/updateBill',
  async ({id, data}: {id: string; data: Partial<CreateBillRequest>}, {rejectWithValue}) => {
    try {
      const response = await billService.updateBill(id, data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update bill');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  },
);

export const deleteBill = createAsyncThunk(
  'bills/deleteBill',
  async (id: string, {rejectWithValue}) => {
    try {
      const response = await billService.deleteBill(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'Failed to delete bill');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  },
);

export const syncBills = createAsyncThunk(
  'bills/syncBills',
  async (bills: Bill[], {rejectWithValue}) => {
    try {
      const response = await billService.syncBills(bills);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to sync bills');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  },
);

const billsSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    addLocalBill: (state, action: PayloadAction<Bill>) => {
      state.bills.unshift(action.payload);
      state.totalCount += 1;
    },
    updateLocalBill: (state, action: PayloadAction<Bill>) => {
      const index = state.bills.findIndex(bill => bill.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
    },
    removeLocalBill: (state, action: PayloadAction<string>) => {
      state.bills = state.bills.filter(bill => bill.id !== action.payload);
      state.totalCount -= 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBills.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        const {items, total, page} = action.payload as PaginatedResponse<Bill>;
        if (page === 1) {
          state.bills = items;
        } else {
          state.bills = [...state.bills, ...items];
        }
        state.totalCount = total;
        state.currentPage = page;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBill.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        const index = state.bills.findIndex(bill => bill.id === action.payload.id);
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.bills = state.bills.filter(bill => bill.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(syncBills.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncBills.fulfilled, state => {
        state.loading = false;
      })
      .addCase(syncBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearError, addLocalBill, updateLocalBill, removeLocalBill} = billsSlice.actions;
export default billsSlice.reducer;