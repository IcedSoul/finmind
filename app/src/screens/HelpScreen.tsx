import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const HelpScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqData = [
    {
      question: t('help.faq.addExpense.question'),
      answer: t('help.faq.addExpense.answer'),
    },
    {
      question: t('help.faq.createCategory.question'),
      answer: t('help.faq.createCategory.answer'),
    },
    {
      question: t('help.faq.monthlyReport.question'),
      answer: t('help.faq.monthlyReport.answer'),
    },
    {
      question: t('help.faq.backup.question'),
      answer: t('help.faq.backup.answer'),
    },
    {
      question: t('help.faq.changePassword.question'),
      answer: t('help.faq.changePassword.answer'),
    },
    {
      question: t('help.faq.notifications.question'),
      answer: t('help.faq.notifications.answer'),
    },
  ];

  const contactOptions = [
    {
      title: t('help.contact.email.title'),
      description: 'support@finmind.ir',
      icon: 'mail-outline',
      action: () => Linking.openURL('mailto:support@finmind.ir'),
    },
    {
      title: t('help.contact.telegram.title'),
      description: '@finmind_support',
      icon: 'send-outline',
      action: () => Linking.openURL('https://t.me/finmind_support'),
    },
    {
      title: t('help.contact.phone.title'),
      description: '021-12345678',
      icon: 'call-outline',
      action: () => Linking.openURL('tel:02112345678'),
    },
    {
      title: t('help.contact.website.title'),
      description: 'www.finmind.ir',
      icon: 'globe-outline',
      action: () => Linking.openURL('https://www.finmind.ir'),
    },
  ];

  const quickActions = [
    {
      title: t('help.quickActions.gettingStarted.title'),
      description: t('help.quickActions.gettingStarted.description'),
      icon: 'play-circle-outline',
      color: '#6C5CE7',
    },
    {
      title: t('help.quickActions.tutorials.title'),
      description: t('help.quickActions.tutorials.description'),
      icon: 'videocam-outline',
      color: '#FF9500',
    },
    {
      title: t('help.quickActions.reportBug.title'),
      description: t('help.quickActions.reportBug.description'),
      icon: 'bug-outline',
      color: '#FF3B30',
    },
    {
      title: t('help.quickActions.suggestFeature.title'),
      description: t('help.quickActions.suggestFeature.description'),
      icon: 'bulb-outline',
      color: '#34C759',
    },
  ];

  const filteredFAQ = faqData.filter(item =>
    item.question.includes(searchQuery) || item.answer.includes(searchQuery)
  );

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
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
        <Text style={styles.headerTitle}>{t('help.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('help.searchPlaceholder')}
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('help.quickAccess')}</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickActionItem}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                <Icon name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionDescription}>
                {action.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('help.faq.title')}</Text>
        </View>

        {filteredFAQ.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => toggleFAQ(index)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Icon
                name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#8E8E93"
              />
            </View>
            {expandedFAQ === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('help.contactSupport')}</Text>
          <Text style={styles.sectionDescription}>
            {t('help.contactDescription')}
          </Text>
        </View>

        {contactOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactItem}
            onPress={option.action}
          >
            <View style={styles.contactLeft}>
              <View style={styles.contactIconContainer}>
                <Icon name={option.icon} size={20} color="#6C5CE7" />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactDescription}>
                  {option.description}
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <View style={styles.supportCard}>
            <Icon name="headset-outline" size={24} color="#6C5CE7" />
            <Text style={styles.supportCardTitle}>{t('help.support247.title')}</Text>
            <Text style={styles.supportCardDescription}>
              {t('help.support247.description')}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 12,
    fontFamily: 'IRANSans',
    textAlignVertical: 'center',
    includeFontPadding: false,
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
  sectionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    fontFamily: 'IRANSans',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: '#F8F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginRight: '2%',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'IRANSans',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'IRANSans',
  },
  faqItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
    fontFamily: 'IRANSans',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginTop: 12,
    fontFamily: 'IRANSans',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'IRANSans',
  },
  contactDescription: {
    fontSize: 14,
    color: '#6C5CE7',
    fontFamily: 'IRANSans',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  supportCard: {
    backgroundColor: '#F8F9FF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  supportCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'IRANSans',
  },
  supportCardDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'IRANSans',
  },
});

export default HelpScreen;