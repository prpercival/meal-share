import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Recipe } from '../types';
import { RecipeScalingCalculator } from './RecipeScalingCalculator';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onClaimPortion?: () => void;
  onScaleRecipe?: (scaledRecipe: Recipe, servings: number) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onPress, 
  onClaimPortion,
  onScaleRecipe 
}) => {
  const { theme } = useTheme();
  const [showScalingCalculator, setShowScalingCalculator] = useState(false);

  const handleScaleRecipe = (scaledRecipe: Recipe, servings: number) => {
    if (onScaleRecipe) {
      onScaleRecipe(scaledRecipe, servings);
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
    image: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
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
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    nutritionRow: {
      marginBottom: theme.spacing.sm,
    },
    nutritionText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontSize: 11,
      fontWeight: '500',
    },
    tag: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 16,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    tagText: {
      ...theme.typography.caption,
      color: 'white',
      fontSize: 12,
    },
    claimButton: {
      backgroundColor: theme.colors.secondary,
    },
    claimButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
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
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 8,
      gap: theme.spacing.xs,
    },
    scaleButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    scaleButtonText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {recipe.image && (
        <Image 
          source={recipe.image} 
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
        </View>

        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionText}>
            {recipe.nutritionInfo.calories} cal • {recipe.nutritionInfo.protein}g protein • {recipe.nutritionInfo.carbs}g carbs • {recipe.nutritionInfo.fat}g fat
          </Text>
        </View>

        <View style={styles.tagsContainer}>
          {recipe.dietaryTags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          {onClaimPortion && (
            <TouchableOpacity style={[styles.actionButton, styles.claimButton]} onPress={onClaimPortion}>
              <Text style={styles.claimButtonText}>Claim a Portion</Text>
            </TouchableOpacity>
          )}
          
          {onScaleRecipe && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.scaleButton]} 
              onPress={() => setShowScalingCalculator(true)}
            >
              <Ionicons name="calculator-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.scaleButtonText}>Scale Recipe</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <RecipeScalingCalculator
        recipe={recipe}
        visible={showScalingCalculator}
        onClose={() => setShowScalingCalculator(false)}
        onScale={handleScaleRecipe}
      />
    </TouchableOpacity>
  );
};
