import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface NativeMapProps {
  locations: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    type?: 'user' | 'venue' | 'pickup';
  }>;
  selectedLocationId?: string | null;
}

export const NativeMapView: React.FC<NativeMapProps> = ({ locations, selectedLocationId }) => {
  const { theme } = useTheme();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (selectedLocationId && mapRef.current) {
      const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
      if (selectedLocation) {
        mapRef.current.animateToRegion({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    }
  }, [selectedLocationId, locations]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.log('Error getting location permission:', error);
      Alert.alert(
        'Location Permission',
        'Unable to get location permission. You can still view the map.',
        [{ text: 'OK' }]
      );
    }
  };

  const getRegion = () => {
    if (locations.length === 0) {
      return {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    const latitudes = locations.map(loc => loc.latitude);
    const longitudes = locations.map(loc => loc.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = Math.max(0.01, (maxLat - minLat) * 1.2);
    const lngDelta = Math.max(0.01, (maxLng - minLng) * 1.2);

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  };

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

  const centerOnUserLocation = async () => {
    if (!hasLocationPermission) {
      await requestLocationPermission();
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to get current location');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    locationButton: {
      position: 'absolute',
      right: 16,
      top: 80,
      backgroundColor: theme.colors.surface,
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={getRegion()}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={location.address}
            pinColor={getMarkerColor(location.type)}
          />
        ))}
      </MapView>

      {hasLocationPermission && (
        <TouchableOpacity
          style={styles.locationButton}
          onPress={centerOnUserLocation}
        >
          <Ionicons name="locate" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};
