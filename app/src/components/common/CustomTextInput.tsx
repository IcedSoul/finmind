import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface CustomTextInputProps extends TextInputProps {
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconColor?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  iconColor = '#8E8E93',
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {leftIcon && (
        <Icon
          name={leftIcon}
          size={20}
          color={iconColor}
          style={styles.leftIcon}
        />
      )}
      <TextInput
        style={[
          styles.input,
          inputStyle,
          style,
        ]}
        placeholderTextColor="#C7C7CC"
        {...props}
      />
      {rightIcon && (
        <Icon
          name={rightIcon}
          size={20}
          color={iconColor}
          style={styles.rightIcon}
          onPress={onRightIconPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEFF6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#303030',
    height: '100%',
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

export default CustomTextInput;