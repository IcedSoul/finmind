import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/authStore';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { theme, themeMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const isDarkMode = themeMode === 'dark';
  const styles = createStyles(theme);

  const handleLanguageChange = async () => {
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    await i18n.changeLanguage(newLanguage);
    await AsyncStorage.setItem('language', newLanguage);
    setCurrentLanguage(newLanguage);
  };

  const getLanguageDisplayName = () => {
    return currentLanguage === 'zh' ? '中文' : 'English';
  };

  const settingsData = [
    {
      title: t('settings.account'),
      items: [
        {
          icon: 'user',
          title: t('settings.personalProfile'),
          subtitle: t('settings.editPersonalInfo'),
          onPress: () => navigation.navigate('Profile'),
        },
        {
          icon: 'credit-card',
          title: t('settings.bankAccounts'),
          subtitle: t('settings.manageBankAccounts'),
          onPress: () => {},
        },
        {
          icon: 'shield',
          title: t('settings.security'),
          subtitle: t('settings.securitySettings'),
          onPress: () => navigation.navigate('Security'),
        },
      ],
    },
    {
      title: t('settings.general'),
      items: [
        {
          icon: 'bell',
          title: t('settings.notifications'),
          subtitle: t('settings.receiveImportantNotifications'),
          onPress: () => navigation.navigate('Notifications'),
        },
        {
          icon: 'moon',
          title: t('settings.darkMode'),
          subtitle: t('settings.enableDarkTheme'),
          onPress: toggleTheme,
          showSwitch: true,
          switchValue: isDarkMode,
        },
        {
          icon: 'lock',
          title: t('settings.biometricAuth'),
          subtitle: t('settings.fingerprintLogin'),
          onPress: () => setBiometric(!biometric),
          showSwitch: true,
          switchValue: biometric,
        },
        {
          icon: 'globe',
          title: t('settings.language'),
          subtitle: getLanguageDisplayName(),
          onPress: handleLanguageChange,
        },
        {
          icon: 'dollar-sign',
          title: t('settings.currency'),
          subtitle: t('settings.usd'),
          onPress: () => {},
        },
      ],
    },
    {
      title: t('settings.backupSync'),
      items: [
        {
          icon: 'cloud',
          title: t('settings.autoBackup'),
          subtitle: t('settings.saveToCloud'),
          onPress: () => setAutoBackup(!autoBackup),
          showSwitch: true,
          switchValue: autoBackup,
        },
        {
          icon: 'database',
          title: t('settings.backupManagement'),
          subtitle: t('settings.backupSettings'),
          onPress: () => navigation.navigate('Backup'),
        },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        {
          icon: 'help-circle',
          title: t('settings.help'),
          subtitle: t('settings.howToUseApp'),
          onPress: () => navigation.navigate('Help'),
        },
        {
          icon: 'message-circle',
          title: t('settings.contactSupport'),
          subtitle: t('settings.sendMessageToSupport'),
          onPress: () => {},
        },
        {
          icon: 'star',
          title: t('settings.rateApp'),
          subtitle: t('settings.yourOpinionMatters'),
          onPress: () => {},
        },
        {
          icon: 'info',
          title: t('settings.aboutApp'),
          subtitle: t('settings.version'),
          onPress: () => navigation.navigate('About'),
        },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutConfirmation'),
      [
        {
          text: t('settings.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: () => {
            useAuthStore.getState().logout();
          },
        },
      ]
    );
  };

  const renderSettingItem = (item: any) => {
    return (
      <TouchableOpacity
        key={item.title}
        style={styles.settingItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <Icon name={item.icon} size={20} color="#6C5CE7" />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <View style={styles.settingRight}>
          {item.showSwitch && (
            <Switch
              value={item.switchValue}
              onValueChange={item.onPress}
              trackColor={{ false: '#E9ECEF', true: '#6C5CE7' }}
              thumbColor={item.switchValue ? '#FFFFFF' : '#FFFFFF'}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      <LinearGradient
        colors={['#6C5CE7', '#A29BFE']}
        style={styles.headerGradient}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Icon name="user" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{t('settings.userName')}</Text>
            <Text style={styles.profileEmail}>{t('settings.userEmail')}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickMenuContainer}>
          <View style={styles.quickMenuRow}>
            <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('Profile')}>
              <View style={styles.quickMenuIcon}>
                <Icon name="user" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.quickMenuText}>{t('settings.personalProfile')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('BankAccounts')}>
              <View style={styles.quickMenuIcon}>
                <Icon name="credit-card" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.quickMenuText}>{t('settings.bankAccounts')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('Security')}>
              <View style={styles.quickMenuIcon}>
                <Icon name="shield" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.quickMenuText}>{t('settings.security')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('Notifications')}>
              <View style={styles.quickMenuIcon}>
                <Icon name="bell" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.quickMenuText}>{t('settings.notifications')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickMenuRow}>
            <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('Language')}>
              <View style={styles.quickMenuIcon}>
                <Icon name="globe" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.quickMenuText}>{t('settings.language')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('Currency')}>
              <View style={styles.quickMenuIcon}>
                <Icon name="dollar-sign" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.quickMenuText}>{t('settings.currency')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('Backup')}>
              <View style={styles.quickMenuIcon}>
                <Icon name="cloud" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.quickMenuText}>{t('backup.title')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickMenuItem} onPress={() => navigation.navigate('Help')}>
              <View style={styles.quickMenuIcon}>
                <Icon name="help-circle" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.quickMenuText}>{t('settings.help')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {settingsData.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <View style={styles.separator} />
                  {renderSettingItem(item)}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="#E17055" />
          <Text style={styles.logoutText}>{t('settings.logout')}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('settings.version')}</Text>
          <Text style={styles.footerText}>{t('settings.copyright')}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    opacity: 0.8,
  },
  sectionContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  settingInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
    textAlign: 'left',
  },
  settingSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'left',
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 54,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E17055',
    marginLeft: 6,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  quickMenuContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickMenuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickMenuItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 6,
    marginHorizontal: 2,
  },
  quickMenuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickMenuText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default SettingsScreen;
