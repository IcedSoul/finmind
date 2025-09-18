import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      title: t('welcome.step1.title'),
      subtitle: t('welcome.step1.subtitle'),
      description: t('welcome.step1.description'),
      icon: '💰',
    },
    {
      title: t('welcome.step2.title'),
      subtitle: t('welcome.step2.subtitle'),
      description: t('welcome.step2.description'),
      icon: '📊',
    },
    {
      title: t('welcome.step3.title'),
      subtitle: t('welcome.step3.subtitle'),
      description: t('welcome.step3.description'),
      icon: '📈',
    },
    {
      title: t('welcome.step4.title'),
      subtitle: t('welcome.step4.subtitle'),
      description: t('welcome.step4.description'),
      icon: '🎯',
    },
  ];

  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('Register' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Register' as never);
  };

  const currentStepData = welcomeSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>{t('welcome.skip')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{currentStepData.icon}</Text>
        </View>

        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
        <Text style={styles.description}>{currentStepData.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {welcomeSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentStep === welcomeSteps.length - 1 ? t('welcome.getStarted') : t('welcome.next')}
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'IRANSans',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'IRANSans',
  },
  subtitle: {
    fontSize: 18,
    color: '#6C5CE7',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'IRANSans',
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'IRANSans',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#6C5CE7',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#E5E5EA',
  },
  nextButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'IRANSans',
  },
});

export default WelcomeScreen;