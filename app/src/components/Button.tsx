import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, (styles as any)[size]];

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    } else {
      baseStyle.push((styles as any)[variant]);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, (styles as any)[`${size}Text`]];

    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    } else {
      baseStyle.push((styles as any)[`${variant}Text`]);
    }

    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? '#007AFF' : '#FFFFFF'}
        />
      );
    }

    const iconElement = icon && (
      <Icon
        name={icon as any}
        size={getIconSize()}
        color={
          disabled ? '#C7C7CC' : variant === 'secondary' ? '#007AFF' : '#FFFFFF'
        }
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
      />
    );

    return (
      <>
        {iconPosition === 'left' && iconElement}
        <Text style={getTextStyle()}>{title}</Text>
        {iconPosition === 'right' && iconElement}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: '#007AFF',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  success: {
    backgroundColor: '#34C759',
  },
  disabled: {
    backgroundColor: '#F2F2F7',
    borderColor: '#E5E5EA',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#007AFF',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  successText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#C7C7CC',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
