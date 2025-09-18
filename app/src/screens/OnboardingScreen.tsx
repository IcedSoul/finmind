import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: t('onboarding.welcome.title'),
      subtitle: t('onboarding.welcome.subtitle'),
      description: t('onboarding.welcome.description'),
    },
    {
      title: t('onboarding.transactions.title'),
      subtitle: t('onboarding.transactions.subtitle'),
      description: t('onboarding.transactions.description'),
    },
    {
      title: t('onboarding.reports.title'),
      subtitle: t('onboarding.reports.subtitle'),
      description: t('onboarding.reports.description'),
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('Main' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Main' as never);
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingSteps.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  const renderIllustration = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.welcomeIcon}>
              <Icon name="dollar-sign" size={60} color="#6C5CE7" />
            </View>
            <View style={styles.decorativeElements}>
              <View style={[styles.decorativeCircle, { top: 20, left: 30 }]} />
              <View style={[styles.decorativeCircle, { bottom: 40, right: 20 }]} />
              <View style={[styles.decorativeSquare, { top: 60, right: 40 }]} />
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.transactionIcon}>
              <Icon name="credit-card" size={60} color="#00B894" />
            </View>
            <View style={styles.transactionElements}>
              <View style={styles.transactionCard} />
              <View style={[styles.transactionCard, { marginTop: 10, opacity: 0.7 }]} />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.chartIcon}>
              <Icon name="bar-chart-2" size={60} color="#FDCB6E" />
            </View>
            <View style={styles.chartElements}>
              <View style={styles.chartBars}>
                <View style={[styles.chartBar, { height: 30 }]} />
                <View style={[styles.chartBar, { height: 50 }]} />
                <View style={[styles.chartBar, { height: 25 }]} />
                <View style={[styles.chartBar, { height: 40 }]} />
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderIllustration()}

        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
          <Text style={styles.description}>{currentStepData.description}</Text>
        </View>

        {renderDots()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? t('onboarding.start') : t('onboarding.next')}
          </Text>
          <Icon name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.homeIndicator} />
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
  skipText: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  illustrationContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  welcomeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  transactionIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00B894',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  chartIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FDCB6E',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DDA0DD',
    opacity: 0.6,
  },
  decorativeSquare: {
    position: 'absolute',
    width: 15,
    height: 15,
    backgroundColor: '#98D8C8',
    opacity: 0.6,
    transform: [{ rotate: '45deg' }],
  },
  transactionElements: {
    position: 'absolute',
    top: 200,
    alignItems: 'center',
  },
  transactionCard: {
    width: 200,
    height: 30,
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  chartElements: {
    position: 'absolute',
    top: 200,
    alignItems: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: 100,
  },
  chartBar: {
    width: 15,
    backgroundColor: '#FDCB6E',
    borderRadius: 4,
    marginHorizontal: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#DDD',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#2D3436',
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default OnboardingScreen;