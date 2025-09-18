import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store';
import CustomTabBar from '../components/CustomTabBar';

import LoginScreen from '@/screens/LoginScreen';
import ModernLoginScreen from '@/screens/ModernLoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import HomeScreen from '@/screens/HomeScreen';
import BillsScreen from '@/screens/BillsScreen';
import AddBillScreen from '@/screens/AddBillScreen';
import ImportBillScreen from '@/screens/ImportBillScreen';
import StatisticsScreen from '@/screens/StatisticsScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import FinancialDashboardScreen from '@/screens/FinancialDashboardScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import LanguageSelectionScreen from '@/screens/LanguageSelectionScreen';
import WelcomeIntroScreen from '@/screens/WelcomeIntroScreen';
import WelcomeFlowScreen from '@/screens/WelcomeFlowScreen';
import NotificationScreen from '@/screens/NotificationScreen';
import SecurityScreen from '@/screens/SecurityScreen';
import BackupScreen from '@/screens/BackupScreen';
import HelpScreen from '@/screens/HelpScreen';
import AboutScreen from '@/screens/AboutScreen';
import SplashScreen from '@/screens/SplashScreen';

export type RootStackParamList = {
  Splash: { onFinish?: () => void };
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  ModernLogin: undefined;
  Register: undefined;
  AddBill: { bill?: any } | undefined;
  Import: undefined;
  Profile: undefined;
  Dashboard: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  WelcomeFlow: undefined;
  LanguageSelection: undefined;
  WelcomeIntro: undefined;
  Notifications: undefined;
  Security: undefined;
  Backup: undefined;
  Help: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Statistics: undefined;
  Home: undefined;
  Bills: undefined;
  AddBill: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="WelcomeFlow" component={WelcomeFlowScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="WelcomeIntro" component={WelcomeIntroScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ModernLogin" component={ModernLoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsScreen}
        options={{
          title: '交易',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AddBill"
        component={AddBillScreen}
        options={{
          title: '添加账单',
          headerShown: false,
        }}
      />
       <Tab.Screen
        name="Statistics"
        component={FinancialDashboardScreen}
        options={{
          title: '统计',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '设置',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        setIsFirstLaunch(hasLaunched === null);
      } catch (error) {
        setIsFirstLaunch(true);
      }
    };

    const timer = setTimeout(() => {
      setShowSplash(false);
      checkFirstLaunch();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {showSplash ? (
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          initialParams={{ onFinish: () => setShowSplash(false) }}
        />
      ) : isFirstLaunch === null ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : isFirstLaunch ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="AddBill"
            component={AddBillScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="Import"
            component={ImportBillScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Security"
            component={SecurityScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Backup"
            component={BackupScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
