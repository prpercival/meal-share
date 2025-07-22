import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useAppContext } from '../context/AppContext';
import { PlannedMeal, ShoppingListItem, NutritionInfo } from '../types';
import { PantryItem } from '../types/pantry';
import { 
  mockRecipes, 
  getCurrentUserPlannedMeals, 
  getCurrentUserShoppingList,
  getCurrentUserPantry,
  checkPantryAvailability,
  addIngredientsToShoppingList,
  removePantryItem
} from '../data/mockData';

interface WeekDay {
  date: string;
  dayName: string;
  meals: PlannedMeal[];
}

export const PersonalMealPlannerScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showSuccess, showError, showInfo } = useSnackbar();
  const { weeklyPlan, setWeeklyPlan } = useAppContext();
  const route = useRoute();
  const initialTab = (route.params as any)?.initialTab || 'calendar';
  const [selectedTab, setSelectedTab] = useState<'calendar' | 'nutrition' | 'shopping' | 'pantry'>(initialTab);
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedDateForMeal, setSelectedDateForMeal] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAddPantryModal, setShowAddPantryModal] = useState(false);
  const [newPantryItem, setNewPantryItem] = useState({
    name: '',
    amount: '',
    unit: '',
    category: 'pantry' as PantryItem['category'],
    expirationDate: '',
    location: 'Pantry',
  });

  useEffect(() => {
    // Generate current week starting from Sunday
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay); // Go back to Sunday
    
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        meals: [], // Would be populated from weeklyPlan
      };
    });
    setWeekDays(days);

    // Load planned meals for the current user
    const userPlannedMeals = getCurrentUserPlannedMeals();
    setPlannedMeals(userPlannedMeals);

    // Load shopping list for the current user
    const userShoppingList = getCurrentUserShoppingList();
    setShoppingList(userShoppingList);

  // Load pantry items for the current user
  const userPantryItems = getCurrentUserPantry();
  setPantryItems(userPantryItems);
}, []);

// Function to refresh shopping list data
const refreshShoppingList = useCallback(() => {
  const userShoppingList = getCurrentUserShoppingList();
  setShoppingList(userShoppingList);
}, []);

// Function to refresh pantry data
const refreshPantryItems = useCallback(() => {
  const userPantryItems = getCurrentUserPantry();
  setPantryItems(userPantryItems);
}, []);

