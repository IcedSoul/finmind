import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeIntroScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleRegister = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      


      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>FinMind</Text>
        </View>

        <Text style={styles.welcomeTitle}>{t('welcome.intro.title')}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={['#B990F8', '#9B94F3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.primaryButtonText}>{t('welcome.intro.haveAccount')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRegister}
          >
            <Text style={styles.secondaryButtonText}>{t('welcome.intro.createAccount')}</Text>
          </TouchableOpacity>
        </View>
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 214,
    height: 122,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#7269D6',
    fontFamily: 'Inter',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7269D6',
    textAlign: 'center',
    marginBottom: 100,
    fontFamily: 'Shabnam',
    letterSpacing: -0.4,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Shabnam',
  },
  secondaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#EDEFF6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7269D6',
    fontFamily: 'Shabnam',
  },

});

export default WelcomeIntroScreen;