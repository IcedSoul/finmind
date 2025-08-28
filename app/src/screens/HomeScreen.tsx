import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {RootState} from '@/types';
import {formatCurrency, getMonthRange, calculateTotalAmount} from '@/utils';
import {useSyncStatus} from '@/hooks';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const {bills, loading} = useSelector((state: RootState) => state.bills);
  const [refreshing, setRefreshing] = useState(false);
  const {isSyncing, pendingChanges, startSync} = useSyncStatus();

  const currentMonth = getMonthRange();
  const monthlyBills = bills.filter(bill => {
    const billDate = new Date(bill.time);
    return billDate >= currentMonth.start && billDate <= currentMonth.end;
  });

  const monthlyIncome = calculateTotalAmount(monthlyBills, 'income');
  const monthlyExpense = calculateTotalAmount(monthlyBills, 'expense');
  const monthlyBalance = monthlyIncome - monthlyExpense;

  const recentBills = bills.slice(0, 5);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // 这里应该调用获取账单的 action
      // await dispatch(fetchBills());
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToAddBill = () => {
    navigation.navigate('AddBill' as never);
  };

  const navigateToImport = () => {
    navigation.navigate('Import' as never);
  };

  const navigateToBills = () => {
    navigation.navigate('Bills' as never);
  };

  const navigateToStatistics = () => {
    navigation.navigate('Statistics' as never);
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile' as never);
  };

  const QuickActionButton = ({
    icon,
    title,
    onPress,
    color = '#007AFF',
  }: {
    icon: string;
    title: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <View style={[styles.quickActionIcon, {backgroundColor: color}]}>
        <Icon name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const BillItem = ({bill}: {bill: any}) => (
    <View style={styles.billItem}>
      <View style={styles.billInfo}>
        <View style={styles.billHeader}>
          <Text style={styles.billMerchant}>{bill.merchant}</Text>
          <Text
            style={[
              styles.billAmount,
              {color: bill.type === 'income' ? '#34C759' : '#FF3B30'},
            ]}>
            {bill.type === 'income' ? '+' : '-'}{formatCurrency(bill.amount)}
          </Text>
        </View>
        <View style={styles.billDetails}>
          <Text style={styles.billCategory}>{bill.category}</Text>
          <Text style={styles.billTime}>
            {new Date(bill.time).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>你好，{user?.name || '用户'}</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={navigateToProfile}>
          <Icon name="user" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>本月概览</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>收入</Text>
            <Text style={[styles.summaryAmount, {color: '#34C759'}]}>
              {formatCurrency(monthlyIncome)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>支出</Text>
            <Text style={[styles.summaryAmount, {color: '#FF3B30'}]}>
              {formatCurrency(monthlyExpense)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>结余</Text>
            <Text
              style={[
                styles.summaryAmount,
                {color: monthlyBalance >= 0 ? '#34C759' : '#FF3B30'},
              ]}>
              {formatCurrency(monthlyBalance)}
            </Text>
          </View>
        </View>
      </View>

      {pendingChanges > 0 && (
        <TouchableOpacity style={styles.syncCard} onPress={startSync}>
          <Icon name="cloud-off" size={20} color="#FF9500" />
          <Text style={styles.syncText}>
            有 {pendingChanges} 条记录待同步
          </Text>
          <Icon name="chevron-right" size={16} color="#FF9500" />
        </TouchableOpacity>
      )}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>快捷操作</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="plus"
            title="添加账单"
            onPress={navigateToAddBill}
            color="#007AFF"
          />
          <QuickActionButton
            icon="upload"
            title="导入账单"
            onPress={navigateToImport}
            color="#34C759"
          />
          <QuickActionButton
            icon="list"
            title="账单列表"
            onPress={navigateToBills}
            color="#FF9500"
          />
          <QuickActionButton
            icon="bar-chart-2"
            title="数据统计"
            onPress={navigateToStatistics}
            color="#AF52DE"
          />
        </View>
      </View>

      <View style={styles.recentBills}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近账单</Text>
          <TouchableOpacity onPress={navigateToBills}>
            <Text style={styles.seeAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>
        {recentBills.length > 0 ? (
          recentBills.map((bill, index) => (
            <BillItem key={bill.id || index} bill={bill} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="file-text" size={48} color="#C7C7CC" />
            <Text style={styles.emptyText}>暂无账单记录</Text>
            <TouchableOpacity
              style={styles.addFirstBillButton}
              onPress={navigateToAddBill}>
              <Text style={styles.addFirstBillText}>添加第一笔账单</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
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
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    width: (width - 60) / 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  recentBills: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  billItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  billInfo: {
    flex: 1,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  billMerchant: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    flex: 1,
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  billDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billCategory: {
    fontSize: 14,
    color: '#8E8E93',
  },
  billTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 20,
  },
  addFirstBillButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstBillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;