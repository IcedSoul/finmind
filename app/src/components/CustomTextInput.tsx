import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  Platform,
} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  customStyle?: any;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  style,
  customStyle,
  multiline = false,
  ...props
}) => {
  return (
    <TextInput
      {...props}
      style={[
        styles.textInput,
        multiline && styles.multilineInput,
        style,
        customStyle,
      ]}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      includeFontPadding={false}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 12 : 16,
    fontSize: 16,
    color: '#2D3436',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
});

export default CustomTextInput;