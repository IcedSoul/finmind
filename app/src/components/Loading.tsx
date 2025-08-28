import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';

interface LoadingProps {
  visible?: boolean;
  text?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

const Loading: React.FC<LoadingProps> = ({
  visible = true,
  text,
  overlay = false,
  size = 'large',
  color = '#007AFF',
  style,
}) => {
  const renderContent = () => (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.overlayText}>{text}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  if (!visible) {
    return null;
  }

  return renderContent();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  overlayText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default Loading;