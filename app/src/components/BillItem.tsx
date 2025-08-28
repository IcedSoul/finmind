import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Bill} from '@/types';
import {formatCurrency, formatTime, getCategoryIcon, getCategoryColor} from '@/utils';

interface BillItemProps {
  bill: Bill;
  onPress?: (bill: Bill) => void;
  onEdit?: (bill: Bill) => void;
  onDelete?: (bill: Bill) => void;
  showActions?: boolean;
}

const BillItem: React.FC<BillItemProps> = ({
  bill,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这条账单记录吗？',
      [
        {text: '取消', style: 'cancel'},
        {
          text: '删除',
          style: 'destructive',
          onPress: () => onDelete?.(bill),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(bill)}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.categoryIcon,
              {backgroundColor: getCategoryColor(bill.category)},
            ]}>
            <Icon
              name={getCategoryIcon(bill.category)}
              size={20}
              color="#FFFFFF"
            />
          </View>
          
          <View style={styles.billInfo}>
            <Text style={styles.merchant} numberOfLines={1}>
              {bill.merchant}
            </Text>
            <Text style={styles.category}>{bill.category}</Text>
            {bill.description && (
              <Text style={styles.description} numberOfLines={1}>
                {bill.description}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text
            style={[
              styles.amount,
              bill.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
            ]}>
            {bill.type === 'income' ? '+' : '-'}{formatCurrency(bill.amount)}
          </Text>
          <Text style={styles.time}>{formatTime(bill.time)}</Text>
          {!bill.synced && (
            <View style={styles.syncIndicator}>
              <Icon name="wifi-off" size={12} color="#FF9500" />
            </View>
          )}
        </View>
      </View>
      
      {showActions && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit(bill)}>
              <Icon name="edit-2" size={16} color="#007AFF" />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}>
              <Icon name="trash-2" size={16} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  merchant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#C7C7CC',
  },
  rightSection: {
    alignItems: 'flex-end',
    position: 'relative',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  incomeAmount: {
    color: '#34C759',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  syncIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFF2E5',
    borderRadius: 8,
    padding: 2,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    borderRightWidth: 1,
    borderRightColor: '#F2F2F7',
  },
  deleteButton: {},
});

export default BillItem;