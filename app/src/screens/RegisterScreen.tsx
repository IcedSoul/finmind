import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useForm } from '@/hooks';
import { validateEmail, validatePassword } from '@/utils';
import { apiService } from '@/services/api';
import { useAuthStore } from '@/store';
import { CustomTextInput } from '@/components';

const { width, height } = Dimensions.get('window');

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setCredentials } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm<RegisterForm>({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

  const handleRegister = async () => {
    if (!validate()) {
      return;
    }

    if (!validateEmail(values.email)) {
      Alert.alert(t('common.error'), t('register.invalidEmail'));
      return;
    }

    if (!validatePassword(values.password)) {
      Alert.alert(t('common.error'), t('register.passwordTooShort'));
      return;
    }

    if (values.password !== values.confirmPassword) {
      Alert.alert(t('common.error'), t('register.passwordMismatch'));
      return;
    }

    if (!agreeTerms) {
      Alert.alert(t('common.error'), t('register.agreeTerms'));
      return;
    }

    try {
      setIsLoading(true);
      const result = await apiService.register({
        name: values.fullName,
        email: values.email,
        password: values.password,
      });

      await setCredentials(
        result.user,
        result.access_token,
        result.refresh_token,
      );
      Alert.alert(t('common.success'), t('register.registerSuccess'));
    } catch (registerError: any) {
      Alert.alert(t('register.registerFailed'), registerError.message || t('register.checkNetwork'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleLogin}>
          <Icon name="arrow-left" size={24} color="#2D3436" />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <View style={styles.profileCircle}>
            <Icon name="user-plus" size={32} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.title}>{t('register.title')}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.subtitle}>{t('register.subtitle')}</Text>

        <CustomTextInput
          leftIcon="user"
          placeholder={t('register.fullNamePlaceholder')}
          value={values.fullName}
          onChangeText={text => handleChange('fullName', text)}
          onBlur={() => handleBlur('fullName')}
          autoCapitalize="words"
          autoCorrect={false}
          containerStyle={[
            touched.fullName && errors.fullName ? styles.inputError : null,
          ]}
        />
        {touched.fullName && errors.fullName && (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        )}

        <CustomTextInput
          leftIcon="mail"
          placeholder={t('common.email')}
          value={values.email}
          onChangeText={text => handleChange('email', text)}
          onBlur={() => handleBlur('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={[
            touched.email && errors.email ? styles.inputError : null,
          ]}
        />
        {touched.email && errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}

        <CustomTextInput
          leftIcon="lock"
          rightIcon={showPassword ? 'eye-off' : 'eye'}
          onRightIconPress={() => setShowPassword(!showPassword)}
          placeholder={t('common.password')}
          value={values.password}
          onChangeText={text => handleChange('password', text)}
          onBlur={() => handleBlur('password')}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={[
            touched.password && errors.password ? styles.inputError : null,
          ]}
        />
        {touched.password && errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <CustomTextInput
          leftIcon="lock"
          rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
          onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          placeholder={t('register.confirmPasswordPlaceholder')}
          value={values.confirmPassword}
          onChangeText={text => handleChange('confirmPassword', text)}
          onBlur={() => handleBlur('confirmPassword')}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={[
            touched.confirmPassword && errors.confirmPassword ? styles.inputError : null,
          ]}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}

        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
            {agreeTerms && <Icon name="check" size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.termsText}>
            {t('register.agreeWith')} <Text style={styles.termsLink}>{t('register.termsAndConditions')}</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[isLoading && styles.registerButtonDisabled]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? ['#C7C7CC', '#C7C7CC'] : ['#B990F8', '#9B94F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.registerButton}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? t('register.registering') : t('common.register')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
         <Text style={styles.footerText}>{t('register.alreadyHaveAccount')} </Text>
         <TouchableOpacity onPress={handleLogin}>
           <Text style={styles.footerLink}>{t('common.login')}</Text>
         </TouchableOpacity>
       </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: height,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  profileContainer: {
    marginBottom: 16,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#DDD',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  termsLink: {
    color: '#6C5CE7',
    fontWeight: '500',
  },
  registerButton: {
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Shabnam',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 16,
    color: '#636E72',
  },
  footerLink: {
    fontSize: 16,
    color: '#6C5CE7',
    fontWeight: '700',
    fontFamily: 'Shabnam',
  },
});

export default RegisterScreen;
