import { useState, useEffect, useCallback, useRef } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState, Category } from '@/types';
import { databaseService } from '@/services/database';
import { storage } from '@/utils';

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  const validateField = (name: keyof T, value: any) => {
    // 简单的验证逻辑，可以根据需要扩展
    if (value === '' || value === undefined || value === null) {
      setErrors(prev => ({ ...prev, [name]: '此字段不能为空' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
      return true;
    }
  };

  const validate = (): boolean => {
    let isValid = true;
    const newTouched: Partial<Record<keyof T, boolean>> = {};

    Object.keys(values).forEach(key => {
      const fieldKey = key as keyof T;
      newTouched[fieldKey] = true;
      const isFieldValid = validateField(fieldKey, values[fieldKey]);
      if (!isFieldValid) {
        isValid = false;
      }
    });

    setTouched(newTouched);
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
  };
};

export const useBackHandler = (handler: () => boolean) => {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handler,
    );
    return () => subscription.remove();
  }, [handler]);
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await databaseService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, refreshCategories: fetchCategories };
};

export const useAuth = () => {
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const logout = useCallback(() => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: async () => {
          await storage.removeItem('auth');
          // 这里应该调用 authSlice 中的 logout action
          // _dispatch(logout());
        },
      },
    ]);
  }, []);

  return { user, token, isAuthenticated, loading, error, logout };
};

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  // 模拟网络状态检测，实际应用中应使用 NetInfo 库
  useEffect(() => {
    setIsConnected(true);
    const interval = setInterval(() => {
      // 随机模拟网络波动
      if (Math.random() > 0.9) {
        setIsConnected(prev => !prev);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected };
};

export const useSyncStatus = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  const startSync = useCallback(() => {
    setIsSyncing(true);
    // 实际同步逻辑应该在这里
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date());
      setPendingChanges(0);
    }, 2000);
  }, []);

  const checkPendingChanges = useCallback(async () => {
    try {
      const bills = await databaseService.getBills();
      setPendingChanges(bills.length);
    } catch (error) {
      console.error('Error checking pending changes:', error);
    }
  }, []);

  useEffect(() => {
    checkPendingChanges();
    const interval = setInterval(checkPendingChanges, 60000);
    return () => clearInterval(interval);
  }, [checkPendingChanges]);

  return { isSyncing, lastSyncTime, pendingChanges, startSync };
};
