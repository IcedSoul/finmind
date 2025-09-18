import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm } from '@/hooks';
import { validateEmail, validatePassword } from '@/utils';
import { useAuthStore } from '@/store';
import { apiService } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { CustomTextInput } from '@/components';

const { height } = Dimensions.get('window');

interface LoginForm {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setCredentials } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm<LoginForm>({
      email: '',
      password: '',
    });

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    if (!validateEmail(values.email)) {
      Alert.alert(t('common.error'), t('login.invalidEmail'));
      return;
    }

    if (!validatePassword(values.password)) {
      Alert.alert(t('common.error'), t('login.passwordTooShort'));
      return;
    }

    try {
      setIsLoading(true);
      const result = await apiService.login({
        email: values.email,
        password: values.password,
      });

      await setCredentials(
        result.user,
        result.access_token,
        result.refresh_token,
      );
      Alert.alert(t('common.success'), t('login.loginSuccess'));
    } catch (loginError: any) {
      Alert.alert(t('login.loginFailed'), loginError.message || t('login.checkNetwork'));
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.profileCircle}>
            <Icon name="user" size={32} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.title}>{t('login.appName')}</Text>
      </View>

      <View style={styles.form}>
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

        <TouchableOpacity
          style={[isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? ['#C7C7CC', '#C7C7CC'] : ['#B990F8', '#9B94F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? t('login.loggingIn') : t('common.login')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>{t('login.or')}</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => console.log('Google login')}
          >
            <Icon name="chrome" size={20} color="#DB4437" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => console.log('Apple login')}
          >
            <Icon name="smartphone" size={20} color="#000000" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => console.log('Facebook login')}
          >
            <Icon name="facebook" size={20} color="#4267B2" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => console.log('Fingerprint login')}
          >
            <Icon name="lock" size={20} color="#6C5CE7" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('login.noAccount')}</Text>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.linkText}>{t('common.register')}</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  profileContainer: {
    marginBottom: 24,
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
  loginButton: {
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E9ECEF',
  },
  dividerText: {
    fontSize: 14,
    color: '#636E72',
    marginHorizontal: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Shabnam',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 16,
    color: '#636E72',
    marginRight: 4,
  },
  linkText: {
    fontSize: 16,
    color: '#6C5CE7',
    fontWeight: '700',
    fontFamily: 'Shabnam',
  },
});

export default LoginScreen;
