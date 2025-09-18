import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const AboutScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const appInfo = {
    version: '1.2.3',
    buildNumber: '2024.01.15',
    releaseDate: t('about.releaseDate'),
  };

  const teamMembers = [
    {
      name: t('about.teamMember1Name'),
      role: t('about.teamMember1Role'),
      avatar: '👨‍💻',
    },
    {
      name: t('about.teamMember2Name'),
      role: t('about.teamMember2Role'),
      avatar: '👩‍🎨',
    },
    {
      name: t('about.teamMember3Name'),
      role: t('about.teamMember3Role'),
      avatar: '👨‍💼',
    },
  ];

  const socialLinks = [
    {
      name: t('about.website'),
      icon: 'globe-outline',
      url: 'https://www.finmind.ir',
      color: '#6C5CE7',
    },
    {
      name: t('about.telegram'),
      icon: 'send-outline',
      url: 'https://t.me/finmind_official',
      color: '#0088CC',
    },
    {
      name: t('about.instagram'),
      icon: 'logo-instagram',
      url: 'https://instagram.com/finmind.ir',
      color: '#E4405F',
    },
    {
      name: t('about.linkedin'),
      icon: 'logo-linkedin',
      url: 'https://linkedin.com/company/finmind',
      color: '#0077B5',
    },
  ];

  const legalLinks = [
    {
      title: t('about.termsOfService'),
      description: t('about.termsOfServiceDescription'),
      icon: 'document-text-outline',
      action: () => Linking.openURL('https://www.finmind.ir/terms'),
    },
    {
      title: t('about.privacyPolicy'),
      description: t('about.privacyPolicyDescription'),
      icon: 'shield-outline',
      action: () => Linking.openURL('https://www.finmind.ir/privacy'),
    },
    {
      title: t('about.softwareLicenses'),
      description: t('about.softwareLicensesDescription'),
      icon: 'code-outline',
      action: () => console.log('Show licenses'),
    },
  ];

  const handleRateApp = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.finmind.app');
  };

  const handleShareApp = () => {
    console.log('Share app');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('about.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.appInfoCard}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>💰</Text>
          </View>
          <Text style={styles.appName}>{t('about.appName')}</Text>
          <Text style={styles.appSlogan}>{t('about.appSlogan')}</Text>
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>{t('about.version')} {appInfo.version}</Text>
            <Text style={styles.buildText}>{t('about.build')} {appInfo.buildNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.aboutApp')}</Text>
          <Text style={styles.aboutText}>
            {t('about.aboutText1')}
          </Text>
          <Text style={styles.aboutText}>
            {t('about.aboutText2')}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleRateApp}>
            <Icon name="star-outline" size={20} color="#6C5CE7" />
            <Text style={styles.actionButtonText}>{t('about.rateApp')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareApp}>
            <Icon name="share-outline" size={20} color="#6C5CE7" />
            <Text style={styles.actionButtonText}>{t('about.shareApp')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.developmentTeam')}</Text>
        </View>

        {teamMembers.map((member, index) => (
          <View key={index} style={styles.teamMember}>
            <Text style={styles.memberAvatar}>{member.avatar}</Text>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.socialNetworks')}</Text>
        </View>

        <View style={styles.socialLinksGrid}>
          {socialLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.socialLink}
              onPress={() => Linking.openURL(link.url)}
            >
              <Icon name={link.icon} size={24} color={link.color} />
              <Text style={styles.socialLinkText}>{link.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.legalTerms')}</Text>
        </View>

        {legalLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.legalItem}
            onPress={link.action}
          >
            <View style={styles.legalLeft}>
              <View style={styles.legalIconContainer}>
                <Icon name={link.icon} size={20} color="#6C5CE7" />
              </View>
              <View style={styles.legalText}>
                <Text style={styles.legalTitle}>{link.title}</Text>
                <Text style={styles.legalDescription}>
                  {link.description}
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Text style={styles.copyrightText}>
            {t('about.copyright')}
          </Text>
          <Text style={styles.releaseText}>
            {t('about.releaseDate')}: {appInfo.releaseDate}
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
  appInfoCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FF',
    margin: 20,
    borderRadius: 20,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appIconText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'IRANSans',
  },
  appSlogan: {
    fontSize: 16,
    color: '#6C5CE7',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'IRANSans',
  },
  versionInfo: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'IRANSans',
  },
  buildText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
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
    marginBottom: 8,
    fontFamily: 'IRANSans',
  },
  aboutText: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'IRANSans',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FF',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#6C5CE7',
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'IRANSans',
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  memberAvatar: {
    fontSize: 32,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'IRANSans',
  },
  memberRole: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'IRANSans',
  },
  socialLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  socialLink: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginRight: '2%',
  },
  socialLinkText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    marginLeft: 12,
    fontFamily: 'IRANSans',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  legalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  legalText: {
    flex: 1,
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'IRANSans',
  },
  legalDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
    fontFamily: 'IRANSans',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  copyrightText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'IRANSans',
  },
  releaseText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    fontFamily: 'IRANSans',
  },
});

export default AboutScreen;