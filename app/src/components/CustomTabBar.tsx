import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const homeIconSvg = `<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.75 17V11.75H11.25V17M2.25 7.25L9 1.25L15.75 7.25V15.25C15.75 15.6478 15.592 16.0294 15.3107 16.3107C15.0294 16.592 14.6478 16.75 14.25 16.75H3.75C3.35218 16.75 2.97064 16.592 2.68934 16.3107C2.40804 16.0294 2.25 15.6478 2.25 15.25V7.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const chartIconSvg = `<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.75 13.75V9.5M9 13.75V5.25M14.25 13.75V11.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const transactionIconSvg = `<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.25 6.5L9 11.75L6.75 9.5L3.75 12.5M14.25 6.5H11.25M14.25 6.5V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const addIconSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const settingsIconSvg = `<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 11.75C10.2426 11.75 11.25 10.7426 11.25 9.5C11.25 8.25736 10.2426 7.25 9 7.25C7.75736 7.25 6.75 8.25736 6.75 9.5C6.75 10.7426 7.75736 11.75 9 11.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.7273 11.75C14.6063 12.0015 14.5702 12.2845 14.6236 12.5583C14.6771 12.8321 14.8177 13.0828 15.0273 13.2725L15.0818 13.3271C15.2509 13.4961 15.3864 13.6977 15.4806 13.9201C15.5748 14.1425 15.6258 14.3817 15.6258 14.6234C15.6258 14.8651 15.5748 15.1043 15.4806 15.3267C15.3864 15.5491 15.2509 15.7507 15.0818 15.9198C14.9128 16.0888 14.7112 16.2244 14.4888 16.3186C14.2664 16.4128 14.0272 16.4637 13.7855 16.4637C13.5438 16.4637 13.3046 16.4128 13.0822 16.3186C12.8598 16.2244 12.6582 16.0888 12.4891 15.9198L12.4345 15.8652C12.2448 15.6556 11.9941 15.515 11.7203 15.4616C11.4465 15.4081 11.1635 15.4442 10.9118 15.5652C10.6656 15.6808 10.4608 15.8703 10.3239 16.1098C10.1869 16.3492 10.1234 16.6274 10.1418 16.9061V17.0152C10.1418 17.5081 9.94596 17.9809 9.59467 18.3322C9.24338 18.6835 8.77061 18.8793 8.27773 18.8793C7.78484 18.8793 7.31207 18.6835 6.96078 18.3322C6.60949 17.9809 6.41364 17.5081 6.41364 17.0152V16.9334C6.41364 16.6421 6.33175 16.3573 6.17909 16.1144C6.02643 15.8715 5.80981 15.6804 5.55455 15.5652C5.30282 15.4442 5.01979 15.4081 4.74599 15.4616C4.47219 15.515 4.21149 15.6556 4.02182 15.8652L3.96727 15.9198C3.79821 16.0888 3.59659 16.2244 3.37418 16.3186C3.15177 16.4128 2.91259 16.4637 2.67091 16.4637C2.42923 16.4637 2.19005 16.4128 1.96764 16.3186C1.74523 16.2244 1.54361 16.0888 1.37455 15.9198C1.20548 15.7507 1.06995 15.5491 0.975766 15.3267C0.881582 15.1043 0.830566 14.8651 0.830566 14.6234C0.830566 14.3817 0.881582 14.1425 0.975766 13.9201C1.06995 13.6977 1.20548 13.4961 1.37455 13.3271L1.42909 13.2725C1.63873 13.0828 1.77929 12.8321 1.83276 12.5583C1.88622 12.2845 1.85017 12.0015 1.72909 11.75C1.61351 11.5038 1.42403 11.299 1.1846 11.1621C0.945171 11.0251 0.666965 10.9616 0.388182 10.98H0.279091C-0.213798 10.98 -0.686567 10.7842 -1.03786 10.4329C-1.38915 10.0816 -1.585 9.60884 -1.585 9.11595C-1.585 8.62307 -1.38915 8.1503 -1.03786 7.79901C-0.686567 7.44772 -0.213798 7.25186 0.279091 7.25186H0.360909C0.639692 7.27031 0.917898 7.20679 1.15733 7.06985C1.39676 6.9329 1.58624 6.72811 1.70182 6.48186C1.85017 6.23013 1.88622 5.94711 1.83276 5.67331C1.77929 5.39951 1.63873 5.1388 1.42909 4.94914L1.37455 4.89459C1.20548 4.72553 1.06995 4.52391 0.975766 4.3015C0.881582 4.07909 0.830566 3.83991 0.830566 3.59823C0.830566 3.35655 0.881582 3.11737 0.975766 2.89496C1.06995 2.67255 1.20548 2.47093 1.37455 2.30186C1.54361 2.1328 1.74523 1.99727 1.96764 1.90309C2.19005 1.8089 2.42923 1.75789 2.67091 1.75789C2.91259 1.75789 3.15177 1.8089 3.37418 1.90309C3.59659 1.99727 3.79821 2.1328 3.96727 2.30186L4.02182 2.35641C4.21149 2.56605 4.47219 2.70661 4.74599 2.76007C5.01979 2.81354 5.30282 2.77749 5.55455 2.65641H5.58273C5.82898 2.54083 6.03377 2.35135 6.17071 2.11192C6.30766 1.87249 6.37118 1.59428 6.35273 1.31551V1.20641C6.35273 0.713525 6.54858 0.240756 6.89987 -0.110533C7.25116 -0.461822 7.72393 -0.657677 8.21682 -0.657677C8.7097 -0.657677 9.18247 -0.461822 9.53376 -0.110533C9.88505 0.240756 10.0809 0.713525 10.0809 1.20641V1.28823C10.0624 1.567 10.1259 1.84521 10.2628 2.08464C10.3998 2.32407 10.6046 2.51355 10.8509 2.62914C11.1026 2.75021 11.3856 2.78626 11.6594 2.7328C11.9332 2.67933 12.1939 2.53877 12.3836 2.32914L12.4382 2.27459C12.6072 2.10553 12.8088 1.97 13.0312 1.87581C13.2537 1.78163 13.4928 1.73061 13.7345 1.73061C13.9762 1.73061 14.2154 1.78163 14.4378 1.87581C14.6602 1.97 14.8618 2.10553 15.0309 2.27459C15.1999 2.44366 15.3355 2.64528 15.4296 2.86769C15.5238 3.0901 15.5748 3.32928 15.5748 3.57096C15.5748 3.81264 15.5238 4.05182 15.4296 4.27423C15.3355 4.49664 15.1999 4.69826 15.0309 4.86732L14.9764 4.92186C14.7667 5.11153 14.6262 5.37223 14.5727 5.64603C14.5192 5.91983 14.5553 6.20286 14.6764 6.45459V6.48277C14.7919 6.72902 14.9814 6.93381 15.2208 7.07075C15.4603 7.2077 15.7385 7.27122 16.0173 7.25277H16.1264C16.6193 7.25277 17.092 7.44862 17.4433 7.79991C17.7946 8.1512 17.9905 8.62397 17.9905 9.11686C17.9905 9.60974 17.7946 10.0825 17.4433 10.4338C17.092 10.7851 16.6193 10.9809 16.1264 10.9809H16.0445C15.7657 10.9625 15.4875 11.026 15.2481 11.1629C15.0086 11.2999 14.8192 11.5047 14.7036 11.7509L14.7273 11.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

