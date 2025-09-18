export type AuthStackParamList = {
  WelcomeFlow: undefined;
  LanguageSelection: undefined;
  WelcomeIntro: undefined;
  Welcome: undefined;
  Login: undefined;
  ModernLogin: undefined;
  Register: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Statistics: undefined;
  Home: undefined;
  Bills: undefined;
  AddBill: undefined;
  Settings: undefined;
};

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