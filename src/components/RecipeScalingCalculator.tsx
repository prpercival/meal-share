import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSnackbar } from '../context/SnackbarContext';
import { Recipe, Ingredient } from '../types';
import { addIngredientsToShoppingList } from '../data/mockData';

interface RecipeScalingCalculatorProps {
  recipe: Recipe;
  visible: boolean;
  onClose: () => void;
  onScale: (scaledRecipe: Recipe, servings: number) => void;
}

export const RecipeScalingCalculator: React.FC<RecipeScalingCalculatorProps> = ({
  recipe,
  visible,
  onClose,
  onScale,
}) => {
  const { theme } = useTheme();
  const { showSuccess, showError, showInfo } = useSnackbar();
  const navigation = useNavigation();
  const [targetServings, setTargetServings] = useState(recipe.servings.toString());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');

  const calculateScaledIngredients = (newServings: number): Ingredient[] => {
    const scaleFactor = newServings / recipe.servings;
    return recipe.ingredients.map(ingredient => ({
      ...ingredient,
      amount: Math.round((ingredient.amount * scaleFactor) * 100) / 100, // Round to 2 decimal places
    }));
  };

  const calculateScaledNutrition = (newServings: number) => {
    const scaleFactor = newServings / recipe.servings;
    return {
      calories: Math.round(recipe.nutritionInfo.calories * scaleFactor),
      protein: Math.round(recipe.nutritionInfo.protein * scaleFactor * 10) / 10,
      carbs: Math.round(recipe.nutritionInfo.carbs * scaleFactor * 10) / 10,
      fat: Math.round(recipe.nutritionInfo.fat * scaleFactor * 10) / 10,
      fiber: Math.round(recipe.nutritionInfo.fiber * scaleFactor * 10) / 10,
    };
  };

  const handleScale = () => {
    const newServings = parseInt(targetServings);
    if (isNaN(newServings) || newServings <= 0) return;

    setShowScheduleModal(true);
  };

  const confirmScheduleAndShoppingList = () => {
    const newServings = parseInt(targetServings);
    const scaledRecipe: Recipe = {
      ...recipe,
      servings: newServings,
      ingredients: calculateScaledIngredients(newServings),
      nutritionInfo: calculateScaledNutrition(newServings),
    };

    // Add to meal schedule
    onScale(scaledRecipe, newServings);
    
    // Add scaled ingredients to shopping list
    const scaledIngredients = calculateScaledIngredients(newServings);
    const ingredientsForShoppingList = scaledIngredients.map(ingredient => ({
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit
    }));
    
    addIngredientsToShoppingList(ingredientsForShoppingList, recipe.id);
    
    setShowScheduleModal(false);
    onClose();
    
    // Show success message with snackbar
    const dateString = new Date(selectedDate).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    showSuccess(
      `${recipe.title} scheduled for ${selectedMealType} on ${dateString}!`,
      {
        label: 'View Shopping List',
        onPress: () => {
          (navigation as any).navigate('Planner', { initialTab: 'shopping' });
        }
      }
    );
  };

  const servingsNum = parseInt(targetServings) || recipe.servings;
  const scaleFactor = servingsNum / recipe.servings;

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginHorizontal: theme.spacing.lg,
      maxHeight: '80%',
      width: '90%',
      ...(Platform.OS === 'web' ? {
        // On web, constrain modal width and center it
        maxWidth: 480,
        alignSelf: 'center',
        marginHorizontal: 'auto',
      } : {}),
    },
    scrollContent: {
      flex: 1,
      marginBottom: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.typography.h2,
      color: theme.colors.text,
      flex: 1,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    recipeTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    servingsSection: {
      marginBottom: theme.spacing.md,
    },
    servingsLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    servingsInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    servingsButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    servingsInput: {
      ...theme.typography.h3,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      textAlign: 'center',
      minWidth: 80,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    scaleInfo: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: 8,
    },
    scaleText: {
      ...theme.typography.body,
      color: theme.colors.text,
      textAlign: 'center',
    },
    section: {
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    ingredientItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    ingredientName: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
    },
    ingredientAmount: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    nutritionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    nutritionItem: {
      width: '48%',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    nutritionValue: {
      ...theme.typography.h3,
      color: theme.colors.primary,
    },
    nutritionLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.lg,
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    cancelButton: {
      backgroundColor: theme.colors.border,
    },
    scaleButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      ...theme.typography.body,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    scaleButtonText: {
      color: 'white',
    },
    mealPrepInfo: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: 8,
      marginBottom: theme.spacing.sm,
    },
    mealPrepTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    mealPrepText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    instructionStep: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      alignItems: 'flex-start',
    },
    stepNumber: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    stepNumberText: {
      ...theme.typography.caption,
      color: 'white',
      fontWeight: '600',
      fontSize: 12,
    },
    instructionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 20,
    },
    scheduleModalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scheduleModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    scheduleModalTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },
    scheduleModalContent: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    scheduleInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.typography.body,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    scheduleLabel: {
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
    confirmScheduleButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    confirmScheduleButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
    },
  });

  const scaledIngredients = calculateScaledIngredients(servingsNum);
  const scaledNutrition = calculateScaledNutrition(servingsNum);

  // Meal prep suggestions based on serving size
  const getMealPrepSuggestion = () => {
    if (servingsNum >= 8) {
      return "Perfect for meal prep! Consider dividing into 4-6 containers for the week.";
    } else if (servingsNum >= 4) {
      return "Great for batch cooking! Store extra portions for later meals.";
    } else if (servingsNum === 1) {
      return "Single serving - perfect for trying new recipes!";
    }
    return "Good portion size for small meal prep batches.";
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Recipe Scaling</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.recipeTitle}>{recipe.title}</Text>

          <View style={styles.servingsSection}>
            <Text style={styles.servingsLabel}>Target Servings:</Text>
            <View style={styles.servingsInputContainer}>
              <TouchableOpacity
                style={styles.servingsButton}
                onPress={() => setTargetServings(Math.max(1, servingsNum - 1).toString())}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.servingsInput}
                value={targetServings}
                onChangeText={setTargetServings}
                keyboardType="numeric"
                selectTextOnFocus
              />
              
              <TouchableOpacity
                style={styles.servingsButton}
                onPress={() => setTargetServings((servingsNum + 1).toString())}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.scaleInfo}>
              <Text style={styles.scaleText}>
                Scaling from {recipe.servings} to {servingsNum} servings 
                {scaleFactor !== 1 && ` (${scaleFactor.toFixed(1)}x)`}
              </Text>
            </View>
          </View>

          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {servingsNum >= 4 && (
              <View style={styles.mealPrepInfo}>
                <Text style={styles.mealPrepTitle}>Meal Prep Tip:</Text>
                <Text style={styles.mealPrepText}>{getMealPrepSuggestion()}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scaled Ingredients</Text>
              {scaledIngredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientAmount}>
                    {ingredient.amount} {ingredient.unit}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scaled Nutrition (per serving)</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(scaledNutrition.calories / servingsNum)}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(scaledNutrition.protein / servingsNum)}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(scaledNutrition.carbs / servingsNum)}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(scaledNutrition.fat / servingsNum)}g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cooking Instructions</Text>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.scaleButton]}
              onPress={handleScale}
            >
              <Text style={[styles.buttonText, styles.scaleButtonText]}>Schedule Meal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Schedule Selection Modal */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {Platform.OS === 'web' ? (
          <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
            <View style={[styles.scheduleModalContainer, { maxWidth: 480, width: '100%' }]}>
              <View style={styles.scheduleModalHeader}>
                <Text style={styles.scheduleModalTitle}>Schedule Recipe</Text>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setShowScheduleModal(false)}
                >
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.scheduleModalContent}>
                <Text style={styles.scheduleLabel}>Recipe</Text>
                <Text style={[styles.scheduleInput, { backgroundColor: theme.colors.border + '20' }]}>
                  {recipe.title} ({targetServings} servings)
                </Text>

                <Text style={styles.scheduleLabel}>Date</Text>
                <TextInput
                  style={styles.scheduleInput}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.textSecondary}
                />

                <Text style={styles.scheduleLabel}>Meal Type</Text>
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

                <TouchableOpacity 
                  style={styles.confirmScheduleButton} 
                  onPress={confirmScheduleAndShoppingList}
                >
                  <Text style={styles.confirmScheduleButtonText}>
                    Schedule Recipe & Update Shopping List
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.scheduleModalContainer}>
            <View style={styles.scheduleModalHeader}>
              <Text style={styles.scheduleModalTitle}>Schedule Recipe</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowScheduleModal(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.scheduleModalContent}>
              <Text style={styles.scheduleLabel}>Recipe</Text>
              <Text style={[styles.scheduleInput, { backgroundColor: theme.colors.border + '20' }]}>
                {recipe.title} ({targetServings} servings)
              </Text>

              <Text style={styles.scheduleLabel}>Date</Text>
              <TextInput
                style={styles.scheduleInput}
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textSecondary}
              />

              <Text style={styles.scheduleLabel}>Meal Type</Text>
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

              <TouchableOpacity 
                style={styles.confirmScheduleButton} 
                onPress={confirmScheduleAndShoppingList}
              >
                <Text style={styles.confirmScheduleButtonText}>
                  Schedule Recipe & Update Shopping List
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </Modal>
  );
};
