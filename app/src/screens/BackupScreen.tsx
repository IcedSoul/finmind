import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const BackupScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [autoBackup, setAutoBackup] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [lastBackup, setLastBackup] = useState('1403/10/15 - 14:30');

  const handleManualBackup = () => {
    Alert.alert(
      t('backup.manualBackup.title'),
      t('backup.manualBackup.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.start'),
          onPress: () => {
            console.log('Starting manual backup');
            setLastBackup(new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }));
            Alert.alert(t('common.success'), t('backup.manualBackup.successMessage'));
          },
        },
      ]
    );
  };

  const handleRestoreBackup = () => {
    Alert.alert(
      t('backup.restore.title'),
      t('backup.restore.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.start'),
          style: 'destructive',
          onPress: () => {
            console.log('Restoring backup');
            Alert.alert(t('common.success'), t('backup.restore.successMessage'));
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      t('backup.export.title'),
      t('backup.export.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: 'Excel', onPress: () => console.log('Export to Excel') },
        { text: 'PDF', onPress: () => console.log('Export to PDF') },
        { text: 'CSV', onPress: () => console.log('Export to CSV') },
      ]
    );
  };

  const backupOptions = [
    {
      title: t('backup.options.autoBackup.title'),
      description: t('backup.options.autoBackup.description'),
      icon: 'refresh-outline',
      value: autoBackup,
      onToggle: setAutoBackup,
      type: 'switch',
    },
    {
      title: t('backup.options.cloudSync.title'),
      description: t('backup.options.cloudSync.description'),
      icon: 'cloud-outline',
      value: cloudSync,
      onToggle: setCloudSync,
      type: 'switch',
    },
  ];

  const actionItems = [
    {
      title: t('backup.actions.manualBackup.title'),
      description: t('backup.actions.manualBackup.description'),
      icon: 'download-outline',
      action: handleManualBackup,
      color: '#6C5CE7',
    },
    {
      title: t('backup.actions.restore.title'),
      description: t('backup.actions.restore.description'),
      icon: 'refresh-circle-outline',
      action: handleRestoreBackup,
      color: '#34C759',
    },
    {
      title: t('backup.actions.export.title'),
      description: t('backup.actions.export.description'),
      icon: 'share-outline',
      action: handleExportData,
      color: '#FF9500',
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
        <Text style={styles.headerTitle}>{t('backup.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="shield-checkmark" size={24} color="#34C759" />
            <Text style={styles.statusTitle}>{t('backup.status.title')}</Text>
          </View>
          <Text style={styles.statusDescription}>
            {t('backup.status.lastBackup')}: {lastBackup}
          </Text>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{t('backup.status.secure')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('backup.settings.title')}</Text>
        </View>

        {backupOptions.map((option, index) => (
          <View key={index} style={styles.settingItem}>
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
              value={option.value}
              onValueChange={option.onToggle}
              trackColor={{ false: '#E5E5EA', true: '#6C5CE7' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('backup.operations.title')}</Text>
        </View>

        {actionItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={item.action}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                <Icon name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>
        ))}

        <View style={styles.storageInfo}>
          <Text style={styles.storageTitle}>{t('backup.storage.title')}</Text>
          <View style={styles.storageBar}>
            <View style={styles.storageUsed} />
          </View>
          <View style={styles.storageDetails}>
            <Text style={styles.storageText}>{t('backup.storage.used')}: 2.3 {t('backup.storage.mb')}</Text>
            <Text style={styles.storageText}>{t('backup.storage.remaining')}: 97.7 {t('backup.storage.mb')}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoCard}>
            <Icon name="information-circle-outline" size={20} color="#6C5CE7" />
            <Text style={styles.infoText}>
              {t('backup.info.description')}
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
  statusCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F8F9FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E9FF',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 12,
    fontFamily: 'IRANSans',
  },
  statusDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    fontFamily: 'IRANSans',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
    fontFamily: 'IRANSans',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
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
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'IRANSans',
  },
  actionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
    fontFamily: 'IRANSans',
  },
  storageInfo: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F8F9FF',
    borderRadius: 16,
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    fontFamily: 'IRANSans',
  },
  storageBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 12,
  },
  storageUsed: {
    height: '100%',
    width: '23%',
    backgroundColor: '#6C5CE7',
    borderRadius: 4,
  },
  storageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storageText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'IRANSans',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FF',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6C5CE7',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
    fontFamily: 'IRANSans',
  },
});

export default BackupScreen;