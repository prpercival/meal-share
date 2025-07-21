import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface WebMapProps {
  locations: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    type?: 'user' | 'venue' | 'pickup';
  }>;
}

export const WebMapView: React.FC<WebMapProps> = ({ locations }) => {
  const { theme } = useTheme();

  const getMarkerColor = (type?: string) => {
    switch (type) {
      case 'user':
        return '#34c3eb';
      case 'venue':
        return '#FFC107';
      case 'pickup':
        return '#4CAF50';
      default:
        return '#F44336';
    }
  };

  const openInMaps = (location: { latitude: number; longitude: number; name: string; address: string }) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    Linking.openURL(url).catch(() => {
      console.log('Failed to open maps');
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
    },
    locationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginVertical: 4,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      width: '100%',
    },
    locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    locationText: {
      marginLeft: 12,
      flex: 1,
    },
    locationName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    locationAddress: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    locationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons name="map" size={64} color={theme.colors.primary} />
      <Text style={styles.title}>Map View</Text>
      <Text style={styles.subtitle}>
        Maps are not available in web view. Tap on a location below to open in your default maps app.
      </Text>
      
      {locations.map((location) => (
        <TouchableOpacity
          key={location.id}
          style={styles.locationItem}
          onPress={() => openInMaps(location)}
        >
          <View style={styles.locationInfo}>
            <View
              style={[
                styles.locationDot,
                { backgroundColor: getMarkerColor(location.type) },
              ]}
            />
            <View style={styles.locationText}>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationAddress}>{location.address}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      ))}
    </View>
  );
};
