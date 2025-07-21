import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
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
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <WebMapView locations={locations} />
        </View>
      </View>
    </Modal>
  );
};
