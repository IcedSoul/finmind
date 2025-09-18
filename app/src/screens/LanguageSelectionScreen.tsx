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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();

  const handleLanguageSelect = async (language: string) => {
    try {
      await AsyncStorage.setItem('language', language);
      await AsyncStorage.setItem('hasLaunched', 'true');
      await i18n.changeLanguage(language);
      navigation.navigate('WelcomeIntro' as never);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      


      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>FinMind</Text>
        </View>

        <Text style={styles.titleChinese}>{t('language.selection.title')}</Text>
        <Text style={styles.titleEnglish}>Please select your language</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleLanguageSelect('zh')}
          >
            <LinearGradient
              colors={['#B990F8', '#9B94F3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.primaryButtonText}>{t('language.selection.chinese')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleLanguageSelect('en')}
          >
            <Text style={styles.secondaryButtonText}>{t('language.selection.english')}</Text>
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
    width: 174,
    height: 99,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7269D6',
    fontFamily: 'Inter',
  },
  titleChinese: {
    fontSize: 23,
    fontWeight: '700',
    color: '#7269D6',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  titleEnglish: {
    fontSize: 20,
    fontWeight: '500',
    color: '#7269D6',
    textAlign: 'center',
    marginBottom: 60,
    fontFamily: 'Inter',
  },
  buttonContainer: {
    width: '100%',
    gap: 24,
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
    fontSize: 20,
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
    fontSize: 20,
    fontWeight: '500',
    color: '#7269D6',
    fontFamily: 'Shabnam',
  },

});

export default LanguageSelectionScreen;