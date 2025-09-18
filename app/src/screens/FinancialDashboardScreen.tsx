import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type TimeFilter = 'week' | 'month' | 'year';

const FinancialDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('week');

  const renderTimeFilter = () => (
    <View style={styles.headerTimeFilter}>
      <View style={styles.filterSelector}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'week' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('week')}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === 'week' && styles.filterTextActive,
            ]}
          >
            本周
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'month' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('month')}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === 'month' && styles.filterTextActive,
            ]}
          >
            本月
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'year' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('year')}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === 'year' && styles.filterTextActive,
            ]}
          >
            本年
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatisticsCards = () => (
    <View style={styles.statisticsContainer}>
      <View style={styles.compactStatsCard}>
        <View style={styles.compactStatsRow}>
          <View style={styles.mainStatItem}>
            <Text style={styles.mainStatLabel}>净收入</Text>
            <Text style={styles.mainStatAmount}>¥4,160</Text>
            <View style={styles.mainStatIndicator}>
              <Icon name="trending-up" size={12} color="#10B981" />
              <Text style={styles.mainStatChange}>+8.3%</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.compactStatItem}>
            <View style={styles.compactStatIcon}>
              <Icon name="arrow-down-left" size={16} color="#10B981" />
            </View>
            <View style={styles.compactStatContent}>
              <Text style={styles.compactStatLabel}>收入</Text>
              <Text style={styles.compactStatAmount}>¥12,580</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.compactStatItem}>
            <View style={styles.compactStatIcon}>
              <Icon name="arrow-up-right" size={16} color="#EF4444" />
            </View>
            <View style={styles.compactStatContent}>
              <Text style={styles.compactStatLabel}>支出</Text>
              <Text style={styles.compactStatAmount}>¥8,420</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.compactStatItem}>
            <View style={styles.compactStatIcon}>
              <Icon name="wallet" size={16} color="#6C5CE7" />
            </View>
            <View style={styles.compactStatContent}>
              <Text style={styles.compactStatLabel}>余额</Text>
              <Text style={styles.compactStatAmount}>¥24,680</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPieChart = () => {
    const pieData = [
      { category: '餐饮', amount: 2580, color: '#6C5CE7', percentage: 35 },
      { category: '购物', amount: 1850, color: '#A29BFE', percentage: 25 },
      { category: '交通', amount: 1200, color: '#74B9FF', percentage: 16 },
      { category: '娱乐', amount: 980, color: '#FD79A8', percentage: 13 },
      { category: '其他', amount: 810, color: '#FDCB6E', percentage: 11 },
    ];

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>支出分类</Text>
          <TouchableOpacity>
            <Icon name="more-horizontal" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <View style={styles.pieChartContent}>
          <View style={styles.pieChartWrapper}>
            <View style={styles.pieChart}>
              <View style={[styles.pieSlice, { backgroundColor: '#6C5CE7', transform: [{ rotate: '0deg' }] }]} />
              <View style={[styles.pieSlice, { backgroundColor: '#A29BFE', transform: [{ rotate: '126deg' }] }]} />
              <View style={[styles.pieSlice, { backgroundColor: '#74B9FF', transform: [{ rotate: '216deg' }] }]} />
              <View style={[styles.pieSlice, { backgroundColor: '#FD79A8', transform: [{ rotate: '274deg' }] }]} />
              <View style={[styles.pieSlice, { backgroundColor: '#FDCB6E', transform: [{ rotate: '320deg' }] }]} />
              <View style={styles.pieCenter}>
                <Text style={styles.pieCenterAmount}>¥7,420</Text>
                <Text style={styles.pieCenterLabel}>总支出</Text>
              </View>
            </View>
          </View>
          <View style={styles.pieLegend}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <View style={styles.legendText}>
                  <Text style={styles.legendCategory}>{item.category}</Text>
                  <Text style={styles.legendAmount}>¥{item.amount.toLocaleString()}</Text>
                </View>
                <Text style={styles.legendPercentage}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderTrendChart = () => {
    const trendData = [
      { day: '周一', income: 1200, expense: 800 },
      { day: '周二', income: 1500, expense: 1100 },
      { day: '周三', income: 900, expense: 600 },
      { day: '周四', income: 1800, expense: 950 },
      { day: '周五', income: 1100, expense: 750 },
      { day: '周六', income: 2200, expense: 1300 },
      { day: '周日', income: 1600, expense: 900 },
    ];

    const maxAmount = Math.max(...trendData.flatMap(d => [d.income, d.expense]));
    const chartWidth = width - 120;
    const chartHeight = 120;
    const pointSpacing = chartWidth / (trendData.length - 1);

    const getYPosition = (value: number) => {
      return chartHeight - (value / maxAmount) * chartHeight;
    };

    const createPath = (data: number[]) => {
      return data.map((value, index) => {
        const x = index * pointSpacing;
        const y = getYPosition(value);
        return index === 0 ? `M${x},${y}` : `L${x},${y}`;
      }).join(' ');
    };

    const incomeData = trendData.map(d => d.income);
    const expenseData = trendData.map(d => d.expense);

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>收支趋势</Text>
          <View style={styles.chartLegendRow}>
            <View style={styles.chartLegendItem}>
              <View style={[styles.chartLegendDot, { backgroundColor: '#6C5CE7' }]} />
              <Text style={styles.chartLegendText}>收入</Text>
            </View>
            <View style={styles.chartLegendItem}>
              <View style={[styles.chartLegendDot, { backgroundColor: '#FD79A8' }]} />
              <Text style={styles.chartLegendText}>支出</Text>
            </View>
          </View>
        </View>
        <View style={styles.lineChartContainer}>
          <View style={styles.chartWithAxis}>
            <View style={styles.yAxisLabels}>
              {[maxAmount, maxAmount * 0.75, maxAmount * 0.5, maxAmount * 0.25, 0].map((value, index) => (
                <Text key={index} style={styles.yAxisText}>¥{Math.round(value)}</Text>
              ))}
            </View>
            
            <View style={styles.lineChart}>
              <View style={styles.gridLines}>
                {[0, 25, 50, 75, 100].map((percent, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.gridLine, 
                      { top: `${percent}%` }
                    ]} 
                  />
                ))}
              </View>
              
              <View style={styles.lineChartContent}>
                <View style={styles.lineContainer}>
                  <View style={styles.incomePath}>
                    {trendData.map((item, index) => {
                      const incomeY = getYPosition(item.income);
                      const x = index * pointSpacing;
                      
                      return (
                        <View key={`income-${index}`}>
                          <View style={[styles.point, styles.incomePoint, { 
                            left: x, 
                            top: incomeY,
                            zIndex: 10
                          }]} />
                          {index < trendData.length - 1 && (
                            <View 
                              style={[
                                styles.lineSegment,
                                styles.incomeLine,
                                {
                                  left: x,
                                  top: incomeY + 3,
                                  width: Math.sqrt(
                                    Math.pow(pointSpacing, 2) + 
                                    Math.pow(getYPosition(trendData[index + 1].income) - incomeY, 2)
                                  ),
                                  transform: [{
                                    rotate: `${Math.atan2(
                                      getYPosition(trendData[index + 1].income) - incomeY,
                                      pointSpacing
                                    ) * 180 / Math.PI}deg`
                                  }]
                                }
                              ]}
                            />
                          )}
                        </View>
                      );
                    })}
                  </View>
                  
                  <View style={styles.expensePath}>
                    {trendData.map((item, index) => {
                      const expenseY = getYPosition(item.expense);
                      const x = index * pointSpacing;
                      
                      return (
                        <View key={`expense-${index}`}>
                          <View style={[styles.point, styles.expensePoint, { 
                            left: x, 
                            top: expenseY,
                            zIndex: 10
                          }]} />
                          {index < trendData.length - 1 && (
                            <View 
                              style={[
                                styles.lineSegment,
                                styles.expenseLine,
                                {
                                  left: x,
                                  top: expenseY + 3,
                                  width: Math.sqrt(
                                    Math.pow(pointSpacing, 2) + 
                                    Math.pow(getYPosition(trendData[index + 1].expense) - expenseY, 2)
                                  ),
                                  transform: [{
                                    rotate: `${Math.atan2(
                                      getYPosition(trendData[index + 1].expense) - expenseY,
                                      pointSpacing
                                    ) * 180 / Math.PI}deg`
                                  }]
                                }
                              ]}
                            />
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
                
                {trendData.map((item, index) => {
                  const incomeY = getYPosition(item.income);
                  const expenseY = getYPosition(item.expense);
                  const x = index * pointSpacing;
                  
                  return (
                    <View key={`values-${index}`} style={[styles.valueLabels, { left: x }]}>
                      <Text style={[styles.valueText, styles.incomeValue, { top: incomeY - 20 }]}>
                        ¥{item.income}
                      </Text>
                      <Text style={[styles.valueText, styles.expenseValue, { top: expenseY + 15 }]}>
                        ¥{item.expense}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
          
          <View style={styles.xAxisLabels}>
            {trendData.map((item, index) => (
              <View key={index} style={[styles.xAxisLabel, { left: index * pointSpacing + 30 }]}>
                <Text style={styles.xAxisText}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderTransactionRanking = () => {
    const topTransactions = [
      { category: '餐饮', amount: 1250, icon: 'coffee', color: '#FEF3C7', iconColor: '#F59E0B', percentage: 25 },
      { category: '购物', amount: 980, icon: 'shopping-bag', color: '#DBEAFE', iconColor: '#3B82F6', percentage: 20 },
      { category: '交通', amount: 650, icon: 'car', color: '#D1FAE5', iconColor: '#10B981', percentage: 13 },
      { category: '娱乐', amount: 420, icon: 'music', color: '#F3E8FF', iconColor: '#8B5CF6', percentage: 8 },
      { category: '医疗', amount: 320, icon: 'heart', color: '#FEE2E2', iconColor: '#EF4444', percentage: 6 },
    ];

    return (
      <View style={styles.rankingContainer}>
        <View style={styles.rankingHeader}>
          <Text style={styles.rankingTitle}>支出排行</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>查看详情</Text>
          </TouchableOpacity>
        </View>
        
        {topTransactions.map((item, index) => (
          <View key={index} style={styles.rankingItem}>
            <View style={styles.rankingLeft}>
              <View style={styles.rankingNumber}>
                <Text style={styles.rankingNumberText}>{index + 1}</Text>
              </View>
              <View style={[styles.rankingIcon, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={16} color={item.iconColor} />
              </View>
              <View style={styles.rankingDetails}>
                <Text style={styles.rankingCategory}>{item.category}</Text>
                <Text style={styles.rankingPercentage}>{item.percentage}%</Text>
              </View>
            </View>
            <View style={styles.rankingRight}>
              <Text style={styles.rankingAmount}>¥{item.amount.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      <LinearGradient
        colors={['#6C5CE7', '#A29BFE']}
        style={styles.headerGradient}
      >
        {renderTimeFilter()}
      </LinearGradient>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {renderStatisticsCards()}
        
        {renderPieChart()}
        
        {renderTrendChart()}
        
        {renderTransactionRanking()}
      </ScrollView>
      
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 14,
    color: '#E5E7EB',
    marginTop: 4,
  },
  headerTimeFilter: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  filterSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    padding: 2,
    alignSelf: 'flex-start',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 1,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
    opacity: 0.8,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#6C5CE7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
   },
  compactStatsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  compactStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mainStatItem: {
    flex: 2,
    alignItems: 'center',
    paddingRight: 10,
  },
  mainStatLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  mainStatAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 6,
  },
  mainStatIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mainStatChange: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
  },
  compactStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  compactStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  compactStatContent: {
    alignItems: 'center',
  },
  compactStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  compactStatAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  activeFilterButton: {
    backgroundColor: '#6C5CE7',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveFilterButton: {
    backgroundColor: 'transparent',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  inactiveFilterText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
  },
  statisticsContainer: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  mainStatsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  mainStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainStatsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  mainStatsLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  periodBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  mainStatsContent: {
    gap: 20,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  balanceLabel: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: -1,
    marginBottom: 8,
  },
  balanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceChange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  statChange: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    color: '#10B981',
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStatContent: {
    flex: 1,
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  quickStatAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  chartContent: {
    alignItems: 'center',
  },
  pieChartContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChartWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  pieSlice: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  pieCenter: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pieCenterAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  pieCenterLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  pieLegend: {
    flex: 1,
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
  },
  legendCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  legendAmount: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  legendPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C5CE7',
  },
  chartLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  chartLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  chartLegendText: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 10,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: width - 80,
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 8,
  },
  barAmounts: {
    marginTop: 4,
    alignItems: 'center',
  },
  barIncomeAmount: {
    fontSize: 9,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  barExpenseAmount: {
    fontSize: 9,
    color: '#FD79A8',
    fontWeight: '600',
    marginTop: 1,
  },
  chartBar: {
    width: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  rankingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  rankingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C5CE7',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankingNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankingNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
 rankingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rankingDetails: {
    flex: 1,
  },
  rankingCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 1,
  },
  rankingPercentage: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  rankingRight: {
    alignItems: 'flex-end',
  },
  rankingAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: -0.2,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  lineChartContainer: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  chartWithAxis: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  yAxisLabels: {
    width: 40,
    height: 120,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  yAxisText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
  },
  lineChart: {
    flex: 1,
    height: 120,
    position: 'relative',
    marginBottom: 15,
    marginLeft: 5,
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  lineChartContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  lineContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  incomePath: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  expensePath: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginTop: -4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  incomePoint: {
    backgroundColor: '#6C5CE7',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  expensePoint: {
    backgroundColor: '#FD79A8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  lineSegment: {
    position: 'absolute',
    height: 3,
    transformOrigin: 'left center',
    borderRadius: 1.5,
  },
  incomeLine: {
    backgroundColor: '#6C5CE7',
    opacity: 0.8,
  },
  expenseLine: {
    backgroundColor: '#FD79A8',
    opacity: 0.8,
  },
  valueLabels: {
    position: 'absolute',
    width: 1,
    height: '100%',
  },
  valueText: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: -20,
    width: 40,
  },
  incomeValue: {
    color: '#6C5CE7',
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
  },
  expenseValue: {
    color: '#FD79A8',
    backgroundColor: 'rgba(253, 121, 168, 0.1)',
  },
  xAxisLabels: {
    flexDirection: 'row',
    position: 'relative',
    height: 60,
  },
  xAxisLabel: {
    position: 'absolute',
    alignItems: 'center',
    width: 40,
    marginLeft: -20,
  },
  xAxisText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 9,
    color: '#6C5CE7',
    fontWeight: '600',
    marginBottom: 1,
  },
  expenseAmount: {
    fontSize: 9,
    color: '#FD79A8',
    fontWeight: '600',
  },
});

export default FinancialDashboardScreen;