interface TabIconProps {
  focused: boolean;
  routeName: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, routeName }) => {
  const getIconSvg = () => {
    switch (routeName) {
      case 'Statistics':
        return chartIconSvg;
      case 'Home':
        return homeIconSvg;
      case 'Bills':
        return transactionIconSvg;
      case 'Settings':
        return settingsIconSvg;
      default:
        return homeIconSvg;
    }
  };

  const iconColor = focused ? '#6C5CE7' : '#9CA3AF';

  if (routeName === 'AddBill') {
    return (
      <View style={styles.addButtonContainer}>
        <View style={styles.addButton}>
          <SvgXml xml={addIconSvg} color="#FFFFFF" width={20} height={20} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.iconContainer}>
      <SvgXml xml={getIconSvg()} color={iconColor} width={18} height={18} />
    </View>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'Statistics':
        return t('tabBar.statistics');
      case 'Home':
        return t('tabBar.home');
      case 'Bills':
        return t('tabBar.transactions');
      case 'AddBill':
        return '';
      case 'Settings':
        return t('tabBar.settings');
      default:
        return routeName;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tab,
                route.name === 'AddBill' && styles.addTab,
              ]}
            >
              <TabIcon focused={isFocused} routeName={route.name} />
              {route.name !== 'AddBill' && (
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? '#6C5CE7' : '#9CA3AF' },
                  ]}
                >
                  {getTabLabel(route.name)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  addTab: {
    flex: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CustomTabBar;