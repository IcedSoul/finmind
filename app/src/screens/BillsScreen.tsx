import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ScrollView,
  Dimensions,
  StatusBar,
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { Bill } from '@/types';
import { formatCurrency, formatDate } from '@/utils';
import { useBillsStore } from '@/store/billsStore';
import MonthYearPicker from '@/components/MonthYearPicker';
import DailyBills from '@/components/DailyBills';

const { width: screenWidth } = Dimensions.get('window');

// 响应式计算函数
const getResponsiveCalendarLayout = () => {
  const containerMargin = 16; // calendar container margin
  const containerPadding = 8; // calendar container padding
  const totalHorizontalSpace = containerMargin * 2 + containerPadding * 2; // 48
  
  // 可用宽度 = 屏幕宽度 - 容器边距和内边距
  const availableWidth = screenWidth - totalHorizontalSpace;
  
  // 每个日期格子的宽度，确保7列完美适配
  const dayWidth = Math.floor(availableWidth / 7);
  
  // 计算实际使用的总宽度
  const actualUsedWidth = dayWidth * 7;
  
  // 如果有剩余空间，平均分配给左右padding
  const remainingSpace = availableWidth - actualUsedWidth;
  const extraPadding = Math.floor(remainingSpace / 2);
  
  return {
    dayWidth,
    extraPadding,
    availableWidth,
  };
};

// 获取响应式布局参数
const responsiveLayout = getResponsiveCalendarLayout();

// Calendar helper functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const formatDateKey = (date: Date) => {
  return date.toDateString();
};

interface CalendarDayProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  dayIncome: number;
  dayExpense: number;
  onPress: (date: Date) => void;
}

interface MonthCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  bills: Bill[];
}

interface DailyTransactionProps {
  date: Date;
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  onDelete: (billId: string) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isSelected,
  isToday,
  dayIncome,
  dayExpense,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.calendarDay,
        isSelected && styles.calendarDaySelected,
        isToday && styles.calendarDayToday,
      ]}
      onPress={() => onPress(date)}
    >
      <Text
        style={[
          styles.calendarDayText,
          isSelected && styles.calendarDayTextSelected,
          isToday && styles.calendarDayTextToday,
        ]}
        numberOfLines={1}
      >
        {date.getDate()}
      </Text>
      <View style={styles.calendarDayAmounts}>
        {dayIncome > 0 ? (
          <Text style={[styles.calendarDayAmount, styles.incomeAmount]} numberOfLines={1} ellipsizeMode="tail">+{formatCurrency(dayIncome)}</Text>
        ) : (
          <View style={styles.emptyAmount} />
        )}
        {dayExpense > 0 ? (
          <Text style={[styles.calendarDayAmount, styles.expenseAmount, styles.expenseAmountSmall]} numberOfLines={1} ellipsizeMode="tail">-{formatCurrency(dayExpense)}</Text>
        ) : (
          <View style={styles.emptyAmount} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const MonthCalendar: React.FC<MonthCalendarProps> = ({ selectedDate, onDateSelect, bills }) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  
  // Group bills by date
  const billsByDate = useMemo(() => {
    const grouped: { [key: string]: Bill[] } = {};
    bills?.forEach(bill => {
      const billDate = new Date(bill.time);
      const key = formatDateKey(billDate);
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(bill);
    });
    return grouped;
  }, [bills]);
  
  const getDayData = (date: Date) => {
    const key = formatDateKey(date);
    const dayBills = billsByDate[key] || [];
    const dayIncome = dayBills.filter(bill => bill.type === 'income').reduce((sum, bill) => sum + bill.amount, 0);
    const dayExpense = dayBills.filter(bill => bill.type === 'expense').reduce((sum, bill) => sum + bill.amount, 0);
    return { dayIncome, dayExpense };
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const { dayIncome, dayExpense } = getDayData(date);
      const isSelected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, today);
      
      days.push(
        <CalendarDay
          key={day}
          date={date}
          isSelected={isSelected}
          isToday={isToday}
          dayIncome={dayIncome}
          dayExpense={dayExpense}
          onPress={onDateSelect}
        />
      );
    }
    
    return days;
  };
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  return (
    <View style={styles.calendar}>
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {renderCalendarDays()}
      </View>
    </View>
  );
};

