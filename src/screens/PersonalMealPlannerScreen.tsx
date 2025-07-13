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

  useEffect(() => {
    // Generate current week
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        meals: [], // Would be populated from weeklyPlan
      };
    });
    setWeekDays(days);
  }, []);

  const mockNutrition: NutritionInfo = {
    calories: 1850,
    protein: 95,
    carbs: 210,
    fat: 65,
    fiber: 28,
  };

  const mockShoppingList: ShoppingListItem[] = [
    { id: '1', ingredient: 'Quinoa', amount: 2, unit: 'cups', recipeId: '1', purchased: false },
    { id: '2', ingredient: 'Cherry tomatoes', amount: 1, unit: 'lb', recipeId: '1', purchased: true },
    { id: '3', ingredient: 'Brown rice', amount: 3, unit: 'cups', recipeId: '2', purchased: false },
    { id: '4', ingredient: 'Lentils', amount: 2, unit: 'cans', recipeId: '3', purchased: false },
  ];

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
    shoppingContainer: {
      paddingHorizontal: theme.spacing.md,
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
      marginTop: theme.spacing.md,
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
                {new Date(day.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          {mealTimes.map(mealTime => (
            <View key={mealTime} style={styles.mealSlot}>
              <Text style={styles.mealTime}>{mealTime}</Text>
              <View style={styles.mealContent}>
                {/* Mock meal data - would come from weeklyPlan */}
                {index === 1 && mealTime === 'Lunch' ? (
                  <View>
                    <Text style={styles.mealName}>Mediterranean Quinoa Bowl</Text>
                    <Text style={styles.mealSource}>From Sarah J. (Exchange)</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addMealButton}>
                    <Text style={styles.addMealText}>+ Add Meal</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );

  const renderNutritionTab = () => (
    <ScrollView style={styles.nutritionContainer}>
      <View style={styles.nutritionCard}>
        <Text style={styles.nutritionTitle}>Daily Nutrition Goals</Text>
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{mockNutrition.calories}</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{mockNutrition.protein}g</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{mockNutrition.carbs}g</Text>
            <Text style={styles.nutritionLabel}>Carbs</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{mockNutrition.fat}g</Text>
            <Text style={styles.nutritionLabel}>Fat</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderShoppingTab = () => (
    <ScrollView style={styles.shoppingContainer}>
      {mockShoppingList.map(item => (
        <TouchableOpacity key={item.id} style={styles.shoppingItem}>
          <View style={[styles.checkbox, item.purchased && styles.checkboxChecked]}>
            {item.purchased && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
          <View style={styles.shoppingItemText}>
            <Text style={styles.shoppingItemName}>{item.ingredient}</Text>
            <Text style={styles.shoppingItemAmount}>
              {item.amount} {item.unit}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.generateButton}>
        <Text style={styles.generateButtonText}>Generate Shopping List</Text>
      </TouchableOpacity>
    </ScrollView>
  );

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
