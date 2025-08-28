import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import {RootState} from '@/types';

import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import HomeScreen from '@/screens/HomeScreen';
import BillListScreen from '@/screens/BillListScreen';
import AddBillScreen from '@/screens/AddBillScreen';
import ImportScreen from '@/screens/ImportScreen';
import StatisticsScreen from '@/screens/StatisticsScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import ProfileScreen from '@/screens/ProfileScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  AddBill: undefined;
  Import: undefined;
  Profile: undefined;
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
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
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

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
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
      })}>
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
        component={BillListScreen}
        options={{
          title: '账单',
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: '统计',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '设置',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="AddBill"
              component={AddBillScreen}
              options={{
                headerShown: true,
                title: '添加账单',
                animation: 'slide_from_bottom',
                headerStyle: {
                  backgroundColor: '#FFFFFF',
                },
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#1C1C1E',
                },
                headerTintColor: '#007AFF',
              }}
            />
            <Stack.Screen
              name="Import"
              component={ImportScreen}
              options={{
                headerShown: true,
                title: '导入账单',
                animation: 'slide_from_right',
                headerStyle: {
                  backgroundColor: '#FFFFFF',
                },
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#1C1C1E',
                },
                headerTintColor: '#007AFF',
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: '个人资料',
                animation: 'slide_from_right',
                headerStyle: {
                  backgroundColor: '#FFFFFF',
                },
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#1C1C1E',
                },
                headerTintColor: '#007AFF',
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;