import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const SecurityScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [securitySettings, setSecuritySettings] = useState({
    biometricLogin: true,
    pinCode: false,
    autoLock: true,
    loginNotifications: true,
    twoFactorAuth: false,
  });

  const toggleSetting = (key: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleChangePassword = () => {
    Alert.alert(
      t('security.changePassword'),
      t('security.changePasswordDescription'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('security.continue'), onPress: () => console.log('Navigate to change password') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('security.deleteAccount'),
      t('security.deleteAccountConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('security.delete'),
          style: 'destructive',
          onPress: () => console.log('Delete account'),
        },
      ]
    );
  };

  const securityOptions = [
    {
      key: 'biometricLogin',
      title: t('security.biometricLogin'),
      description: t('security.biometricLoginDescription'),
      icon: 'finger-print-outline',
      type: 'switch',
    },
    {
      key: 'pinCode',
      title: t('security.pinCode'),
      description: t('security.pinCodeDescription'),
      icon: 'keypad-outline',
      type: 'switch',
    },
    {
      key: 'autoLock',
      title: t('security.autoLock'),
      description: t('security.autoLockDescription'),
      icon: 'lock-closed-outline',
      type: 'switch',
    },
    {
      key: 'loginNotifications',
      title: t('security.loginNotifications'),
      description: t('security.loginNotificationsDescription'),
      icon: 'notifications-outline',
      type: 'switch',
    },
    {
      key: 'twoFactorAuth',
      title: t('security.twoFactorAuth'),
      description: t('security.twoFactorAuthDescription'),
      icon: 'shield-checkmark-outline',
      type: 'switch',
    },
  ];

  const actionItems = [
    {
      title: t('security.changePassword'),
      description: t('security.changePasswordAccountDescription'),
      icon: 'key-outline',
      action: handleChangePassword,
      color: '#6C5CE7',
    },
    {
      title: t('security.connectedDevices'),
      description: t('security.connectedDevicesDescription'),
      icon: 'phone-portrait-outline',
      action: () => console.log('Show connected devices'),
      color: '#6C5CE7',
    },
    {
      title: t('security.loginHistory'),
      description: t('security.loginHistoryDescription'),
      icon: 'time-outline',
      action: () => console.log('Show login history'),
      color: '#6C5CE7',
    },
    {
      title: t('security.deleteAccount'),
      description: t('security.deleteAccountDescription'),
      icon: 'trash-outline',
      action: handleDeleteAccount,
      color: '#FF3B30',
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
        <Text style={styles.headerTitle}>{t('security.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('security.securitySettings')}</Text>
          <Text style={styles.sectionDescription}>
            {t('security.securitySettingsDescription')}
          </Text>
        </View>

        {securityOptions.map((option, index) => (
          <View key={option.key} style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Icon name={option.icon} size={20} color="#6C5CE7" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Text style={styles.settingDescription}>
                  {option.description}
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings[option.key as keyof typeof securitySettings]}
              onValueChange={() => toggleSetting(option.key)}
              trackColor={{ false: '#E5E5EA', true: '#6C5CE7' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('security.accountManagement')}</Text>
        </View>

        {actionItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={item.action}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: item.color === '#FF3B30' ? '#FFE5E5' : '#F8F9FF' }]}>
                <Icon name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={[styles.actionTitle, { color: item.color }]}>
                  {item.title}
                </Text>
                <Text style={styles.actionDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <View style={styles.securityTip}>
            <Icon name="information-circle-outline" size={20} color="#6C5CE7" />
            <Text style={styles.securityTipText}>
              {t('security.securityTip')}
            </Text>
          </View>
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: 'IRANSans',
  },
  actionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
    fontFamily: 'IRANSans',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  securityTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FF',
    padding: 16,
    borderRadius: 12,
  },
  securityTipText: {
    fontSize: 14,
    color: '#6C5CE7',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
    fontFamily: 'IRANSans',
  },
});

export default SecurityScreen;