const DailyBillsLegacy = ({ date, bills, onEdit, onDelete }: {
  date: Date;
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  onDelete: (billId: string) => void;
}) => {
  if (!bills || bills.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Icon name="file-text" size={48} color="#DDD6FE" />
        <Text style={styles.emptyText}>该日期暂无交易记录</Text>
      </View>
    );
  }

  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('zh-CN', { weekday: 'short' });
  const dayMonth = dateObj.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  
  const dayIncome = bills.filter(bill => bill.type === 'income').reduce((sum, bill) => sum + bill.amount, 0);
  const dayExpense = bills.filter(bill => bill.type === 'expense').reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <View style={styles.dailyBillsContainer}>
      <View style={styles.dailyHeader}>
        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>{dayMonth}</Text>
          <Text style={styles.dayText}>{dayName}</Text>
        </View>
        <View style={styles.dailySummary}>
          {dayIncome > 0 && (
            <Text style={[styles.dailyAmount, styles.incomeAmount]}>+{formatCurrency(dayIncome)}</Text>
          )}
          {dayExpense > 0 && (
            <Text style={[styles.dailyAmount, styles.expenseAmount]}>-{formatCurrency(dayExpense)}</Text>
          )}
        </View>
      </View>
      {bills.map((bill, index) => (
        <TouchableOpacity
          key={bill.id?.toString() || index}
          style={styles.billItem}
          onPress={() => onEdit(bill)}
          onLongPress={() => onDelete(bill.id.toString())}
        >
          <View style={styles.billIcon}>
            <Icon 
              name={bill.type === 'income' ? 'trending-up' : 'trending-down'} 
              size={16} 
              color={bill.type === 'income' ? '#00B894' : '#E17055'} 
            />
          </View>
          <View style={styles.billInfo}>
            <Text style={styles.billMerchant}>{bill.description || bill.category}</Text>
            <Text style={styles.billCategory}>{bill.category}</Text>
          </View>
          <Text style={[styles.billAmount, bill.type === 'income' ? styles.incomeAmount : styles.expenseAmount]}>
            {bill.type === 'income' ? '+' : '-'}{formatCurrency(bill.amount)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getCategoryEmoji = (category: string) => {
  const emojiMap: { [key: string]: string } = {
    '餐饮': '🍽️',
    '交通': '🚗',
    '购物': '🛍️',
    '娱乐': '🎮',
    '医疗': '🏥',
    '其他': '📝'
  };
  return emojiMap[category] || '📝';
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BillsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const { bills, loading, fetchBills, deleteBill } = useBillsStore();

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const selectedDateBills = useMemo(() => {
    if (!bills || !Array.isArray(bills)) {
      return [];
    }
    
    return bills.filter(bill => {
      const billDate = new Date(bill.time);
      return isSameDay(billDate, selectedDate);
    });
  }, [bills, selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMonthSelect = (date: Date) => {
    setSelectedDate(date);
    setShowMonthPicker(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBills();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteBill = (billId: string) => {
    Alert.alert('确认删除', '确定要删除这条账单记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBill(billId);
            Alert.alert('成功', '账单已删除');
          } catch (error) {
            Alert.alert('错误', '删除失败，请重试');
          }
        },
      },
    ]);
  };

  const handleEditBill = (bill: Bill) => {
    navigation.navigate('AddBill', { bill });
  };

  const navigateToAddBill = () => {
    navigation.navigate('AddBill');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const handleSwipeGesture = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      navigateMonth('next');
    } else {
      navigateMonth('prev');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      <LinearGradient
        colors={['#6C5CE7', '#A29BFE']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.monthSelector}
            onPress={() => setShowMonthPicker(true)}
          >
            <Text style={styles.headerTitle}>
              {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月
            </Text>
            <Icon name="chevron-down" size={16} color="white" style={styles.dropdownIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={navigateToAddBill}>
            <Icon name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <MonthCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          bills={bills}
        />
        
        <View style={styles.dailyBillsWrapper}>
          <DailyBills
            date={selectedDate.toDateString()}
            bills={selectedDateBills}
          />
        </View>
      </ScrollView>

      <MonthYearPicker
        visible={showMonthPicker}
        selectedDate={selectedDate}
        onDateSelect={handleMonthSelect}
        onClose={() => setShowMonthPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  dropdownIcon: {
    marginLeft: 4,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
  },
  calendar: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: responsiveLayout.extraPadding,
  },
  weekDayText: {
    width: responsiveLayout.dayWidth,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: responsiveLayout.extraPadding,
  },
  calendarDay: {
    width: responsiveLayout.dayWidth,
    height: 54,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginVertical: 1,
  },
  calendarDaySelected: {
    backgroundColor: '#667eea',
    borderRadius: 6,
  },
  calendarDayToday: {
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 1,
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
  },
  calendarDayTextToday: {
    color: '#667eea',
  },
  calendarDayAmounts: {
    alignItems: 'center',
    gap: 1,
    width: '100%',
  },
  calendarDayAmount: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  expenseAmountSmall: {
    fontSize: 8,
  },
  dailyTransactions: {
    backgroundColor: '#FFFFFF',
    margin: 8,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  dailyDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  dailySummary: {
    alignItems: 'flex-end',
  },
  dailyIncome: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  dailyExpense: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    marginTop: 2,
  },
  transactionList: {
    padding: 12,
    paddingTop: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  transactionContent: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  billItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  billContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
    marginRight: 16,
  },
  billMerchant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  billCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  billTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  billAmount: {
    alignItems: 'flex-end',
  },
  billAmountText: {
    fontSize: 18,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#4ECDC4',
  },
  emptyAmount: {
    height: 12,
  },
  expenseAmount: {
    color: '#FF6B6B',
  },
  dailyBillsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  dayText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  dailyAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  billIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  addBillButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBillButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  dailyBillsWrapper: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 16,
  },
});

export default BillsScreen;
