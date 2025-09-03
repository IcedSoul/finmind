import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { RootState } from '@/types';
import { useForm } from '@/hooks';
import { validateEmail, validatePassword } from '@/utils';

interface LoginForm {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const navigation = useNavigation();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

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
      Alert.alert('错误', '请输入有效的邮箱地址');
      return;
    }

    if (!validatePassword(values.password)) {
      Alert.alert('错误', '密码长度至少6位');
      return;
    }

    try {
      // 这里应该调用 authSlice 中的 login action
      // await dispatch(login({email: values.email, password: values.password}));
      console.log('Login attempt:', values);
    } catch (loginError: any) {
      Alert.alert('登录失败', loginError.message || '请检查网络连接');
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>FinMind</Text>
          <Text style={styles.subtitle}>全记账</Text>
          <Text style={styles.description}>智能记账，轻松理财</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Icon
              name="mail"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                touched.email && errors.email ? styles.inputError : null,
              ]}
              placeholder="邮箱地址"
              placeholderTextColor="#C7C7CC"
              value={values.email}
              onChangeText={text => handleChange('email', text)}
              onBlur={() => handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <View style={styles.inputContainer}>
            <Icon
              name="lock"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                touched.password && errors.password ? styles.inputError : null,
              ]}
              placeholder="密码"
              placeholderTextColor="#C7C7CC"
              value={values.password}
              onChangeText={text => handleChange('password', text)}
              onBlur={() => handleBlur('password')}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#8E8E93"
              />
            </TouchableOpacity>
          </View>
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? '登录中...' : '登录'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>还没有账号？</Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.linkText}>立即注册</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default LoginScreen;
