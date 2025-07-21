import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSnackbar } from '../context/SnackbarContext';
import { AvailableMealExchange, Recipe, User } from '../types';
import { RecipeScalingCalculator } from './RecipeScalingCalculator';
import { claimMealPortion, isExchangeAlreadyClaimed } from '../data/mockData';

interface AvailableMealCardProps {
  exchange: AvailableMealExchange;
  recipe: Recipe;
  cook: User;
  onClaimPortion: (exchangeId: string) => void;
}

export const AvailableMealCard: React.FC<AvailableMealCardProps> = ({
  exchange,
  recipe,
  cook,
  onClaimPortion,
}) => {
  const { theme } = useTheme();
  const { showSuccess, showError, showInfo } = useSnackbar();
  const navigation = useNavigation();
  const [showRecipeScaling, setShowRecipeScaling] = useState(false);
  const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);

  // Check if the meal is already claimed when component mounts
  useEffect(() => {
    setIsAlreadyClaimed(isExchangeAlreadyClaimed(exchange.id));
  }, [exchange.id]);

  const handleClaimPortion = () => {
    if (isAlreadyClaimed) {
      showInfo('This meal is already in your calendar!');
      return;
    }

    const result = claimMealPortion(exchange.id);
    if (result.success) {
      setIsAlreadyClaimed(true);
      onClaimPortion(exchange.id);
      showSuccess(
        `Successfully claimed ${recipe.title}!`,
        {
          label: 'View Calendar',
          onPress: () => {
            (navigation as any).navigate('Planner');
          }
        }
      );
    } else {
      showError('Failed to claim meal. It may no longer be available.');
    }
  };

  const handleViewRecipe = () => {
    setShowRecipeScaling(true);
  };

  const handleRecipeScale = (scaledRecipe: Recipe, servings: number) => {
    // The RecipeScalingCalculator now handles scheduling and shopping list internally
    // This callback is mainly for any additional parent component logic if needed
    console.log(`Recipe scaled and scheduled: ${scaledRecipe.title} for ${servings} servings`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      overflow: 'hidden',
    },
    imageContainer: {
      position: 'relative',
      height: 200,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    availabilityBadge: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      backgroundColor: theme.colors.success,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 16,
    },
    availabilityText: {
      ...theme.typography.caption,
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
    content: {
      padding: theme.spacing.md,
    },
    header: {
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    cookInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    cookAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: theme.spacing.xs,
    },
    cookName: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    details: {
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
      fontSize: 14,
      marginLeft: theme.spacing.xs,
      flex: 1,
    },
    notes: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontSize: 14,
      fontStyle: 'italic',
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: 8,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    price: {
      ...theme.typography.h3,
      color: theme.colors.primary,
      marginRight: theme.spacing.xs,
    },
    priceUnit: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    claimButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 44, // Fixed height to match view button
      minWidth: 100, // Minimum width to accommodate both states
    },
    claimButtonClaimed: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 44, // Fixed height to match view button
      minWidth: 100, // Minimum width to accommodate both states
    },
    claimButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
      fontSize: 14, // Match view recipe button font size
    },
    dietaryTags: {
      flexDirection: 'row',
      marginTop: theme.spacing.sm,
    },
    dietaryTag: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
      marginRight: theme.spacing.xs,
    },
    dietaryTagText: {
      ...theme.typography.caption,
      color: theme.colors.primary,
      fontSize: 11,
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    viewButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      height: 44, // Fixed height to match claim button
    },
    viewButtonText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.availabilityBadge}>
          <Text style={styles.availabilityText}>
            {exchange.availablePortions} of {exchange.totalPortions} left
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.cookInfo}>
            <Image
              source={typeof cook.avatar === 'string' ? { uri: cook.avatar } : cook.avatar}
              style={styles.cookAvatar}
            />
            <Text style={styles.cookName}>Cooked by {cook.name}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{formatDate(exchange.cookingDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>Ready at {exchange.cookingTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{exchange.pickupLocation.address}</Text>
          </View>
        </View>

        {exchange.notes && (
          <Text style={styles.notes}>"{exchange.notes}"</Text>
        )}

        {recipe.dietaryTags.length > 0 && (
          <View style={styles.dietaryTags}>
            {recipe.dietaryTags.map((tag, index) => (
              <View key={index} style={styles.dietaryTag}>
                <Text style={styles.dietaryTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            {exchange.pricePerPortion ? (
              <>
                <Text style={styles.price}>${exchange.pricePerPortion}</Text>
                <Text style={styles.priceUnit}>per portion</Text>
              </>
            ) : (
              <Text style={styles.priceUnit}>Free</Text>
            )}
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.viewButton} onPress={handleViewRecipe}>
              <Ionicons name="book-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.viewButtonText}>View Recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={isAlreadyClaimed ? styles.claimButtonClaimed : styles.claimButton} 
              onPress={handleClaimPortion}
            >
              <Ionicons 
                name={isAlreadyClaimed ? "checkmark-circle" : "restaurant"} 
                size={16} 
                color="white" 
              />
              <Text style={styles.claimButtonText}>
                {isAlreadyClaimed ? "In Calendar" : "Claim"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Recipe Scaling Calculator */}
      <RecipeScalingCalculator
        recipe={recipe}
        visible={showRecipeScaling}
        onClose={() => setShowRecipeScaling(false)}
        onScale={handleRecipeScale}
      />
    </View>
  );
};
