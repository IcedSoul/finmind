export const API_BASE_URL = 'http://10.86.122.212:8080';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  BILLS_CACHE: 'bills_cache',
  CATEGORIES_CACHE: 'categories_cache',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const BILL_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const DEFAULT_CATEGORIES = [
  { id: '1', name: '餐饮', icon: 'utensils', color: '#FF6B6B' },
  { id: '2', name: '交通', icon: 'car', color: '#4ECDC4' },
  { id: '3', name: '购物', icon: 'shopping-bag', color: '#45B7D1' },
  { id: '4', name: '娱乐', icon: 'gamepad-2', color: '#96CEB4' },
  { id: '5', name: '医疗', icon: 'heart', color: '#FFEAA7' },
  { id: '6', name: '教育', icon: 'book', color: '#DDA0DD' },
  { id: '7', name: '住房', icon: 'home', color: '#98D8C8' },
  { id: '8', name: '工资', icon: 'dollar-sign', color: '#F7DC6F' },
  { id: '9', name: '投资', icon: 'trending-up', color: '#BB8FCE' },
  { id: '10', name: '其他', icon: 'more-horizontal', color: '#AED6F1' },
];
