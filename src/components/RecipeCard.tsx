import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onClaimPortion?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onPress, 
  onClaimPortion 
}) => {
  const { theme } = useTheme();

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
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    claimButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {recipe.image && (
        <Image source={{ uri: recipe.image }} style={styles.image} />
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

        <View style={styles.tagsContainer}>
          {recipe.dietaryTags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {onClaimPortion && (
          <TouchableOpacity style={styles.claimButton} onPress={onClaimPortion}>
            <Text style={styles.claimButtonText}>Claim a Portion</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
