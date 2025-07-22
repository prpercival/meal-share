import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export interface SnackbarMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface SnackbarProps {
  message: SnackbarMessage | null;
  onDismiss: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, onDismiss }) => {
  const { theme } = useTheme();
  const [slideAnim] = useState(new Animated.Value(100));
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (message) {
      // Slide up and fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after duration
      const duration = message.duration || 4000;
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!message) return null;

  const getIconName = () => {
    switch (message.type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  const getBackgroundColor = () => {
    switch (message.type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return '#FF9500';
      case 'info':
      default:
        return theme.colors.primary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 20,
      ...(Platform.OS === 'web' ? {
        // On web, center the snackbar within the responsive container
        left: '50%',
        marginLeft: -(Math.min(Dimensions.get('window').width, 480) - 32) / 2,
        width: Math.min(Dimensions.get('window').width, 480) - 32,
      } : {
        // On mobile, use the standard left/right positioning
        left: 16,
        right: 16,
      }),
      backgroundColor: getBackgroundColor(),
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 1000,
    },
    icon: {
      marginRight: 12,
    },
    content: {
      flex: 1,
    },
    message: {
      ...theme.typography.body,
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    actionButton: {
      marginLeft: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    actionText: {
      ...theme.typography.body,
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    dismissButton: {
      marginLeft: 8,
      padding: 4,
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity,
        },
      ]}
    >
      <Ionicons
        name={getIconName()}
        size={20}
        color="white"
        style={styles.icon}
      />
      <View style={styles.content}>
        <Text style={styles.message}>{message.message}</Text>
      </View>
      {message.action && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={message.action.onPress}
        >
          <Text style={styles.actionText}>{message.action.label}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={handleDismiss}
      >
        <Ionicons name="close" size={16} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};
