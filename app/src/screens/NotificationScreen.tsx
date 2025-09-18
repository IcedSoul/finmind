import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    billReminders: true,
    budgetAlerts: false,
    weeklyReports: true,
    monthlyReports: true,
    goalUpdates: true,
    securityAlerts: true,
    promotions: false,
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const notificationSettings = [
    {
      key: 'pushNotifications',
      title: t('notifications.general.push_notifications.title'),
      description: t('notifications.general.push_notifications.description'),
      icon: 'notifications-outline',
    },
    {
      key: 'billReminders',
      title: t('notifications.general.bill_reminders.title'),
      description: t('notifications.general.bill_reminders.description'),
      icon: 'receipt-outline',
    },
    {
      key: 'budgetAlerts',
      title: t('notifications.general.budget_alerts.title'),
      description: t('notifications.general.budget_alerts.description'),
      icon: 'warning-outline',
    },
    {
      key: 'weeklyReports',
      title: t('notifications.timing.weekly_reports.title'),
      description: t('notifications.timing.weekly_reports.description'),
      icon: 'calendar-outline',
    },
    {
      key: 'monthlyReports',
      title: t('notifications.timing.monthly_reports.title'),
      description: t('notifications.timing.monthly_reports.description'),
      icon: 'stats-chart-outline',
    },
    {
      key: 'goalUpdates',
      title: t('notifications.general.goal_updates.title'),
      description: t('notifications.general.goal_updates.description'),
      icon: 'flag-outline',
    },
    {
      key: 'securityAlerts',
      title: t('notifications.general.security_alerts.title'),
      description: t('notifications.general.security_alerts.description'),
      icon: 'shield-checkmark-outline',
    },
    {
      key: 'promotions',
      title: t('notifications.general.promotions.title'),
      description: t('notifications.general.promotions.description'),
      icon: 'gift-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications.general.title')}</Text>
          <Text style={styles.sectionDescription}>
            {t('notifications.general.description')}
          </Text>
        </View>

        {notificationSettings.map((setting, index) => (
          <View key={setting.key} style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Icon name={setting.icon} size={20} color="#6C5CE7" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>
                  {setting.description}
                </Text>
              </View>
            </View>
            <Switch
              value={notifications[setting.key as keyof typeof notifications]}
              onValueChange={() => toggleNotification(setting.key)}
              trackColor={{ false: '#E5E5EA', true: '#6C5CE7' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications.timing.title')}</Text>
          <TouchableOpacity style={styles.timeSettingItem}>
            <View style={styles.timeSettingLeft}>
              <Icon name="time-outline" size={20} color="#6C5CE7" />
              <Text style={styles.timeSettingText}>{t('notifications.timing.dailyReport')}</Text>
            </View>
            <View style={styles.timeSettingRight}>
              <Text style={styles.timeValue}>20:00</Text>
              <Icon name="chevron-forward" size={16} color="#8E8E93" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.timeSettingItem}>
            <View style={styles.timeSettingLeft}>
              <Icon name="calendar-outline" size={20} color="#6C5CE7" />
              <Text style={styles.timeSettingText}>{t('notifications.timing.weeklyReport')}</Text>
            </View>
            <View style={styles.timeSettingRight}>
              <Text style={styles.timeValue}>{t('notifications.timing.sunday')}</Text>
              <Icon name="chevron-forward" size={16} color="#8E8E93" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('notifications.general.description')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'IRANSans',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'IRANSans',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    fontFamily: 'IRANSans',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'IRANSans',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
    fontFamily: 'IRANSans',
  },
  timeSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  timeSettingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeSettingText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 12,
    fontFamily: 'IRANSans',
  },
  timeSettingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 16,
    color: '#6C5CE7',
    marginRight: 8,
    fontFamily: 'IRANSans',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'IRANSans',
  },
});

export default NotificationScreen;