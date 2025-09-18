import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency, getMonthRange, calculateTotalAmount } from '@/utils';
import { useSyncStatus } from '@/hooks';
import { useAuthStore, useBillsStore } from '@/store';
import DailyBills from '@/components/DailyBills';

const { width } = Dimensions.get('window');

// User Avatar Component
const UserAvatar = ({ user, onPress }: {
  user: any;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.userAvatar}>
    {user?.avatar ? (
      <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
    ) : (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

// Daily Bills Component
const DailyBillsLegacy = ({ date, bills }: {
  date: string;
  bills: any[];
}) => {
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { bills, fetchBills } = useBillsStore();
  const [refreshing, setRefreshing] = useState(false);
  const { pendingChanges, startSync } = useSyncStatus();

  const currentMonth = getMonthRange();
  const monthlyBills = bills?.filter(bill => {
    const billDate = new Date(bill.time);
    return billDate >= currentMonth.start && billDate <= currentMonth.end;
  });

  const monthlyIncome = calculateTotalAmount(monthlyBills, 'income');
  const monthlyExpense = calculateTotalAmount(monthlyBills, 'expense');
  const monthlyBalance = monthlyIncome - monthlyExpense;

  // 按日期分组账单
  const groupBillsByDate = (bills: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    bills?.forEach(bill => {
      const date = new Date(bill.time).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(bill);
    });
    return Object.entries(grouped).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  };

  const groupedBills = groupBillsByDate(bills?.slice(0, 20) || []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

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

  const navigateToAddBill = () => {
    navigation.navigate('AddBill' as never);
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile' as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      {/* Header with gradient background */}
      <LinearGradient
        colors={['#6C5CE7', '#A29BFE']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuButton}>
              <Icon name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <UserAvatar user={user} onPress={navigateToProfile} />
          </View>
          
          {/* Combined Financial Summary Card */}
          <View style={styles.financialCard}>
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>总余额</Text>
              <Text style={styles.balanceAmount}>
                {formatCurrency(monthlyBalance)}
              </Text>
            </View>
            <View style={styles.summarySection}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>本月收入</Text>
                <Text style={[styles.summaryAmount, styles.incomeAmount]}>
                  {formatCurrency(monthlyIncome)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>本月支出</Text>
                <Text style={[styles.summaryAmount, styles.expenseAmount]}>
                  {formatCurrency(monthlyExpense)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {pendingChanges > 0 && (
          <TouchableOpacity style={styles.syncCard} onPress={startSync}>
            <Icon name="cloud-off" size={20} color="#FF9500" />
            <Text style={styles.syncText}>有 {pendingChanges} 条记录待同步</Text>
            <Icon name="chevron-right" size={16} color="#FF9500" />
          </TouchableOpacity>
        )}

        {/* Recent Transactions by Date */}
        <View style={styles.recentBills}>
          {groupedBills.length > 0 ? (
            groupedBills.map(([date, bills]) => (
              <DailyBills key={date} date={date} bills={bills} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="file-text" size={48} color="#DDD6FE" />
              <Text style={styles.emptyText}>暂无交易记录</Text>
              <TouchableOpacity
                style={styles.addFirstBillButton}
                onPress={navigateToAddBill}
              >
                <Text style={styles.addFirstBillText}>添加第一笔账单</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={navigateToAddBill}>
        <LinearGradient
          colors={['#6C5CE7', '#A29BFE']}
          style={styles.floatingButtonGradient}
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  userAvatar: {
    padding: 8,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
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
  content: {
    flex: 1,
    marginTop: -15,
  },
  financialCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    backdropFilter: 'blur(10px)',
  },
  balanceSection: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#DDD6FE',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#DDD6FE',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  incomeAmount: {
    color: '#00D68F',
  },
  expenseAmount: {
    color: '#FF6B6B',
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  syncText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
  },

  recentBills: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 20,
  },
  addFirstBillButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstBillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
