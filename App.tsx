import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';
import { SnackbarProvider } from './src/context/SnackbarContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function AppContent() {
  const { isDark, theme } = useTheme();
  const { width } = Dimensions.get('window');
  
  // Define responsive styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    webContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    webContent: {
      flex: 1,
      width: '100%',
      maxWidth: Platform.OS === 'web' ? Math.min(480, width) : '100%',
      backgroundColor: theme.colors.background,
    },
  });

  const containerStyle = Platform.OS === 'web' ? styles.webContainer : styles.container;
  
  // Add web-specific styles to prevent scrollbars
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      // Prevent body scrolling and set proper height
      const style = document.createElement('style');
      style.textContent = `
        html, body, #root {
          height: 100vh;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        /* Hide all scrollbars in the app */
        * {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        *::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        /* Ensure proper height inheritance for react-native-web */
        #root > div {
          height: 100vh;
          overflow: hidden;
        }
        /* Specifically target React Native Web ScrollView containers */
        div[data-focusable="true"] {
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
  
  return (
    <View style={containerStyle}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.webContent}>
        <AppNavigator />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <ThemeProvider>
        <SnackbarProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
