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
import { PlannedMeal, ShoppingListItem, NutritionInfo } from '../types';
import { mockRecipes, getCurrentUserPlannedMeals, getCurrentUserShoppingList } from '../data/mockData';

interface WeekDay {
  date: string;
  dayName: string;
  meals: PlannedMeal[];
}

export const PersonalMealPlannerScreen: React.FC = () => {
  const { theme } = useTheme();
  const { weeklyPlan, setWeeklyPlan } = useAppContext();
  const [selectedTab, setSelectedTab] = useState<'calendar' | 'nutrition' | 'shopping'>('calendar');
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

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
  }, []);

  // Nutrition goals (daily targets)
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
    setShoppingList(prevList =>
      prevList.map(item =>
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      )
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
    shoppingProgressContainer: {
      alignItems: 'center',
      width: '100%',
    },
    shoppingProgressBar: {
      width: '100%',
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      marginTop: theme.spacing.xs,
      overflow: 'hidden',
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
                  if (index === 1 && mealTime === 'Lunch') {
                    return (
                      <View>
                        <Text style={styles.mealName}>Mediterranean Quinoa Bowl</Text>
                        <Text style={styles.mealSource}>From Preston P. (Exchange)</Text>
                      </View>
                    );
                  }
                  
                  return (
                    <TouchableOpacity style={styles.addMealButton}>
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
      },
      {
        key: 'protein',
        label: 'Protein', 
        current: currentNutrition.protein,
        goal: nutritionGoals.protein,
        unit: 'g',
      },
      {
        key: 'carbs',
        label: 'Carbs',
        current: currentNutrition.carbs, 
        goal: nutritionGoals.carbs,
        unit: 'g',
      },
      {
        key: 'fat',
        label: 'Fat',
        current: currentNutrition.fat,
        goal: nutritionGoals.fat,
        unit: 'g',
      },
    ];

    return (
      <ScrollView style={styles.nutritionContainer}>
        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Today's Nutrition Progress</Text>
          <View style={styles.nutritionGrid}>
            {nutritionItems.map(item => {
              const progress = Math.min(item.current / item.goal, 1);
              const isOverGoal = item.current > item.goal;
              const remaining = Math.max(item.goal - item.current, 0);
              
              return (
                <View key={item.key} style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {Math.round(item.current)}{item.unit}
                  </Text>
                  <Text style={styles.nutritionLabel}>{item.label}</Text>
                  <View style={styles.nutritionProgress}>
                    <View 
                      style={[
                        styles.nutritionProgressBar,
                        isOverGoal && styles.nutritionProgressOverflow,
                        { width: `${Math.min(progress * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.nutritionSubtext}>
                    {isOverGoal 
                      ? `${Math.round(item.current - item.goal)}${item.unit} over`
                      : `${Math.round(remaining)}${item.unit} left`
                    }
                  </Text>
                </View>
              );
            })}
          </View>
          
          {plannedMeals.filter(meal => meal.scheduledDate === new Date().toISOString().split('T')[0]).length > 0 && (
            <View style={{ marginTop: theme.spacing.lg }}>
              <Text style={[styles.nutritionLabel, { marginBottom: theme.spacing.sm }]}>
                Today's Planned Meals:
              </Text>
              {plannedMeals.filter(meal => meal.scheduledDate === new Date().toISOString().split('T')[0]).map(meal => {
                const recipe = mockRecipes.find(r => r.id === meal.recipeId);
                return recipe ? (
                  <View key={meal.id} style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    marginBottom: theme.spacing.xs,
                  }}>
                    <Text style={styles.nutritionSubtext}>
                      {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}: {recipe.title}
                    </Text>
                    <Text style={styles.nutritionSubtext}>
                      {recipe.nutritionInfo.calories} cal
                    </Text>
                  </View>
                ) : null;
              })}
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderShoppingTab = () => {
    const completedItems = shoppingList.filter(item => item.purchased).length;
    const totalItems = shoppingList.length;
    const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    return (
      <View style={styles.shoppingTabContainer}>
        <ScrollView 
          style={styles.shoppingContainer}
          contentContainerStyle={styles.shoppingScrollContent}
        >
          {/* Shopping Progress Card */}
          <View style={styles.nutritionCard}>
            <View style={styles.shoppingProgressContainer}>
              <Text style={styles.nutritionValue}>
                {completedItems}/{totalItems}
              </Text>
              <Text style={styles.nutritionLabel}>Items Completed</Text>
              <View style={styles.shoppingProgressBar}>
                <View 
                  style={[
                    styles.nutritionProgressBar,
                    { width: `${completionPercentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.nutritionSubtext}>
                {Math.round(completionPercentage)}% Complete
              </Text>
            </View>
          </View>

          {/* Shopping List Items */}
          {shoppingList.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.shoppingItem}
              onPress={() => toggleShoppingItem(item.id)}
            >
              <View style={[styles.checkbox, item.purchased && styles.checkboxChecked]}>
                {item.purchased && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View style={styles.shoppingItemText}>
                <Text style={[
                  styles.shoppingItemName,
                  item.purchased && { textDecorationLine: 'line-through', opacity: 0.6 }
                ]}>
                  {item.ingredient}
                </Text>
                <Text style={[
                  styles.shoppingItemAmount,
                  item.purchased && { opacity: 0.6 }
                ]}>
                  {item.amount} {item.unit}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Fixed Generate Button */}
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity style={styles.generateButton}>
            <Text style={styles.generateButtonText}>Generate Shopping List</Text>
          </TouchableOpacity>
        </View>
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
          onPress={() => setSelectedTab('shopping')}
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
      </View>

      {renderContent()}
    </View>
  );
};
