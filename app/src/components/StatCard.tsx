import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {formatCurrency} from '@/utils';

interface StatCardProps {
  title: string;
  amount: number;
  icon?: string;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  showTrend?: boolean;
  trendValue?: number;
  trendDirection?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  icon,
  color = '#1C1C1E',
  backgroundColor = '#FFFFFF',
  onPress,
  style,
  showTrend = false,
  trendValue,
  trendDirection,
}) => {
  const getTrendColor = () => {
    if (!trendDirection) return '#8E8E93';
    return trendDirection === 'up' ? '#34C759' : '#FF3B30';
  };

  const getTrendIcon = () => {
    if (!trendDirection) return null;
    return trendDirection === 'up' ? 'trending-up' : 'trending-down';
  };

  const renderContent = () => (
    <View style={[styles.container, {backgroundColor}, style]}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          {icon && (
            <View style={[styles.iconContainer, {backgroundColor: color + '20'}]}>
              <Icon name={icon} size={20} color={color} />
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        
        {onPress && (
          <Icon name="chevron-right" size={16} color="#C7C7CC" />
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.amount, {color}]}>
          {formatCurrency(amount)}
        </Text>
        
        {showTrend && trendValue !== undefined && (
          <View style={styles.trendContainer}>
            {getTrendIcon() && (
              <Icon
                name={getTrendIcon()!}
                size={14}
                color={getTrendColor()}
                style={styles.trendIcon}
              />
            )}
            <Text style={[styles.trendText, {color: getTrendColor()}]}>
              {Math.abs(trendValue).toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendIcon: {
    marginRight: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatCard;