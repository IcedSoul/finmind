export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  merchant: string;
  description?: string;
  time: string;
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface BillsState {
  bills: Bill[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
}

export interface RootState {
  auth: AuthState;
  bills: BillsState;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateBillRequest {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  merchant: string;
  description?: string;
  time: string;
}

export interface UpdateBillRequest extends Partial<CreateBillRequest> {
  id: string;
}

export interface BillsResponse {
  bills: Bill[];
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
}

export interface StatisticsData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryStats: CategoryStat[];
  trendData: TrendData[];
}

export interface CategoryStat {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface TrendData {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface ParsedBillData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  merchant: string;
  description?: string;
  time: string;
  confidence: number;
}

export interface AIParseResult {
  success: boolean;
  bills: ParsedBillData[];
  error?: string;
}

export interface FilterOptions {
  type?: 'income' | 'expense' | 'all';
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface SortOptions {
  field: 'time' | 'amount' | 'category';
  order: 'asc' | 'desc';
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: string | null;
  pendingCount: number;
  syncing: boolean;
}

export interface AppSettings {
  pushNotifications: boolean;
  biometricAuth: boolean;
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Bills: undefined;
  Statistics: undefined;
  Settings: undefined;
};

export type BillStackParamList = {
  BillsList: undefined;
  AddBill: {bill?: Bill};
  EditBill: {bill: Bill};
  ImportBill: undefined;
};

export interface NavigationProps {
  navigation: any;
  route: any;
}