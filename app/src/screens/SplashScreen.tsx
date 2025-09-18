import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  route: RouteProp<RootStackParamList, 'Splash'>;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ route }) => {
  const { onFinish } = route.params || {};
  const { theme, themeMode } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    StatusBar.setBarStyle(themeMode === 'dark' ? 'light-content' : 'dark-content');
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish, themeMode]);

  const renderContent = () => (
    <Animated.View
      style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.logoContainer}>
        <View style={[styles.logoBackground, { backgroundColor: theme.colors.card }]}>
          <View style={styles.logoIconContainer}>
            <View style={[styles.logoShape1, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.logoShape2, { backgroundColor: themeMode === 'dark' ? '#AE92F6' : '#FFFFFF' }]} />
            <View style={[styles.logoShape3, { backgroundColor: themeMode === 'dark' ? '#AE92F6' : '#FFFFFF' }]} />
            <View style={[styles.logoShape4, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.logoShape5, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.logoShape6, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.logoShape7, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.logoMainCircle, { backgroundColor: theme.colors.primary }]}>
              <View style={[styles.logoInnerShape1, { backgroundColor: themeMode === 'dark' ? '#AE92F6' : '#FFFFFF' }]} />
              <View style={[styles.logoInnerShape2, { backgroundColor: themeMode === 'dark' ? '#AE92F6' : '#FFFFFF' }]} />
              <View style={[styles.logoInnerShape3, { backgroundColor: themeMode === 'dark' ? '#AE92F6' : '#FFFFFF' }]} />
              <View style={[styles.logoInnerShape4, { backgroundColor: themeMode === 'dark' ? '#AE92F6' : '#FFFFFF' }]} />
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.appName, { color: theme.colors.primary }]}>FinMind</Text>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        </View>
      </View>
    </Animated.View>
  );

  if (themeMode === 'dark') {
    return (
      <LinearGradient
        colors={['#B990F8', '#9C94F3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {renderContent()}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 214,
    height: 122,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIconContainer: {
    width: 214,
    height: 122,
    position: 'relative',
  },
  logoShape1: {
    position: 'absolute',
    left: 0,
    top: 16.55,
    width: 25.76,
    height: 26.37,
    borderRadius: 13,
  },
  logoShape2: {
    position: 'absolute',
    left: 3.59,
    top: 22.3,
    width: 15.26,
    height: 16.16,
    borderRadius: 8,
  },
  logoShape3: {
    position: 'absolute',
    left: 7.45,
    top: 20.99,
    width: 15.29,
    height: 15.87,
    borderRadius: 8,
  },
  logoShape4: {
    position: 'absolute',
    left: 4.16,
    top: 36.16,
    width: 14.42,
    height: 11.98,
    borderRadius: 6,
  },
  logoShape5: {
    position: 'absolute',
    left: 5.88,
    top: 44.42,
    width: 11.05,
    height: 8.84,
    borderRadius: 5,
  },
  logoShape6: {
    position: 'absolute',
    left: 0.28,
    top: 12.96,
    width: 12.33,
    height: 14.45,
    borderRadius: 6,
  },
  logoShape7: {
    position: 'absolute',
    left: 18.02,
    top: 0,
    width: 39.56,
    height: 33.06,
    borderRadius: 16,
  },
  logoMainCircle: {
    position: 'absolute',
    left: 6.25,
    top: 0.05,
    width: 98.98,
    height: 103.2,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInnerShape1: {
    position: 'absolute',
    left: 44,
    top: 16,
    width: 27.4,
    height: 33.17,
    borderRadius: 14,
  },
  logoInnerShape2: {
    position: 'absolute',
    left: 61,
    top: 21,
    width: 19.25,
    height: 24.26,
    borderRadius: 10,
  },
  logoInnerShape3: {
    position: 'absolute',
    left: 71.5,
    top: 29,
    width: 14.58,
    height: 19.76,
    borderRadius: 7,
  },
  logoInnerShape4: {
    position: 'absolute',
    left: 76,
    top: 36.5,
    width: 14.21,
    height: 17.09,
    borderRadius: 7,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default SplashScreen;