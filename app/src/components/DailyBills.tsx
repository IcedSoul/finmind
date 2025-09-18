import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { formatCurrency } from '@/utils';
import { Bill } from '@/types';

interface Props {
  date: string;
  bills: Bill[];
}

const DailyBills: React.FC<Props> = ({ date, bills }) => {
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
          <Text style={[styles.dailyAmount, styles.incomeAmount]}>+{formatCurrency(dayIncome)}</Text>
          <Text style={[styles.dailyAmount, styles.expenseAmount]}>-{formatCurrency(dayExpense)}</Text>
        </View>
      </View>
      {bills.map((bill, index) => (
        <View key={bill.id?.toString() || index} style={styles.billItem}>
          <View style={styles.billIcon}>
            <Icon
              name={bill.type === 'income' ? 'trending-up' : 'trending-down'}
              size={16}
              color={bill.type === 'income' ? '#00B894' : '#E17055'}
            />
          </View>
          <View style={styles.billInfo}>
            <Text style={styles.billMerchant}>{bill.merchant}</Text>
            <Text style={styles.billCategory}>{bill.category}</Text>
          </View>
          <Text style={[styles.billAmount, bill.type === 'income' ? styles.incomeAmount : styles.expenseAmount]}>
            {bill.type === 'income' ? '+' : '-'}{formatCurrency(bill.amount)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dailyBillsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginRight: 8,
  },
  dayText: {
    fontSize: 12,
    color: '#636E72',
  },
  dailySummary: {
    flexDirection: 'row',
    gap: 12,
  },
  dailyAmount: {
    fontSize: 12,
    fontWeight: '600',
  },
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
  },
  billIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  billInfo: {
    flex: 1,
  },
  billMerchant: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3436',
    marginBottom: 2,
  },
  billCategory: {
    fontSize: 12,
    color: '#636E72',
  },
  billAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#00D68F',
  },
  expenseAmount: {
    color: '#FF6B6B',
  },
});

export default DailyBills;