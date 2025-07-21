import * as Location from 'expo-location';

export interface LocationResult {
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Geocode an address to get coordinates
 * @param address The address to geocode
 * @returns Promise with location result or null if failed
 */
export const geocodeAddress = async (address: string): Promise<LocationResult | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission not granted');
      return null;
    }

    const results = await Location.geocodeAsync(address);
    if (results.length > 0) {
      const { latitude, longitude } = results[0];
      return {
        address,
        latitude,
        longitude,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to get an address
 * @param latitude 
 * @param longitude 
 * @returns Promise with address string or null if failed
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<string | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission not granted');
      return null;
    }

    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results.length > 0) {
      const result = results[0];
      const addressParts = [
        result.streetNumber,
        result.street,
        result.city,
        result.region,
        result.postalCode,
        result.country
      ].filter(Boolean);
      
      return addressParts.join(', ');
    }
    
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

/**
 * Get current user location
 * @returns Promise with current location or null if failed
 */
export const getCurrentLocation = async (): Promise<LocationResult | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission not granted');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    
    // Try to get address from coordinates
    const address = await reverseGeocode(latitude, longitude);
    
    return {
      address: address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error('Get current location error:', error);
    return null;
  }
};
