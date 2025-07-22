import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useAppContext } from '../context/AppContext';
import { AvailableMealCard } from '../components/AvailableMealCard';
import { SharedRecipeCard } from '../components/SharedRecipeCard';
import { Recipe, DietaryTag, User, AvailableMealExchange, SharedRecipe } from '../types';
import { 
  mockRecipes, 
  mockUsers, 
  mockPotentialFriends,
  getAvailableMealExchanges, 
  getSharedRecipes,
  addRecipeToSchedule,
  DIETARY_PREFERENCES
} from '../data/mockData';

const dietaryFilters: DietaryTag[] = [...DIETARY_PREFERENCES];

export const CommunityFeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showSuccess, showError, showInfo } = useSnackbar();
  const { recipes, setRecipes, currentUser } = useAppContext();
  const navigation = useNavigation();
  const [availableMeals, setAvailableMeals] = useState<AvailableMealExchange[]>([]);
  const [sharedRecipes, setSharedRecipes] = useState<SharedRecipe[]>([]);
  const [activeFilters, setActiveFilters] = useState<DietaryTag[]>([]);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);

  useEffect(() => {
    // Load mock data
    setRecipes(mockRecipes);
    setAvailableMeals(getAvailableMealExchanges());
    setSharedRecipes(getSharedRecipes());
  }, [setRecipes]);

  // Separate effect for updating filters when user preferences change
  useEffect(() => {
    // Auto-select user's dietary preferences as filters
    if (currentUser?.dietaryPreferences) {
      const userPreferences = currentUser.dietaryPreferences.filter(pref => 
        dietaryFilters.includes(pref as DietaryTag)
      );
      setActiveFilters(userPreferences as DietaryTag[]);
    } else {
      setActiveFilters([]);
    }
  }, [currentUser?.dietaryPreferences]);

  const toggleFilter = (filter: DietaryTag) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleClaimPortion = (exchangeId: string) => {
    // The AvailableMealCard component already handles the claiming logic
    // This callback is just for refreshing the UI
    showInfo('Available meals refreshed');
    // Refresh the available meals to reflect updated portion counts
    setAvailableMeals(getAvailableMealExchanges());
  };

  const handleAddToSchedule = (recipeId: string, scheduledDate: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const success = addRecipeToSchedule(recipeId, scheduledDate, mealType);
    if (success) {
      const recipe = mockRecipes.find(r => r.id === recipeId);
      const dateString = new Date(scheduledDate).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      showSuccess(
        `${recipe?.title || 'Recipe'} scheduled for ${mealType} on ${dateString}!`,
        {
          label: 'View Calendar',
          onPress: () => {
            (navigation as any).navigate('Planner');
          }
        }
      );
    } else {
      showError('Unable to add recipe to schedule.');
    }
  };

  const getUserById = (userId: string): User => {
    return mockUsers.find(user => user.id === userId) || 
           mockPotentialFriends.find(user => user.id === userId) || 
           mockUsers[0];
  };

  const getRecipeById = (recipeId: string): Recipe => {
    return mockRecipes.find(recipe => recipe.id === recipeId) || mockRecipes[0];
  };

  // Filter available meals based on dietary filters
  const filteredAvailableMeals = activeFilters.length === 0 
    ? availableMeals 
    : availableMeals.filter(meal => {
        const recipe = getRecipeById(meal.recipeId);
        return activeFilters.some(filter => recipe.dietaryTags.includes(filter));
      });

  // Filter shared recipes based on dietary filters
  const filteredSharedRecipes = activeFilters.length === 0 
    ? sharedRecipes 
    : sharedRecipes.filter(sharedRecipe => {
        const recipe = getRecipeById(sharedRecipe.recipeId);
        return activeFilters.some(filter => recipe.dietaryTags.includes(filter));
      });

  const navigateToPlanner = () => {
    navigation.navigate('Planner' as never);
  };

  const renderFilters = () => {
    const unselectedFilters = dietaryFilters.filter(filter => !activeFilters.includes(filter));
    const shouldShowMoreButton = !filtersExpanded && unselectedFilters.length > 0;

    return (
      <View style={styles.filtersContainer}>
        <View style={styles.filtersHeader}>
          <Text style={styles.filtersTitle}>Dietary Filters</Text>
          {activeFilters.length > 0 && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => setActiveFilters([])}
            >
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* {currentUser?.dietaryPreferences && currentUser.dietaryPreferences.length > 0 && activeFilters.length === 0 && (
          <Text style={styles.filtersSubtitle}>
            💡 We've pre-selected your dietary preferences. Tap filters to customize.
          </Text>
        )} */}
        
        <View style={filtersExpanded ? styles.filtersExpanded : styles.filtersCollapsed}>
          {/* Always show selected filters first */}
          {activeFilters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, styles.filterChipActive]}
              onPress={() => toggleFilter(filter)}
            >
              <Text style={[styles.filterChipText, styles.filterChipTextActive]}>
                {filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* If no active filters and not expanded, show first few unselected filters */}
          {!filtersExpanded && activeFilters.length === 0 && unselectedFilters.slice(0, 2).map(filter => (
            <TouchableOpacity
              key={filter}
              style={styles.filterChip}
              onPress={() => toggleFilter(filter)}
            >
              <Text style={styles.filterChipText}>
                {filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Show unselected filters only when expanded */}
          {filtersExpanded && unselectedFilters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={styles.filterChip}
              onPress={() => toggleFilter(filter)}
            >
              <Text style={styles.filterChipText}>
                {filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Show more button logic */}
          {shouldShowMoreButton && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setFiltersExpanded(true)}
            >
              <Text style={styles.showMoreButtonText}>
                {activeFilters.length === 0 
                  ? `+${unselectedFilters.length - 2} more`
                  : `+${unselectedFilters.length} more`
                }
              </Text>
            </TouchableOpacity>
          )}
          
          {filtersExpanded && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setFiltersExpanded(false)}
            >
              <Text style={styles.showMoreButtonText}>
                Show less
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    filtersContainer: {
      paddingHorizontal: theme.spacing.md,
      //marginBottom: theme.spacing.md,
    },
    filtersHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    filtersTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
    },
    filtersSubtitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      fontStyle: 'italic',
    },
    clearFiltersButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    clearFiltersText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    filtersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    filterChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primary,
    },
    filterChipText: {
      ...theme.typography.caption,
      color: theme.colors.primary,
      textTransform: 'capitalize',
    },
    filterChipTextActive: {
      color: 'white',
    },
    filtersCollapsed: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    filtersExpanded: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    showMoreButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    showMoreButtonText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    recipesContainer: {
      flex: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    sectionSubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    emptySection: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    weeklyCalendarButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: 8,
    },
    calendarButtonText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
  });

  const renderAvailableMeal = ({ item }: { item: AvailableMealExchange }) => {
    const recipe = getRecipeById(item.recipeId);
    const cook = getUserById(item.cookId);
    return (
      <AvailableMealCard
        exchange={item}
        recipe={recipe}
        cook={cook}
        onClaimPortion={handleClaimPortion}
      />
    );
  };

  const renderSharedRecipe = ({ item }: { item: SharedRecipe }) => {
    const recipe = getRecipeById(item.recipeId);
    const sharedBy = getUserById(item.sharedBy);
    return (
      <SharedRecipeCard
        sharedRecipe={item}
        recipe={recipe}
        sharedBy={sharedBy}
        onAddToSchedule={handleAddToSchedule}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Feed</Text>
        <Text style={styles.subtitle}>
          Discover and share meals with your neighbors
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.weeklyCalendarButton}
        onPress={navigateToPlanner}
      >
        <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.calendarButtonText}>
          View This Week's Meal Calendar
        </Text>
      </TouchableOpacity>

      {renderFilters()}

      <ScrollView style={styles.recipesContainer} showsVerticalScrollIndicator={false}>
        {/* Available Meals Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="restaurant" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Available Meals</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Claim portions from meals your neighbors are cooking
        </Text>
        
        {filteredAvailableMeals.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>
              No available meals match your filters. Check back later!
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredAvailableMeals}
            renderItem={renderAvailableMeal}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}

        {/* Shared Recipes Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="book" size={24} color={theme.colors.secondary} />
          <Text style={styles.sectionTitle}>Shared Recipes</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Discover new recipes from your community and add them to your schedule
        </Text>
        
        {filteredSharedRecipes.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>
              No shared recipes match your filters.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredSharedRecipes}
            renderItem={renderSharedRecipe}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
};