// Refresh shopping list and pantry when screen comes into focus
useFocusEffect(
  useCallback(() => {
    refreshShoppingList();
    refreshPantryItems();
  }, [refreshShoppingList, refreshPantryItems])
);  // Nutrition goals (daily targets)
  const nutritionGoals: NutritionInfo = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    fiber: 25,
  };

  // Calculate current nutrition from today's planned meals
  const calculateCurrentNutrition = (): NutritionInfo => {
    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    const todaysDate = new Date().toISOString().split('T')[0];
    const todaysPlannedMeals = plannedMeals.filter(meal => meal.scheduledDate === todaysDate);

    todaysPlannedMeals.forEach(plannedMeal => {
      const recipe = mockRecipes.find(r => r.id === plannedMeal.recipeId);
      if (recipe) {
        // Assuming 1 serving per planned meal (could be configurable)
        totalNutrition.calories += recipe.nutritionInfo.calories;
        totalNutrition.protein += recipe.nutritionInfo.protein;
        totalNutrition.carbs += recipe.nutritionInfo.carbs;
        totalNutrition.fat += recipe.nutritionInfo.fat;
        totalNutrition.fiber += recipe.nutritionInfo.fiber;
      }
    });

    return totalNutrition;
  };

  const currentNutrition = calculateCurrentNutrition();

  // Function to toggle shopping list item purchased status
  const toggleShoppingItem = (itemId: string) => {
    const item = shoppingList.find(item => item.id === itemId);
    if (!item) return;
    
    setShoppingList(prevList =>
      prevList.map(item =>
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      )
    );
    
    // Show feedback
    if (item.purchased) {
      showInfo(`${item.ingredient} moved back to shopping list`);
    } else {
      showSuccess(`${item.ingredient} marked as purchased!`);
    }
  };

  // Add meal functionality
  const handleAddMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedDateForMeal(date);
    setSelectedMealType(mealType);
    setShowAddMealModal(true);
  };

  const handleSelectRecipeForMeal = (recipeId: string) => {
    const newPlannedMeal: PlannedMeal = {
      id: Date.now().toString(),
      recipeId,
      scheduledDate: selectedDateForMeal,
      mealType: selectedMealType,
      source: 'self-cook',
    };

    setPlannedMeals(prev => [...prev, newPlannedMeal]);
    
    // Find the recipe and add its ingredients to the shopping list
    const recipe = mockRecipes.find(r => r.id === recipeId);
    if (recipe && recipe.ingredients) {
      const ingredients = recipe.ingredients.map(ingredient => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      }));
      addIngredientsToShoppingList(ingredients, recipeId);
      
      // Refresh the shopping list to show the new items
      refreshShoppingList();
    }
    
    setShowAddMealModal(false);
    showSuccess('Meal added to your calendar and ingredients added to shopping list!');
  };

  // Pantry management functions
  const handleAddPantryItem = () => {
    if (!newPantryItem.name || !newPantryItem.amount) {
      showError('Please fill in name and amount');
      return;
    }

    const pantryItem: PantryItem = {
      id: Date.now().toString(),
      name: newPantryItem.name,
      amount: parseFloat(newPantryItem.amount),
      unit: newPantryItem.unit || 'pieces',
      category: newPantryItem.category,
      dateAdded: new Date().toISOString(),
      expirationDate: newPantryItem.expirationDate || undefined,
      location: newPantryItem.location,
    };

    setPantryItems(prev => [...prev, pantryItem]);
    setNewPantryItem({
      name: '',
      amount: '',
      unit: '',
      category: 'pantry',
      expirationDate: '',
      location: 'Pantry',
    });
    setShowAddPantryModal(false);
    showSuccess('Item added to pantry!');
  };

  const handleRemovePantryItem = (itemId: string) => {
    console.log('handleRemovePantryItem called with itemId:', itemId);
    
    // Find the item to get its name for the confirmation message
    const item = pantryItems.find(item => item.id === itemId);
    const itemName = item ? item.name : 'this item';
    
    // Show confirmation snackbar with action button
    showInfo(
      `Remove "${itemName}" from pantry?`,
      {
        label: 'DELETE',
        onPress: () => {
          const success = removePantryItem(itemId);
          if (success) {
            // Update local state to reflect the change
            setPantryItems(prev => prev.filter(item => item.id !== itemId));
            showSuccess('Item removed from pantry!');
          } else {
            showError('Failed to remove item from pantry');
          }
        }
      }
    );
  };

  const handleGenerateShoppingList = () => {
    showInfo(
      'Create a shopping list based on your planned meals for the week?',
      {
        label: 'GENERATE',
        onPress: () => {
          // TODO: Implement shopping list generation logic
          showSuccess('Shopping list generated based on your meal plan!');
        }
      }
    );
  };

  const handleAutoMarkPantryItems = () => {
    const itemsInPantry = shoppingList.filter(item => {
      const availability = checkPantryAvailability(item.ingredient, item.amount, item.unit);
      return availability.available && !item.purchased;
    });

    if (itemsInPantry.length === 0) {
      showInfo('No pantry items to mark as completed.');
      return;
    }

    showInfo(
      `Mark ${itemsInPantry.length} items as completed since they're available in your pantry?`,
      {
        label: 'MARK COMPLETED',
        onPress: () => {
          setShoppingList(prev => 
            prev.map(item => {
              const availability = checkPantryAvailability(item.ingredient, item.amount, item.unit);
              return availability.available ? { ...item, purchased: true } : item;
            })
          );
          showSuccess(`${itemsInPantry.length} items marked as completed!`);
        }
      }
    );
  };

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
    tabSelector: {
      flexDirection: 'row',
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.xs,
    },
    tabButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderRadius: 6,
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    tabButtonText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    tabButtonTextActive: {
      color: 'white',
    },
    calendarContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    dayCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    dayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    dayName: {
      ...theme.typography.h3,
      color: theme.colors.text,
    },
    dayDate: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    mealSlot: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    mealTime: {
      width: 80,
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    mealContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    mealName: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    mealSource: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    addMealButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 6,
    },
    addMealText: {
      ...theme.typography.caption,
      color: 'white',
    },
    nutritionContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    nutritionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    nutritionTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    nutritionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    nutritionItem: {
      width: '48%',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    nutritionValue: {
      ...theme.typography.h2,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    nutritionLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    nutritionProgress: {
      width: '100%',
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      marginTop: theme.spacing.xs,
      overflow: 'hidden',
    },
    nutritionProgressBar: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
    nutritionProgressOverflow: {
      backgroundColor: theme.colors.warning,
    },
    nutritionSubtext: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    shoppingContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    shoppingTabContainer: {
      flex: 1,
    },
    shoppingScrollContent: {
      paddingBottom: theme.spacing.lg,
    },
    fixedButtonContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    buttonProgressContainer: {
      marginBottom: theme.spacing.sm,
    },
    buttonProgressInfo: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },
    buttonProgressText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    completionCheckmark: {
      color: theme.colors.success,
      fontWeight: 'bold',
    },
    buttonProgressBar: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    buttonProgressFill: {
      height: '100%',
      borderRadius: 2,
    },
    progressLow: {
      backgroundColor: theme.colors.error, // Red for 0-49%
    },
    progressMedium: {
      backgroundColor: theme.colors.warning, // Orange for 50-99%
    },
    progressComplete: {
      backgroundColor: theme.colors.success, // Green for 100%
    },
    shoppingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: 8,
      marginBottom: theme.spacing.sm,
    },
    shoppingItemText: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    shoppingItemName: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    shoppingItemAmount: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
    },
    generateButton: {
      backgroundColor: theme.colors.secondary,
      padding: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    generateButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
    },
    // Enhanced nutrition dashboard styles
    nutritionCircle: {
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    nutritionUnit: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontSize: 10,
    },
    nutritionGoal: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontSize: 10,
      marginTop: theme.spacing.xs,
    },
    weeklyStatsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    weeklyStatItem: {
      width: '48%',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: 8,
      marginBottom: theme.spacing.sm,
    },
    weeklyStatValue: {
      ...theme.typography.h3,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    weeklyStatLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    weeklyStatBar: {
      width: '100%',
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    weeklyStatBarFill: {
      height: '100%',
      borderRadius: 2,
    },
    tipsContainer: {
      marginTop: theme.spacing.sm,
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: 8,
      marginBottom: theme.spacing.sm,
    },
    tipText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    mealBreakdownItem: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: 8,
      marginBottom: theme.spacing.sm,
    },
    mealBreakdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    mealBreakdownTime: {
      ...theme.typography.caption,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    mealBreakdownName: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    mealBreakdownNutrition: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    mealBreakdownStat: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    // Pantry integration styles
    pantryContainer: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    pantryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    pantryTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    pantrySubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    autoFillButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 6,
      alignItems: 'center',
    },
    autoFillButtonText: {
      ...theme.typography.caption,
      color: 'white',
      fontWeight: '600',
    },
    shoppingItemInPantry: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.success,
    },
    shoppingItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    pantryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.success + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
    },
    pantryBadgeText: {
      ...theme.typography.caption,
      color: theme.colors.success,
      marginLeft: theme.spacing.xs,
      fontSize: 10,
    },
    shoppingItemDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    shoppingItemPantryAmount: {
      ...theme.typography.caption,
      color: theme.colors.success,
    },
    expirationDate: {
      ...theme.typography.caption,
      color: theme.colors.warning,
      fontSize: 10,
      marginTop: theme.spacing.xs,
    },
    // Pantry styles
    pantryViewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    pantryHeaderTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },
    pantryStats: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    pantryItemCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: 8,
      marginBottom: theme.spacing.sm,
      borderLeftWidth: 4,
    },
    pantryItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    pantryItemName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
    },
    pantryItemCategory: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
    },
    pantryItemCategoryText: {
      ...theme.typography.caption,
      color: theme.colors.primary,
      fontSize: 10,
      fontWeight: '600',
    },
    pantryItemDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pantryItemAmount: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    pantryItemLocation: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    pantryItemExpiring: {
      borderLeftColor: theme.colors.warning,
    },
    pantryItemExpired: {
      borderLeftColor: theme.colors.error,
    },
    pantryItemFresh: {
      borderLeftColor: theme.colors.success,
    },
    categoryFilter: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    categoryButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.border,
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    categoryButtonText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    categoryButtonTextActive: {
      color: 'white',
    },
    // Modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      paddingTop: theme.spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },
    modalContent: {
      flex: 1,
      padding: theme.spacing.md,
    },
    modalSectionTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    recipeOption: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: 8,
      marginBottom: theme.spacing.sm,
    },
    recipeOptionTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    recipeOptionDetails: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    recipeOptionNutrition: {
      ...theme.typography.caption,
      color: theme.colors.primary,
    },
    addPantryButton: {
      padding: theme.spacing.sm,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    removePantryButton: {
      padding: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    // Form styles
    formSection: {
      marginBottom: theme.spacing.md,
    },
    formLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      ...theme.typography.body,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    createFormButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    createFormButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
    },
  });

  const mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const renderCalendarTab = () => (
    <ScrollView style={styles.calendarContainer}>
      {weekDays.map((day, index) => (
        <View key={day.date} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <View>
              <Text style={styles.dayName}>{day.dayName}</Text>
              <Text style={styles.dayDate}>
                {(() => {
                  const [year, month, dayNum] = day.date.split('-').map(Number);
                  const date = new Date(year, month - 1, dayNum); // month is 0-indexed
                  return date.toLocaleDateString();
                })()}
              </Text>
            </View>
          </View>
          {mealTimes.map(mealTime => (
            <View key={mealTime} style={styles.mealSlot}>
              <Text style={styles.mealTime}>{mealTime}</Text>
              <View style={styles.mealContent}>
                {(() => {
                  // Check if there's a planned meal for this day and meal time
                  const plannedMeal = plannedMeals.find(meal => 
                    meal.scheduledDate === day.date && 
                    meal.mealType === mealTime.toLowerCase()
                  );
                  
                  if (plannedMeal) {
                    const recipe = mockRecipes.find(r => r.id === plannedMeal.recipeId);
                    if (recipe) {
                      return (
                        <View>
                          <Text style={styles.mealName}>{recipe.title}</Text>
                          <Text style={styles.mealSource}>
                            {plannedMeal.source === 'exchange' ? 'From Exchange' : 
                             plannedMeal.source === 'group-cook' ? 'Group Cooking' : 'Self Cook'}
                          </Text>
                        </View>
                      );
                    }
                  }
                  
                  // Mock meal for Tuesday lunch (keeping original example)
                  // if (index === 1 && mealTime === 'Lunch') {
                  //   return (
                  //     <View>
                  //       <Text style={styles.mealName}>Mediterranean Quinoa Bowl</Text>
                  //       <Text style={styles.mealSource}>From Preston P. (Exchange)</Text>
                  //     </View>
                  //   );
                  // }
                  
                  return (
                    <TouchableOpacity 
                      style={styles.addMealButton}
                      onPress={() => handleAddMeal(day.date, mealTime.toLowerCase() as any)}
                    >
                      <Text style={styles.addMealText}>+ Add Meal</Text>
                    </TouchableOpacity>
                  );
                })()}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );

  const renderNutritionTab = () => {
    const nutritionItems = [
      { 
        key: 'calories',
        label: 'Calories',
        current: currentNutrition.calories,
        goal: nutritionGoals.calories,
        unit: '',
        color: '#FF6B6B',
      },
      {
        key: 'protein',
        label: 'Protein', 
        current: currentNutrition.protein,
        goal: nutritionGoals.protein,
        unit: 'g',
        color: '#4ECDC4',
      },
      {
        key: 'carbs',
        label: 'Carbs',
        current: currentNutrition.carbs, 
        goal: nutritionGoals.carbs,
        unit: 'g',
        color: '#45B7D1',
      },
      {
        key: 'fat',
        label: 'Fat',
        current: currentNutrition.fat,
        goal: nutritionGoals.fat,
        unit: 'g',
        color: '#F7DC6F',
      },
    ];

    // Calculate weekly nutrition average
    const calculateWeeklyNutrition = () => {
      const thisWeek = weekDays.map(day => day.date);
      const weeklyMeals = plannedMeals.filter(meal => 
        thisWeek.includes(meal.scheduledDate)
      );
      
      let weeklyTotal = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
      let daysWithMeals = 0;
      
      thisWeek.forEach(date => {
        const dayMeals = weeklyMeals.filter(meal => meal.scheduledDate === date);
        if (dayMeals.length > 0) {
          daysWithMeals++;
          dayMeals.forEach(meal => {
            const recipe = mockRecipes.find(r => r.id === meal.recipeId);
            if (recipe) {
              weeklyTotal.calories += recipe.nutritionInfo.calories;
              weeklyTotal.protein += recipe.nutritionInfo.protein;
              weeklyTotal.carbs += recipe.nutritionInfo.carbs;
              weeklyTotal.fat += recipe.nutritionInfo.fat;
              weeklyTotal.fiber += recipe.nutritionInfo.fiber;
            }
          });
        }
      });
      
      const avgDays = Math.max(daysWithMeals, 1);
      return {
        calories: Math.round(weeklyTotal.calories / avgDays),
        protein: Math.round(weeklyTotal.protein / avgDays),
        carbs: Math.round(weeklyTotal.carbs / avgDays),
        fat: Math.round(weeklyTotal.fat / avgDays),
        fiber: Math.round(weeklyTotal.fiber / avgDays),
      };
    };

    const weeklyAverage = calculateWeeklyNutrition();

    return (
      <ScrollView style={styles.nutritionContainer}>
        {/* Today's Progress */}
        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Today's Nutrition Progress</Text>
          <View style={styles.nutritionGrid}>
            {nutritionItems.map(item => {
              const progress = Math.min(item.current / item.goal, 1);
              const isOverGoal = item.current > item.goal;
              const remaining = Math.max(item.goal - item.current, 0);
              
              return (
                <View key={item.key} style={styles.nutritionItem}>
                  <View style={styles.nutritionCircle}>
                    <Text style={styles.nutritionValue}>
                      {Math.round(item.current)}{item.unit}
                    </Text>
                  </View>
                  <Text style={styles.nutritionLabel}>{item.label}</Text>
                  <View style={styles.nutritionProgress}>
                    <View 
                      style={[
                        styles.nutritionProgressBar,
                        { backgroundColor: item.color },
                        isOverGoal && styles.nutritionProgressOverflow,
                        { width: `${Math.min(progress * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={[
                    styles.nutritionSubtext,
                    isOverGoal && { color: '#FF6B6B' }
                  ]}>
                    {isOverGoal 
                      ? `+${Math.round(item.current - item.goal)}${item.unit}`
                      : `${Math.round(remaining)}${item.unit} left`
                    }
                  </Text>
                  <Text style={styles.nutritionGoal}>
                    Goal: {item.goal}{item.unit}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Weekly Overview */}
        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Weekly Average</Text>
          <View style={styles.weeklyStatsGrid}>
            {nutritionItems.map(item => {
              const weeklyValue = weeklyAverage[item.key as keyof typeof weeklyAverage];
              const weeklyProgress = weeklyValue / item.goal;
              
              return (
                <View key={`weekly-${item.key}`} style={styles.weeklyStatItem}>
                  <Text style={[styles.weeklyStatValue, { color: item.color }]}>
                    {weeklyValue}{item.unit}
                  </Text>
                  <Text style={styles.weeklyStatLabel}>{item.label}</Text>
                  <View style={styles.weeklyStatBar}>
                    <View 
                      style={[
                        styles.weeklyStatBarFill,
                        { backgroundColor: item.color, width: `${Math.min(weeklyProgress * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Nutrition Tips */}
        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Smart Recommendations</Text>
          <View style={styles.tipsContainer}>
            {currentNutrition.protein < nutritionGoals.protein * 0.8 && (
              <View style={styles.tipItem}>
                <Ionicons name="fitness" size={20} color="#4ECDC4" />
                <Text style={styles.tipText}>
                  Add more protein-rich meals to meet your daily goal
                </Text>
              </View>
            )}
            {currentNutrition.calories > nutritionGoals.calories * 1.1 && (
              <View style={styles.tipItem}>
                <Ionicons name="warning" size={20} color="#FF6B6B" />
                <Text style={styles.tipText}>
                  Consider lighter meals to stay within calorie goals
                </Text>
              </View>
            )}
            {currentNutrition.fiber < 25 && (
              <View style={styles.tipItem}>
                <Ionicons name="leaf" size={20} color="#52C41A" />
                <Text style={styles.tipText}>
                  Include more vegetables and whole grains for fiber
                </Text>
              </View>
            )}
            <View style={styles.tipItem}>
              <Ionicons name="trending-up" size={20} color="#1890FF" />
              <Text style={styles.tipText}>
                Weekly average: {Math.round((weeklyAverage.calories / nutritionGoals.calories) * 100)}% of daily calorie goal
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Meals Breakdown */}
        {plannedMeals.filter(meal => meal.scheduledDate === new Date().toISOString().split('T')[0]).length > 0 && (
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionTitle}>Today's Planned Meals</Text>
            {plannedMeals.filter(meal => meal.scheduledDate === new Date().toISOString().split('T')[0]).map(meal => {
              const recipe = mockRecipes.find(r => r.id === meal.recipeId);
              return recipe ? (
                <View key={meal.id} style={styles.mealBreakdownItem}>
                  <View style={styles.mealBreakdownHeader}>
                    <Text style={styles.mealBreakdownTime}>
                      {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                    </Text>
                    <Text style={styles.mealBreakdownName}>{recipe.title}</Text>
                  </View>
                  <View style={styles.mealBreakdownNutrition}>
                    <Text style={styles.mealBreakdownStat}>
                      {recipe.nutritionInfo.calories} cal
                    </Text>
                    <Text style={styles.mealBreakdownStat}>
                      {recipe.nutritionInfo.protein}g protein
                    </Text>
                    <Text style={styles.mealBreakdownStat}>
                      {recipe.nutritionInfo.carbs}g carbs
                    </Text>
                    <Text style={styles.mealBreakdownStat}>
                      {recipe.nutritionInfo.fat}g fat
                    </Text>
                  </View>
                </View>
              ) : null;
            })}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderShoppingTab = () => {
    const completedItems = shoppingList.filter(item => item.purchased).length;
    const totalItems = shoppingList.length;
    const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    // Calculate pantry availability
    const itemsInPantry = shoppingList.filter(item => {
      const availability = checkPantryAvailability(item.ingredient, item.amount, item.unit);
      return availability.available;
    }).length;

    return (
      <View style={styles.shoppingTabContainer}>
        {/* Pantry Summary */}
        <View style={styles.pantryContainer}>
          <View style={styles.pantryHeader}>
            <Ionicons name="home-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.pantryTitle}>Pantry Check</Text>
          </View>
          <Text style={styles.pantrySubtitle}>
            {itemsInPantry} of {totalItems} items available in your pantry
          </Text>
          {itemsInPantry > 0 && (
            <TouchableOpacity 
              style={styles.autoFillButton}
              onPress={handleAutoMarkPantryItems}
            >
              <Text style={styles.autoFillButtonText}>
                Auto-mark {itemsInPantry} pantry items
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          style={styles.shoppingContainer}
          contentContainerStyle={styles.shoppingScrollContent}
        >
          {/* Shopping List Items */}
          {shoppingList.map(item => {
            const pantryCheck = checkPantryAvailability(item.ingredient, item.amount, item.unit);
            
            return (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.shoppingItem,
                  pantryCheck.available && styles.shoppingItemInPantry
                ]}
                onPress={() => toggleShoppingItem(item.id)}
              >
                <View style={[styles.checkbox, item.purchased && styles.checkboxChecked]}>
                  {item.purchased && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <View style={styles.shoppingItemText}>
                  <View style={styles.shoppingItemHeader}>
                    <Text style={[
                      styles.shoppingItemName,
                      item.purchased && { textDecorationLine: 'line-through', opacity: 0.6 }
                    ]}>
                      {item.ingredient}
                    </Text>
                    {pantryCheck.available && (
                      <View style={styles.pantryBadge}>
                        <Ionicons name="home" size={12} color={theme.colors.success} />
                        <Text style={styles.pantryBadgeText}>In Pantry</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.shoppingItemDetails}>
                    <Text style={[
                      styles.shoppingItemAmount,
                      item.purchased && { opacity: 0.6 }
                    ]}>
                      Need: {item.amount} {item.unit}
                    </Text>
                    {pantryCheck.available && pantryCheck.amountAvailable && (
                      <Text style={[
                        styles.shoppingItemPantryAmount,
                        item.purchased && { opacity: 0.6 }
                      ]}>
                        Have: {pantryCheck.amountAvailable} {pantryCheck.pantryItem?.unit}
                      </Text>
                    )}
                  </View>
                  {pantryCheck.pantryItem?.expirationDate && (
                    <Text style={styles.expirationDate}>
                      Expires: {new Date(pantryCheck.pantryItem.expirationDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        {/* Fixed Generate Button with Progress */}
        <View style={styles.fixedButtonContainer}>
          {/* Progress Bar above Button */}
          <View style={styles.buttonProgressContainer}>
            <View style={styles.buttonProgressInfo}>
              <Text style={styles.buttonProgressText}>
                {completedItems}/{totalItems} completed ({Math.round(completionPercentage)}%)
                {completionPercentage === 100 && (
                  <Text style={styles.completionCheckmark}> ✓</Text>
                )}
              </Text>
            </View>
            <View style={styles.buttonProgressBar}>
              <View 
                style={[
                  styles.buttonProgressFill,
                  completionPercentage >= 100 ? styles.progressComplete : 
                  completionPercentage >= 50 ? styles.progressMedium :
                  styles.progressLow,
                  { width: `${Math.min(completionPercentage, 100)}%` }
                ]} 
              />
            </View>
          </View>
          
          {/* Generate Button */}
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={handleGenerateShoppingList}
          >
            <Text style={styles.generateButtonText}>Generate Shopping List</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPantryTab = () => {
    const categories = ['all', 'produce', 'dairy', 'meat', 'pantry', 'frozen', 'beverages', 'condiments', 'spices'];
    
    const filteredItems = selectedCategory === 'all' 
      ? pantryItems 
      : pantryItems.filter(item => item.category === selectedCategory);
    
    const getExpirationStatus = (item: PantryItem) => {
      if (!item.expirationDate) return 'fresh';
      
      const today = new Date();
      const expDate = new Date(item.expirationDate);
      const daysUntilExpiry = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) return 'expired';
      if (daysUntilExpiry <= 3) return 'expiring';
      return 'fresh';
    };
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'expired': return styles.pantryItemExpired;
        case 'expiring': return styles.pantryItemExpiring;
        default: return styles.pantryItemFresh;
      }
    };

    return (
      <View style={styles.shoppingTabContainer}>
        <View style={[styles.pantryContainer, { margin: 0, marginHorizontal: theme.spacing.md, marginTop: theme.spacing.md }]}>
          <View style={styles.pantryViewHeader}>
            <View>
              <Text style={styles.pantryHeaderTitle}>My Pantry</Text>
              <Text style={styles.pantryStats}>
                {filteredItems.length} items • {pantryItems.filter(item => getExpirationStatus(item) === 'expiring').length} expiring soon
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowAddPantryModal(true)}
              style={styles.addPantryButton}
            >
              <Ionicons name="add" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive
                ]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView 
          style={styles.shoppingContainer}
          contentContainerStyle={styles.shoppingScrollContent}
        >
          {filteredItems.map(item => {
            const status = getExpirationStatus(item);
            
            return (
              <View 
                key={item.id} 
                style={[styles.pantryItemCard, getStatusColor(status)]}
              >
                <View style={styles.pantryItemHeader}>
                  <Text style={styles.pantryItemName}>{item.name}</Text>
                  <View style={styles.pantryItemCategory}>
                    <Text style={styles.pantryItemCategoryText}>
                      {item.category}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.pantryItemDetails}>
                  <View>
                    <Text style={styles.pantryItemAmount}>
                      {item.amount} {item.unit}
                    </Text>
                    {item.location && (
                      <Text style={styles.pantryItemLocation}>
                        📍 {item.location}
                      </Text>
                    )}
                  </View>
                  
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity 
                      onPress={() => handleRemovePantryItem(item.id)}
                      style={styles.removePantryButton}
                    >
                      <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                    </TouchableOpacity>
                    {item.expirationDate && (
                      <Text style={[
                        styles.expirationDate,
                        status === 'expired' && { color: theme.colors.error },
                        status === 'expiring' && { color: theme.colors.warning }
                      ]}>
                        {status === 'expired' ? '⚠️ Expired' : 
                         status === 'expiring' ? '⏰ Expires soon' :
                         `Expires ${new Date(item.expirationDate).toLocaleDateString()}`}
                      </Text>
                    )}
                    <Text style={styles.pantryItemLocation}>
                      Added {new Date(item.dateAdded).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
          
          {filteredItems.length === 0 && (
            <View style={[styles.nutritionCard, { alignItems: 'center', padding: theme.spacing.xl }]}>
              <Ionicons name="basket-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.nutritionTitle, { marginTop: theme.spacing.md }]}>
                No items in {selectedCategory === 'all' ? 'pantry' : selectedCategory}
              </Text>
              <Text style={styles.nutritionSubtext}>
                Add items to your pantry to track what you have at home
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'calendar':
        return renderCalendarTab();
      case 'nutrition':
        return renderNutritionTab();
      case 'shopping':
        return renderShoppingTab();
      case 'pantry':
        return renderPantryTab();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal Planner</Text>
        <Text style={styles.subtitle}>
          Plan your week and track your nutrition goals
        </Text>
      </View>

      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'calendar' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('calendar')}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'calendar' && styles.tabButtonTextActive,
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'nutrition' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('nutrition')}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'nutrition' && styles.tabButtonTextActive,
            ]}
          >
            Nutrition
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'shopping' && styles.tabButtonActive]}
          onPress={() => {
            setSelectedTab('shopping');
            refreshShoppingList();
          }}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'shopping' && styles.tabButtonTextActive,
            ]}
          >
            Shopping
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'pantry' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('pantry')}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'pantry' && styles.tabButtonTextActive,
            ]}
          >
            Pantry
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
      
      {/* Add Meal Modal */}
      <Modal 
        visible={showAddMealModal} 
        animationType="slide" 
        presentationStyle={Platform.OS === 'web' ? 'overFullScreen' : 'pageSheet'}
        transparent={Platform.OS === 'web'}
      >
        <View style={Platform.OS === 'web' ? { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' } : null}>
          <View style={[styles.modalContainer, Platform.OS === 'web' && { maxWidth: 480, width: '90%', height: '80%', borderRadius: 12 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add {selectedMealType} for {selectedDateForMeal ? new Date(selectedDateForMeal + 'T12:00:00').toLocaleDateString() : ''}
              </Text>
              <TouchableOpacity onPress={() => setShowAddMealModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Select a Recipe</Text>
            {mockRecipes.map(recipe => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeOption}
                onPress={() => handleSelectRecipeForMeal(recipe.id)}
              >
                <Text style={styles.recipeOptionTitle}>{recipe.title}</Text>
                <Text style={styles.recipeOptionDetails}>
                  {recipe.cookTime + recipe.prepTime} min • {recipe.servings} servings
                </Text>
                <Text style={styles.recipeOptionNutrition}>
                  {recipe.nutritionInfo.calories} cal • {recipe.nutritionInfo.protein}g protein
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      </Modal>
      
      {/* Add Pantry Item Modal */}
      <Modal 
        visible={showAddPantryModal} 
        animationType="slide" 
        presentationStyle={Platform.OS === 'web' ? 'overFullScreen' : 'pageSheet'}
        transparent={Platform.OS === 'web'}
      >
        <View style={Platform.OS === 'web' ? { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' } : null}>
          <View style={[styles.modalContainer, Platform.OS === 'web' && { maxWidth: 480, width: '90%', height: '80%', borderRadius: 12 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Pantry Item</Text>
              <TouchableOpacity onPress={() => setShowAddPantryModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Item Name *</Text>
              <TextInput
                style={styles.textInput}
                value={newPantryItem.name}
                onChangeText={(text) => setNewPantryItem(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Chicken Breast, Pasta, etc."
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Amount *</Text>
              <TextInput
                style={styles.textInput}
                value={newPantryItem.amount}
                onChangeText={(text) => setNewPantryItem(prev => ({ ...prev, amount: text }))}
                placeholder="e.g., 2, 1.5, etc."
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Unit</Text>
              <TextInput
                style={styles.textInput}
                value={newPantryItem.unit}
                onChangeText={(text) => setNewPantryItem(prev => ({ ...prev, unit: text }))}
                placeholder="e.g., lbs, cups, pieces, etc."
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: theme.spacing.sm }}>
                {(['produce', 'dairy', 'meat', 'pantry', 'frozen', 'beverages', 'condiments', 'spices'] as const).map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      newPantryItem.category === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setNewPantryItem(prev => ({ ...prev, category }))}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      newPantryItem.category === category && styles.categoryButtonTextActive
                    ]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Expiration Date (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={newPantryItem.expirationDate}
                onChangeText={(text) => setNewPantryItem(prev => ({ ...prev, expirationDate: text }))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={newPantryItem.location}
                onChangeText={(text) => setNewPantryItem(prev => ({ ...prev, location: text }))}
                placeholder="e.g., Pantry, Fridge, Freezer"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={styles.createFormButton}
              onPress={handleAddPantryItem}
            >
              <Text style={styles.createFormButtonText}>Add to Pantry</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      </Modal>
    </View>
  );
};
