import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SharedRecipe as SharedRecipeType, Recipe, User } from '../types';
import { RecipeScalingCalculator } from './RecipeScalingCalculator';

interface SharedRecipeCardProps {
  sharedRecipe: SharedRecipeType;
  recipe: Recipe;
  sharedBy: User;
  onAddToSchedule: (recipeId: string, scheduledDate: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

export const SharedRecipeCard: React.FC<SharedRecipeCardProps> = ({
  sharedRecipe,
  recipe,
  sharedBy,
  onAddToSchedule,
}) => {
  const { theme } = useTheme();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRecipeScaling, setShowRecipeScaling] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');

  const handleAddToSchedule = () => {
    setShowScheduleModal(true);
  };

  const handleViewRecipe = () => {
    setShowRecipeScaling(true);
  };

  const confirmAddToSchedule = () => {
    onAddToSchedule(recipe.id, selectedDate, selectedMealType);
    setShowScheduleModal(false);
    // Using console.log instead of Alert for Expo web compatibility
    console.log(`${recipe.title} added to your meal schedule for ${selectedMealType} on ${new Date(selectedDate).toLocaleDateString()}!`);
  };

  const handleRecipeScale = (scaledRecipe: Recipe, servings: number) => {
    // The RecipeScalingCalculator now handles scheduling and shopping list internally
    // This callback is mainly for any additional parent component logic if needed
    console.log(`Recipe scaled and scheduled: ${scaledRecipe.title} for ${servings} servings`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
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
    },
    imageContainer: {
      position: 'relative',
      height: 200,
    },
    image: {
      width: '100%',
      height: '100%',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    sharedBadge: {
      position: 'absolute',
      top: theme.spacing.md,
      left: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sharedBadgeText: {
      ...theme.typography.caption,
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
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
    sharedInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    sharedText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    sharedDate: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontSize: 14,
      marginBottom: theme.spacing.md,
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
      fontSize: 12,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    tag: {
      backgroundColor: theme.colors.secondary + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    tagText: {
      ...theme.typography.caption,
      color: theme.colors.secondary,
      fontSize: 11,
      fontWeight: '500',
    },
    personalNotes: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: 8,
      marginBottom: theme.spacing.md,
    },
    personalNotesText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontSize: 14,
      fontStyle: 'italic',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 8,
      flex: 1,
      marginRight: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewButtonText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
      fontSize: 14,
      marginLeft: theme.spacing.xs,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    addButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
      fontSize: 14,
      marginLeft: theme.spacing.xs,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    modalContent: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.typography.body,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    label: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    mealTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    mealTypeButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginHorizontal: theme.spacing.xs,
      alignItems: 'center',
    },
    mealTypeButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    mealTypeButtonText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    mealTypeButtonTextActive: {
      color: 'white',
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    confirmButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {recipe.image && (
          <Image source={recipe.image} style={styles.image} contentFit="cover" />
        )}
        <View style={styles.sharedBadge}>
          <Ionicons name="people" size={12} color="white" />
          <Text style={styles.sharedBadgeText}>Shared</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.sharedInfo}>
            <Ionicons name="person-circle-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.sharedText}>
              Shared by {sharedBy.name} • {formatDate(sharedRecipe.sharedDate)}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.infoContainer}>
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

        {recipe.dietaryTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {recipe.dietaryTags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {sharedRecipe.personalNotes && (
          <View style={styles.personalNotes}>
            <Text style={styles.personalNotesText}>"{sharedRecipe.personalNotes}"</Text>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.viewButton} onPress={handleViewRecipe}>
            <Ionicons name="book-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.viewButtonText}>View Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToSchedule}>
            <Ionicons name="calendar-outline" size={16} color="white" />
            <Text style={styles.addButtonText}>Add to Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Schedule Modal */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add to Schedule</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowScheduleModal(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.label}>Recipe</Text>
            <Text style={[styles.input, { backgroundColor: theme.colors.border + '20' }]}>
              {recipe.title}
            </Text>

            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textSecondary}
            />

            <Text style={styles.label}>Meal Type</Text>
            <View style={styles.mealTypeContainer}>
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => (
                <TouchableOpacity
                  key={mealType}
                  style={[
                    styles.mealTypeButton,
                    selectedMealType === mealType && styles.mealTypeButtonActive,
                  ]}
                  onPress={() => setSelectedMealType(mealType)}
                >
                  <Text
                    style={[
                      styles.mealTypeButtonText,
                      selectedMealType === mealType && styles.mealTypeButtonTextActive,
                    ]}
                  >
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={confirmAddToSchedule}>
              <Text style={styles.confirmButtonText}>Add to Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
