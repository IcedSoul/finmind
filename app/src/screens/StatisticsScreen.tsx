import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const StatisticsScreen = () => {
  const { t } = useTranslation();
  const monthlyData = [
    { month: t('statistics.months.march'), income: 15000000, expense: 8000000 },
    { month: t('statistics.months.april'), income: 18000000, expense: 12000000 },
    { month: t('statistics.months.may'), income: 20000000, expense: 15000000 },
    { month: t('statistics.months.june'), income: 22000000, expense: 18000000 },
  ];

  const categories = [
    { name: t('statistics.categories.food'), amount: 5000000, color: '#FF6B6B' },
    { name: t('statistics.categories.transport'), amount: 3000000, color: '#4ECDC4' },
    { name: t('statistics.categories.shopping'), amount: 4000000, color: '#45B7D1' },
    { name: t('statistics.categories.entertainment'), amount: 2000000, color: '#96CEB4' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' ' + t('common.currency');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('statistics.title')}</Text>
        
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>{t('statistics.thisMonthSummary')}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('statistics.income')}</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                {formatCurrency(22000000)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('statistics.expense')}</Text>
              <Text style={[styles.summaryValue, { color: '#F44336' }]}>
                {formatCurrency(18000000)}
              </Text>
            </View>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>{t('statistics.balance')}</Text>
            <Text style={[styles.balanceValue, { color: '#4CAF50' }]}>
              {formatCurrency(4000000)}
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>{t('statistics.monthlyChart')}</Text>
          <View style={styles.chartContainer}>
            {monthlyData.map((item, index) => {
              const maxAmount = Math.max(...monthlyData.map(d => Math.max(d.income, d.expense)));
              const incomeHeight = (item.income / maxAmount) * 120;
              const expenseHeight = (item.expense / maxAmount) * 120;
              
              return (
                <View key={index} style={styles.chartItem}>
                  <View style={styles.bars}>
                    <View style={[styles.bar, { height: incomeHeight, backgroundColor: '#4CAF50' }]} />
                    <View style={[styles.bar, { height: expenseHeight, backgroundColor: '#F44336' }]} />
                  </View>
                  <Text style={styles.monthLabel}>{item.month}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>{t('statistics.income')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>{t('statistics.expense')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.categoriesCard}>
          <Text style={styles.cardTitle}>{t('statistics.expenseCategories')}</Text>
          {categories.map((category, index) => {
            const totalExpense = categories.reduce((sum, cat) => sum + cat.amount, 0);
            const percentage = (category.amount / totalExpense) * 100;
            
            return (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.categoryAmount}>
                  <Text style={styles.categoryValue}>{formatCurrency(category.amount)}</Text>
                  <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'System',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'right',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 16,
  },
  chartItem: {
    alignItems: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 12,
    marginHorizontal: 2,
    borderRadius: 6,
  },
  monthLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  categoriesCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#2C3E50',
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
});

export default StatisticsScreen;
