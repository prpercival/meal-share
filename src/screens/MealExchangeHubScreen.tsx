import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { MealExchange, CookingSession } from '../types';
import { mockExchanges, mockCookingSessions } from '../data/mockData';

type ExchangeType = 'cook-trade' | 'cook-together';

export const MealExchangeHubScreen: React.FC = () => {
  const { theme } = useTheme();
  const { exchanges, setExchanges, cookingSessions, setCookingSessions } = useAppContext();
  const [selectedExchangeType, setSelectedExchangeType] = useState<ExchangeType>('cook-trade');

  useEffect(() => {
    setExchanges(mockExchanges);
    setCookingSessions(mockCookingSessions);
  }, [setExchanges, setCookingSessions]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    typeSelector: {
      flexDirection: 'row',
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.xs,
    },
    typeButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderRadius: 6,
    },
    typeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    typeButtonText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    typeButtonTextActive: {
      color: 'white',
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    exchangeCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: 12,
      padding: theme.spacing.md,
    },
    exchangeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    exchangeTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
      backgroundColor: theme.colors.success,
    },
    statusText: {
      ...theme.typography.caption,
      color: 'white',
      fontSize: 12,
    },
    exchangeDetails: {
      marginBottom: theme.spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    detailText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      ...theme.typography.body,
      fontWeight: '600',
    },
    primaryButtonText: {
      color: 'white',
    },
    secondaryButtonText: {
      color: theme.colors.text,
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    mapButtonText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'completed':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderExchange = ({ item }: { item: MealExchange }) => (
    <View style={styles.exchangeCard}>
      <View style={styles.exchangeHeader}>
        <Text style={styles.exchangeTitle}>Recipe Exchange</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.exchangeDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>
            {new Date(item.scheduledDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{item.portionSize} portions</Text>
        </View>
        {item.pickupLocation && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{item.pickupLocation.address}</Text>
          </View>
        )}
        {item.notes && (
          <View style={styles.detailRow}>
            <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{item.notes}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            {item.status === 'pending' ? 'Confirm' : 'View Details'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCookingSession = ({ item }: { item: CookingSession }) => (
    <View style={styles.exchangeCard}>
      <View style={styles.exchangeHeader}>
        <Text style={styles.exchangeTitle}>Group Cooking</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.exchangeDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>
            {new Date(item.scheduledDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>
            {item.participants.length}/{item.maxParticipants} participants
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{item.location.address}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>View Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Text style={[styles.buttonText, styles.primaryButtonText]}>Join Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal Exchange Hub</Text>
        <Text style={styles.subtitle}>
          Manage your exchanges and cooking sessions
        </Text>
      </View>

      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            selectedExchangeType === 'cook-trade' && styles.typeButtonActive,
          ]}
          onPress={() => setSelectedExchangeType('cook-trade')}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedExchangeType === 'cook-trade' && styles.typeButtonTextActive,
            ]}
          >
            Cook & Trade
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            selectedExchangeType === 'cook-together' && styles.typeButtonActive,
          ]}
          onPress={() => setSelectedExchangeType('cook-together')}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedExchangeType === 'cook-together' && styles.typeButtonTextActive,
            ]}
          >
            Cook Together
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.mapButton}>
        <Ionicons name="map-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.mapButtonText}>View Pickup Locations & Venues</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedExchangeType === 'cook-trade' ? 'Active Exchanges' : 'Cooking Sessions'}
        </Text>
        {selectedExchangeType === 'cook-trade' ? (
          <FlatList
            data={exchanges}
            renderItem={renderExchange}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <FlatList
            data={cookingSessions}
            renderItem={renderCookingSession}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
};
