import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '@/store';

import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import HomeScreen from '@/screens/HomeScreen';
import BillsScreen from '@/screens/BillsScreen';
import AddBillScreen from '@/screens/AddBillScreen';
import ImportBillScreen from '@/screens/ImportBillScreen';
import StatisticsScreen from '@/screens/StatisticsScreen';
import SettingsScreen from '@/screens/SettingsScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  AddBill: { bill?: any } | undefined;
  Import: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Bills: undefined;
  Statistics: undefined;
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
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const getTabBarIcon =
  ({ route }: { route: { name: keyof MainTabParamList } }) =>
  ({ color, size }: { color: string; size: number }) => {
    let iconName: string;

    switch (route.name) {
      case 'Home':
        iconName = 'home';
        break;
      case 'Bills':
        iconName = 'list';
        break;
      case 'Statistics':
        iconName = 'bar-chart-2';
        break;
      case 'Settings':
        iconName = 'settings';
        break;
      default:
        iconName = 'circle';
    }

    return <Icon name={iconName as any} size={size} color={color} />;
  };

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: getTabBarIcon({ route }),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 20,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#1C1C1E',
        },
      })}
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
          title: '账单',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
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

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {isAuthenticated ? (
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
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
