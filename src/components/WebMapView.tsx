import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers for React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WebMapProps {
  locations: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    type?: 'user' | 'venue' | 'pickup';
  }>;
  selectedLocationId?: string | null;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}

export const WebMapView: React.FC<WebMapProps> = ({ locations, selectedLocationId, userLocation }) => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (selectedLocationId && mapRef.current) {
      const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
      if (selectedLocation) {
        mapRef.current.flyTo(
          [selectedLocation.latitude, selectedLocation.longitude],
          16,
          { duration: 1 }
        );
      }
    }
  }, [selectedLocationId, locations]);
  const getMapBounds = () => {
    // Include user location in bounds calculation if available
    const allLocations = userLocation ? [...locations, {
      id: 'user-current',
      name: 'Your Location',
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      address: 'Current Location',
      type: 'current-user' as const
    }] : locations;

    if (allLocations.length === 0) {
      return [[40.7128, -74.0060], [40.7628, -73.9560]] as [[number, number], [number, number]];
    }

    if (allLocations.length === 1) {
      const { latitude, longitude } = allLocations[0];
      return [[latitude - 0.01, longitude - 0.01], [latitude + 0.01, longitude + 0.01]] as [[number, number], [number, number]];
    }

    const latitudes = allLocations.map(loc => loc.latitude);
    const longitudes = allLocations.map(loc => loc.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    // Add some padding
    const latPadding = (maxLat - minLat) * 0.1;
    const lngPadding = (maxLng - minLng) * 0.1;
    
    return [
      [minLat - latPadding, minLng - lngPadding],
      [maxLat + latPadding, maxLng + lngPadding]
    ] as [[number, number], [number, number]];
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

  const createCustomIcon = (color: string, isCurrentUser: boolean = false) => {
    const iconSvg = isCurrentUser 
      ? `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5S25 25 25 12.5C25 5.596 19.404 0 12.5 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
          <circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
          <circle cx="12.5" cy="12.5" r="3" fill="${color}"/>
        </svg>`
      : `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5S25 25 25 12.5C25 5.596 19.404 0 12.5 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
          <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
        </svg>`;

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(iconSvg)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  const mapBounds = getMapBounds();

  return (
    <View style={styles.container}>
      <MapContainer
        ref={mapRef}
        bounds={mapBounds}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={createCustomIcon(getMarkerColor(location.type), false)}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <strong>{location.name}</strong>
                <br />
                <span style={{ color: '#666', fontSize: '14px' }}>
                  {location.address}
                </span>
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#007bff', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    marginTop: '8px',
                    display: 'inline-block'
                  }}
                >
                  Open in Google Maps →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Current User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={createCustomIcon(getMarkerColor('current-user'), true)}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <strong>📍 Your Current Location</strong>
                <br />
                <span style={{ color: '#666', fontSize: '14px' }}>
                  This is where you are right now
                </span>
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${userLocation.latitude},${userLocation.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#007bff', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    marginTop: '8px',
                    display: 'inline-block'
                  }}
                >
                  Open in Google Maps →
                </a>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
