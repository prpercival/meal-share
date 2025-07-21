import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Recipe, User } from '../types';
import { AvailableMealExchange } from '../data/mockData';

interface MealExchangeCardProps {
  exchange: AvailableMealExchange;
  recipe: Recipe;
  cook: User;
  onClaimPortion: () => void;
  onViewDetails?: () => void;
}

export const MealExchangeCard: React.FC<MealExchangeCardProps> = ({ 
  exchange, 
  recipe, 
  cook, 
  onClaimPortion,
  onViewDetails 
}) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    availabilityBadge: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
    },
    availabilityText: {
      ...theme.typography.caption,
      color: 'white',
      fontSize: 11,
      fontWeight: '600',
    },
    lowStockBadge: {
      backgroundColor: theme.colors.warning,
    },
    cookInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    cookAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: theme.spacing.sm,
    },
    cookDetails: {
      flex: 1,
    },
    cookName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
    },
    cookLocation: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    dateTimeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    dateTimeText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    image: {
      width: '100%',
      height: 180,
    },
    content: {
      padding: theme.spacing.md,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      fontSize: 14,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    priceText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    tag: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 16,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    tagText: {
      ...theme.typography.caption,
      color: theme.colors.primary,
      fontSize: 11,
    },
    notesContainer: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: 8,
      marginBottom: theme.spacing.md,
    },
    notesText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 8,
      gap: theme.spacing.xs,
    },
    claimButton: {
      backgroundColor: theme.colors.secondary,
    },
    claimButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      opacity: 0.6,
    },
    claimButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
    },
    detailsButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    detailsButtonText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  const isLowStock = exchange.availablePortions <= 1;
  const isAvailable = exchange.availablePortions > 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onViewDetails}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.cookInfo}>
            <Image 
              source={typeof cook.avatar === 'string' ? { uri: cook.avatar } : cook.avatar}
              style={styles.cookAvatar}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.cookDetails}>
              <Text style={styles.cookName}>{cook.name}</Text>
              <Text style={styles.cookLocation}>
                {exchange.pickupLocation.address.split(',')[0]}
              </Text>
            </View>
          </View>
          <View style={[styles.availabilityBadge, isLowStock && styles.lowStockBadge]}>
            <Text style={styles.availabilityText}>
              {exchange.availablePortions} of {exchange.totalPortions} left
            </Text>
          </View>
        </View>

        <View style={styles.dateTimeInfo}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.dateTimeText}>
            {formatDate(exchange.cookingDate)} at {exchange.cookingTime}
          </Text>
        </View>
      </View>

      {recipe.image && (
        <Image 
          source={typeof recipe.image === 'string' ? { uri: recipe.image } : recipe.image}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>{recipe.prepTime + recipe.cookTime}min</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>{recipe.servings} servings</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="bar-chart-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>{recipe.difficulty}</Text>
          </View>
          {exchange.pricePerPortion && (
            <Text style={styles.priceText}>${exchange.pricePerPortion}</Text>
          )}
        </View>

        <View style={styles.tagsContainer}>
          {recipe.dietaryTags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {exchange.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>"{exchange.notes}"</Text>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.claimButton,
              !isAvailable && styles.claimButtonDisabled
            ]} 
            onPress={onClaimPortion}
            disabled={!isAvailable}
          >
            <Ionicons 
              name={isAvailable ? "hand-right-outline" : "close-circle-outline"} 
              size={16} 
              color="white" 
            />
            <Text style={styles.claimButtonText}>
              {isAvailable ? 'Claim Portion' : 'Sold Out'}
            </Text>
          </TouchableOpacity>
          
          {onViewDetails && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.detailsButton]} 
              onPress={onViewDetails}
            >
              <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
