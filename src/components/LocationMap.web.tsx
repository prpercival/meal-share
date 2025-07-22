import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { WebMapView } from './WebMapView';

interface LocationMapProps {
  visible: boolean;
  onClose: () => void;
  locations: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    type?: 'user' | 'venue' | 'pickup';
  }>;
  title?: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  visible,
  onClose,
  locations,
  title = 'Locations',
}) => {
  const { theme } = useTheme();
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (visible && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Error getting current location:', error);
        }
      );
    }
  }, [visible]);

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    // For web, we'll highlight the selection in the list
    // The map bounds will automatically include all locations
  };

  const getMarkerColor = (type?: string) => {
    switch (type) {
      case 'current-user':
        return '#2196F3'; // Blue for current user location
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

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingTop: Platform.OS === 'ios' ? 50 : 20,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 8,
    },
    mapContainer: {
      flex: 1,
    },
    infoContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: 250,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    scrollContainer: {
      maxHeight: 180,
    },
    locationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginVertical: 2,
      borderRadius: 8,
      backgroundColor: 'transparent',
    },
    locationItemSelected: {
      backgroundColor: theme.colors.primary + '15',
      borderWidth: 1,
      borderColor: theme.colors.primary + '30',
    },
    locationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 12,
    },
    locationText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    locationAddress: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      onRequestClose={onClose}
      presentationStyle={Platform.OS === 'web' ? 'overFullScreen' : 'pageSheet'}
      transparent={Platform.OS === 'web'}
    >
      <View style={Platform.OS === 'web' ? { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' } : null}>
        <View style={[styles.modalContainer, Platform.OS === 'web' && { maxWidth: 480, width: '90%', height: '80%', borderRadius: 12 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

        <View style={styles.mapContainer}>
          <WebMapView 
            locations={locations} 
            selectedLocationId={selectedLocationId}
            userLocation={userLocation}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            {locations.length + (userLocation ? 1 : 0)} Location{locations.length + (userLocation ? 1 : 0) !== 1 ? 's' : ''}
          </Text>
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Show current user location first if available */}
            {userLocation && (
              <TouchableOpacity
                onPress={() => handleLocationSelect('user-current')}
                style={[
                  styles.locationItem,
                  selectedLocationId === 'user-current' && styles.locationItemSelected
                ]}
              >
                <View
                  style={[
                    styles.locationDot,
                    { backgroundColor: getMarkerColor('current-user') },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationText}>📍 Your Current Location</Text>
                  <Text style={styles.locationAddress}>This is where you are right now</Text>
                </View>
              </TouchableOpacity>
            )}
            
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                onPress={() => handleLocationSelect(location.id)}
                style={[
                  styles.locationItem,
                  selectedLocationId === location.id && styles.locationItemSelected
                ]}
              >
                <View
                  style={[
                    styles.locationDot,
                    { backgroundColor: getMarkerColor(location.type) },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationText}>{location.name}</Text>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
    </Modal>
  );
};
