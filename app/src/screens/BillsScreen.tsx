import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation';
import Icon from 'react-native-vector-icons/Feather';
import { Bill } from '@/types';
import { formatCurrency, formatDate, groupBillsByDate } from '@/utils';
import { useBillsStore } from '@/store/billsStore';
type FilterType = 'all' | 'income' | 'expense';
type SortType = 'time' | 'amount';

interface FilterButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

interface BillItemProps {
  bill: Bill;
  onEdit: (bill: Bill) => void;
  onDelete: (billId: string) => void;
}

interface SectionHeaderProps {
  date: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  title,
  isActive,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.filterButton, isActive && styles.filterButtonActive]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.filterButtonText,
        isActive && styles.filterButtonTextActive,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

const BillItem: React.FC<BillItemProps> = ({ bill, onEdit, onDelete }) => (
  <TouchableOpacity
    style={styles.billItem}
    onPress={() => onEdit(bill)}
    onLongPress={() => onDelete(bill.id)}
  >
    <View style={styles.billContent}>
      <View style={styles.billInfo}>
        <Text style={styles.billMerchant}>{bill.merchant}</Text>
        {bill.description && (
          <Text style={styles.billDescription}>{bill.description}</Text>
        )}
        <View style={styles.billMeta}>
          <Text style={styles.billCategory}>{bill.category}</Text>
          <Text style={styles.billTime}>
            {new Date(bill.time).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
      <View style={styles.billAmount}>
        <Text
          style={[
            styles.billAmountText,
            bill.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
          ]}
        >
          {bill.type === 'income' ? '+' : '-'}
          {formatCurrency(bill.amount)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const SectionHeader: React.FC<SectionHeaderProps> = ({ date }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{formatDate(date)}</Text>
  </View>
);

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BillsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const { bills, loading, fetchBills, deleteBill } = useBillsStore();

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('time');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filteredAndSortedBills = useMemo(() => {
    if (!bills || !Array.isArray(bills)) {
      return [];
    }

    let filtered = bills;

    if (searchText) {
      filtered = filtered.filter(
        (bill: Bill) =>
          bill.merchant.toLowerCase().includes(searchText.toLowerCase()) ||
          bill.description?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((bill: Bill) => bill.type === filterType);
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (bill: Bill) => bill.category === selectedCategory,
      );
    }

    filtered.sort((a, b) => {
      if (sortType === 'time') {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

    return filtered;
  }, [bills, searchText, filterType, selectedCategory, sortType]);

  const groupedBills = useMemo(() => {
    return groupBillsByDate(filteredAndSortedBills);
  }, [filteredAndSortedBills]);

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

  const clearFilters = () => {
    setSearchText('');
    setFilterType('all');
    setSelectedCategory('');
    setSortType('time');
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'header') {
      return <SectionHeader date={item.date} />;
    }
    return (
      <BillItem
        bill={item}
        onEdit={handleEditBill}
        onDelete={handleDeleteBill}
      />
    );
  };

  const flatListData = useMemo(() => {
    const data: any[] = [];
    Object.entries(groupedBills).forEach(([date, billsArray]) => {
      data.push({ type: 'header', date, id: `header-${date}` });
      billsArray.forEach(bill => {
        data.push({ ...bill, type: 'bill' });
      });
    });
    return data;
  }, [groupedBills]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon
            name={'search' as any}
            size={20}
            color="#8E8E93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索商户或备注"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#8E8E93"
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name={'x' as any} size={20} color="#8E8E93" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name={'filter' as any} size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>类型:</Text>
            <View style={styles.filterButtons}>
              <FilterButton
                title="全部"
                isActive={filterType === 'all'}
                onPress={() => setFilterType('all')}
              />
              <FilterButton
                title="收入"
                isActive={filterType === 'income'}
                onPress={() => setFilterType('income')}
              />
              <FilterButton
                title="支出"
                isActive={filterType === 'expense'}
                onPress={() => setFilterType('expense')}
              />
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>排序:</Text>
            <View style={styles.filterButtons}>
              <FilterButton
                title="时间"
                isActive={sortType === 'time'}
                onPress={() => setSortType('time')}
              />
              <FilterButton
                title="金额"
                isActive={sortType === 'amount'}
                onPress={() => setSortType('amount')}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearFiltersText}>清除筛选</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name={'file-text' as any} size={64} color="#C7C7CC" />
            <Text style={styles.emptyText}>暂无账单记录</Text>
            <TouchableOpacity
              style={styles.addBillButton}
              onPress={navigateToAddBill}
            >
              <Text style={styles.addBillButtonText}>添加账单</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={navigateToAddBill}>
        <Icon name={'plus' as any} size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1C1C1E',
    paddingVertical: 0,
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  filterToggle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#1C1C1E',
    width: 50,
    fontWeight: '500',
  },
  filterButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  clearFiltersButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#007AFF',
  },
  listContainer: {
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  billItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  billContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billInfo: {
    flex: 1,
    marginRight: 16,
  },
  billMerchant: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  billDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  billMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billCategory: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  billTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  billAmount: {
    alignItems: 'flex-end',
  },
  billAmountText: {
    fontSize: 18,
    fontWeight: '600',
  },
  incomeAmount: {
    color: '#34C759',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 24,
  },
  addBillButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addBillButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default BillsScreen;
