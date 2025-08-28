import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  showPasswordToggle?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  showPasswordToggle = false,
  required = false,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    if (containerStyle) {
      baseStyle.push(containerStyle);
    }
    return baseStyle;
  };

  const getInputContainerStyle = () => {
    const baseStyle = [styles.inputContainer];
    if (isFocused) {
      baseStyle.push(styles.inputContainerFocused);
    }
    if (error) {
      baseStyle.push(styles.inputContainerError);
    }
    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input];
    if (leftIcon) {
      baseStyle.push(styles.inputWithLeftIcon);
    }
    if (rightIcon || showPasswordToggle) {
      baseStyle.push(styles.inputWithRightIcon);
    }
    if (inputStyle) {
      baseStyle.push(inputStyle);
    }
    return baseStyle;
  };

  const renderRightIcon = () => {
    if (showPasswordToggle && secureTextEntry !== undefined) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="#8E8E93"
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRightIconPress}>
          <Icon name={rightIcon} size={20} color="#8E8E93" />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Icon name={leftIcon} size={20} color="#8E8E93" />
          </View>
        )}
        
        <TextInput
          style={getInputStyle()}
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#C7C7CC"
          {...props}
        />
        
        {renderRightIcon()}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputContainerFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1C1C1E',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;