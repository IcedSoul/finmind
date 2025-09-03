import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bill } from '@/types';

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return '今天';
  } else if (diffDays === 2) {
    return '昨天';
  } else if (diffDays <= 7) {
    return `${diffDays - 1}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const storage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

export const groupBillsByDate = (bills: Bill[]): { [key: string]: Bill[] } => {
  return bills.reduce(
    (groups, bill) => {
      const date = formatDate(bill.time);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(bill);
      return groups;
    },
    {} as { [key: string]: Bill[] },
  );
};

export const calculateTotalAmount = (
  bills: Bill[],
  type?: 'income' | 'expense',
): number => {
  return bills
    .filter(bill => !type || bill.type === type)
    .reduce((total, bill) => total + bill.amount, 0);
};

export const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    餐饮: 'restaurant',
    交通: 'car',
    购物: 'shopping-bag',
    娱乐: 'music',
    医疗: 'heart',
    教育: 'book',
    工资: 'dollar-sign',
    其他: 'more-horizontal',
  };
  return iconMap[category] || 'more-horizontal';
};

export const getCategoryColor = (category: string): string => {
  const colorMap: { [key: string]: string } = {
    餐饮: '#FF6B6B',
    交通: '#4ECDC4',
    购物: '#45B7D1',
    娱乐: '#96CEB4',
    医疗: '#FFEAA7',
    教育: '#DDA0DD',
    工资: '#98D8C8',
    其他: '#F7DC6F',
  };
  return colorMap[category] || '#F7DC6F';
};

export const parseFileContent = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Parse file content error:', error);
    throw error;
  }
};

export const exportToCSV = (bills: Bill[]): string => {
  const headers = ['时间', '渠道', '商户', '类型', '金额', '分类'];
  const csvContent = [
    headers.join(','),
    ...bills.map(bill =>
      [
        formatDateTime(bill.time),
        bill.channel,
        bill.merchant,
        bill.type === 'income' ? '收入' : '支出',
        bill.amount,
        bill.category,
      ].join(','),
    ),
  ].join('\n');

  return csvContent;
};

export const getMonthRange = (
  date: Date = new Date(),
): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
};

export const getWeekRange = (
  date: Date = new Date(),
): { start: Date; end: Date } => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};
