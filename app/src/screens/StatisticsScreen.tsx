import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import {RootState} from '@/types';
import {
  formatCurrency,
  getMonthRange,
  getWeekRange,
  calculateTotalAmount,
  getCategoryColor,
} from '@/utils';
import {useCategories} from '@/hooks';

const {width} = Dimensions.get('window');
const chartWidth = width - 40;

type PeriodType = 'week' | 'month' | 'year';

const StatisticsScreen = () => {
  const {bills} = useSelector((state: RootState) => state.bills);
  const {categories} = useCategories();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'category' | 'trend'>('overview');

  const getPeriodRange = () => {
    switch (selectedPeriod) {
      case 'week':
        return getWeekRange();
      case 'month':
        return getMonthRange();
      case 'year':
        const now = new Date();
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear(), 11, 31),
        };
      default:
        return getMonthRange();
    }
  };

  const periodRange = getPeriodRange();
  const periodBills = bills.filter(bill => {
    const billDate = new Date(bill.time);
    return billDate >= periodRange.start && billDate <= periodRange.end;
  });

  const totalIncome = calculateTotalAmount(periodBills, 'income');
  const totalExpense = calculateTotalAmount(periodBills, 'expense');
  const balance = totalIncome - totalExpense;

  const categoryStats = useMemo(() => {
    const stats: {[key: string]: {income: number; expense: number}} = {};
    
    periodBills.forEach(bill => {
      if (!stats[bill.category]) {
        stats[bill.category] = {income: 0, expense: 0};
      }
      stats[bill.category][bill.type] += bill.amount;
    });

    return Object.entries(stats)
      .map(([category, amounts]) => ({
        category,
        income: amounts.income,
        expense: amounts.expense,
        total: amounts.income + amounts.expense,
        percentage: ((amounts.expense / totalExpense) * 100) || 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [periodBills, totalExpense]);

  const trendData = useMemo(() => {
    const days = 7;
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayBills = bills.filter(bill => {
        const billDate = new Date(bill.time);
        return billDate >= dayStart && billDate <= dayEnd;
      });
      
      const income = calculateTotalAmount(dayBills, 'income');
      const expense = calculateTotalAmount(dayBills, 'expense');
      
      data.push({
        date: dayStart.toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric'}),
        income,
        expense,
      });
    }
    
    return data;
  }, [bills]);

  const PeriodButton = ({period, title}: {period: PeriodType; title: string}) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.periodButtonActive,
      ]}
      onPress={() => setSelectedPeriod(period)}>
      <Text
        style={[
          styles.periodButtonText,
          selectedPeriod === period && styles.periodButtonTextActive,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const TabButton = ({tab, title}: {tab: typeof selectedTab; title: string}) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        selectedTab === tab && styles.tabButtonActive,
      ]}
      onPress={() => setSelectedTab(tab)}>
      <Text
        style={[
          styles.tabButtonText,
          selectedTab === tab && styles.tabButtonTextActive,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const OverviewTab = () => (
    <View>
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>收支概览</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>收入</Text>
            <Text style={[styles.summaryAmount, {color: '#34C759'}]}>
              {formatCurrency(totalIncome)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>支出</Text>
            <Text style={[styles.summaryAmount, {color: '#FF3B30'}]}>
              {formatCurrency(totalExpense)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>结余</Text>
            <Text
              style={[
                styles.summaryAmount,
                {color: balance >= 0 ? '#34C759' : '#FF3B30'},
              ]}>
              {formatCurrency(balance)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>收支对比</Text>
        <View style={styles.barChart}>
          <View style={styles.barChartRow}>
            <Text style={styles.barLabel}>收入</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: totalIncome > 0 ? (totalIncome / Math.max(totalIncome, totalExpense)) * (chartWidth - 100) : 0,
                    backgroundColor: '#34C759',
                  },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{formatCurrency(totalIncome)}</Text>
          </View>
          <View style={styles.barChartRow}>
            <Text style={styles.barLabel}>支出</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: totalExpense > 0 ? (totalExpense / Math.max(totalIncome, totalExpense)) * (chartWidth - 100) : 0,
                    backgroundColor: '#FF3B30',
                  },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{formatCurrency(totalExpense)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const CategoryTab = () => (
    <View style={styles.chartCard}>
      <Text style={styles.cardTitle}>分类统计</Text>
      {categoryStats.length > 0 ? (
        categoryStats.slice(0, 8).map((stat, index) => (
          <View key={stat.category} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <View
                style={[
                  styles.categoryDot,
                  {backgroundColor: getCategoryColor(stat.category)},
                ]}
              />
              <Text style={styles.categoryName}>{stat.category}</Text>
            </View>
            <View style={styles.categoryStats}>
              <Text style={styles.categoryAmount}>
                {formatCurrency(stat.expense)}
              </Text>
              <Text style={styles.categoryPercentage}>
                {stat.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="pie-chart" size={48} color="#C7C7CC" />
          <Text style={styles.emptyText}>暂无分类数据</Text>
        </View>
      )}
    </View>
  );

  const TrendTab = () => (
    <View style={styles.chartCard}>
      <Text style={styles.cardTitle}>7日趋势</Text>
      <View style={styles.trendChart}>
        {trendData.map((item, index) => {
          const maxAmount = Math.max(
            ...trendData.map(d => Math.max(d.income, d.expense))
          );
          return (
            <View key={index} style={styles.trendItem}>
              <View style={styles.trendBars}>
                <View
                  style={[
                    styles.trendBar,
                    {
                      height: maxAmount > 0 ? (item.income / maxAmount) * 80 : 0,
                      backgroundColor: '#34C759',
                    },
                  ]}
                />
                <View
                  style={[
                    styles.trendBar,
                    {
                      height: maxAmount > 0 ? (item.expense / maxAmount) * 80 : 0,
                      backgroundColor: '#FF3B30',
                    },
                  ]}
                />
              </View>
              <Text style={styles.trendDate}>{item.date}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: '#34C759'}]} />
          <Text style={styles.legendText}>收入</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: '#FF3B30'}]} />
          <Text style={styles.legendText}>支出</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>数据统计</Text>
      </View>

      <View style={styles.periodSelector}>
        <PeriodButton period="week" title="本周" />
        <PeriodButton period="month" title="本月" />
        <PeriodButton period="year" title="本年" />
      </View>

      <View style={styles.tabSelector}>
        <TabButton tab="overview" title="概览" />
        <TabButton tab="category" title="分类" />
        <TabButton tab="trend" title="趋势" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && <OverviewTab />}
        {selectedTab === 'category' && <CategoryTab />}
        {selectedTab === 'trend' && <TrendTab />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#007AFF',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
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
    fontSize: 20,
    fontWeight: '600',
  },
  barChart: {
    marginTop: 8,
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  barLabel: {
    width: 40,
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginHorizontal: 12,
    justifyContent: 'center',
  },
  bar: {
    height: 24,
    borderRadius: 12,
  },
  barValue: {
    fontSize: 12,
    color: '#8E8E93',
    minWidth: 60,
    textAlign: 'right',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginVertical: 20,
  },
  trendItem: {
    alignItems: 'center',
    flex: 1,
  },
  trendBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 8,
  },
  trendBar: {
    width: 8,
    marginHorizontal: 1,
    borderRadius: 4,
  },
  trendDate: {
    fontSize: 10,
    color: '#8E8E93',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
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
  },
});

export default StatisticsScreen;