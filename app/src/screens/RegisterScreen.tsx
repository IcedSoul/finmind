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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useForm } from '@/hooks';
import { validateEmail, validatePassword } from '@/utils';
import { authService } from '@/services/authService';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm<RegisterForm>({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

  const handleRegister = async () => {
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

    if (values.password !== values.confirmPassword) {
      Alert.alert('错误', '两次输入的密码不一致');
      return;
    }

    if (values.name.trim().length < 2) {
      Alert.alert('错误', '姓名至少2个字符');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      Alert.alert('注册成功', '请登录您的账户', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    } catch (registerError: any) {
      Alert.alert('注册失败', registerError.message || '请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.goBack();
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
          <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
            <Icon name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>创建账户</Text>
          <Text style={styles.subtitle}>加入 FinMind 开始智能记账</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Icon
              name="user"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                touched.name && errors.name ? styles.inputError : null,
              ]}
              placeholder="姓名"
              placeholderTextColor="#C7C7CC"
              value={values.name}
              onChangeText={text => handleChange('name', text)}
              onBlur={() => handleBlur('name')}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          {touched.name && errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}

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
                touched.confirmPassword && errors.confirmPassword
                  ? styles.inputError
                  : null,
              ]}
              placeholder="确认密码"
              placeholderTextColor="#C7C7CC"
              value={values.confirmPassword}
              onChangeText={text => handleChange('confirmPassword', text)}
              onBlur={() => handleBlur('confirmPassword')}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#8E8E93"
              />
            </TouchableOpacity>
          </View>
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.registerButton,
              isLoading && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? '注册中...' : '注册'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>已有账号？</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.linkText}>立即登录</Text>
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
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
    height: '100%',
    paddingVertical: 0,
    justifyContent: 'center',
    textAlignVertical: 'center',
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
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  registerButtonText: {
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

export default RegisterScreen;
