import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { RootState } from '@/types';
import { logout } from '@/store/slices/authSlice';
import { storage } from '@/utils';
import { useSyncStatus } from '@/hooks';
import { useGetBillsQuery } from '@/store/api/baseApi';

const SettingItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightComponent,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.settingLeft}>
      <View style={styles.settingIcon}>
        <Icon name={icon} size={20} color="#007AFF" />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.settingRight}>
      {rightComponent}
      {showArrow && onPress && (
        <Icon name="chevron-right" size={16} color="#C7C7CC" />
      )}
    </View>
  </TouchableOpacity>
);

const SettingSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.settingSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: billsResponse } = useGetBillsQuery({});
  const bills = billsResponse?.items || [];
  const { isSyncing, pendingChanges, startSync } = useSyncStatus();

  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(logout() as any);
    setShowLogoutModal(false);
  };

  const handleClearData = () => {
    setShowClearDataModal(true);
  };

  const confirmClearData = async () => {
    try {
      // 清除本地数据
      await storage.clear();
      // 这里应该调用清除账单数据的 action
      // dispatch(clearBills());
      Alert.alert('成功', '本地数据已清除');
    } catch (error) {
      Alert.alert('错误', '清除数据失败');
    }
    setShowClearDataModal(false);
  };

  const handleExportData = () => {
    // 这里应该实现数据导出功能
    Alert.alert('提示', '数据导出功能开发中');
  };

  const handleImportData = () => {
    navigation.navigate('Import' as never);
  };

  const handleAbout = () => {
    Alert.alert(
      'FinMind 全记账',
      'Version 1.0.0\n\n一款智能的个人记账应用，支持AI识别、数据同步等功能。\n\n© 2024 FinMind Team',
      [{ text: '确定' }],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>设置</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SettingSection title="用户信息">
          <SettingItem
            icon="user"
            title={user?.name || '未登录'}
            subtitle={user?.email}
            onPress={() => navigation.navigate('Profile' as never)}
          />
        </SettingSection>

        <SettingSection title="数据同步">
          <SettingItem
            icon="cloud"
            title="同步状态"
            subtitle={`${pendingChanges} 条记录待同步`}
            onPress={startSync}
            rightComponent={
              isSyncing ? (
                <Text style={styles.syncingText}>同步中...</Text>
              ) : (
                <Text style={styles.syncText}>立即同步</Text>
              )
            }
          />
          <SettingItem
            icon="refresh-cw"
            title="自动同步"
            subtitle="连接WiFi时自动同步数据"
            showArrow={false}
            rightComponent={
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingSection>

        <SettingSection title="应用设置">
          <SettingItem
            icon="bell"
            title="推送通知"
            subtitle="接收账单提醒和同步通知"
            showArrow={false}
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingItem
            icon="shield"
            title="生物识别"
            subtitle="使用指纹或面容ID解锁"
            showArrow={false}
            rightComponent={
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingSection>

        <SettingSection title="数据管理">
          <SettingItem
            icon="download"
            title="导入数据"
            subtitle="从文件导入账单数据"
            onPress={handleImportData}
          />
          <SettingItem
            icon="upload"
            title="导出数据"
            subtitle="导出账单数据到文件"
            onPress={handleExportData}
          />
          <SettingItem
            icon="trash-2"
            title="清除本地数据"
            subtitle={`当前有 ${bills.length} 条记录`}
            onPress={handleClearData}
          />
        </SettingSection>

        <SettingSection title="其他">
          <SettingItem
            icon="help-circle"
            title="帮助与反馈"
            onPress={() => Alert.alert('提示', '帮助功能开发中')}
          />
          <SettingItem icon="info" title="关于应用" onPress={handleAbout} />
        </SettingSection>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>退出登录</Text>
            <Text style={styles.modalMessage}>
              确定要退出登录吗？未同步的数据可能会丢失。
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmButtonText}>退出</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showClearDataModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearDataModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>清除本地数据</Text>
            <Text style={styles.modalMessage}>
              此操作将删除所有本地账单数据，且无法恢复。确定继续吗？
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowClearDataModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.dangerButton]}
                onPress={confirmClearData}
              >
                <Text style={styles.dangerButtonText}>清除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
  },
  settingSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    marginHorizontal: 20,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 8,
  },
  syncingText: {
    fontSize: 14,
    color: '#FF9500',
    marginRight: 8,
  },
  logoutSection: {
    margin: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default SettingsScreen;
