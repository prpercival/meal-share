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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe, DietaryTag } from '../types';
import { mockRecipes } from '../data/mockData';

const dietaryFilters: DietaryTag[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'low-carb',
  'keto',
];

export const CommunityFeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const { recipes, setRecipes } = useAppContext();
  const navigation = useNavigation();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [activeFilters, setActiveFilters] = useState<DietaryTag[]>([]);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);

  useEffect(() => {
    // Load mock data
    setRecipes(mockRecipes);
  }, [setRecipes]);

  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe =>
        activeFilters.some(filter => recipe.dietaryTags.includes(filter))
      );
      setFilteredRecipes(filtered);
    }
  }, [recipes, activeFilters]);

  const toggleFilter = (filter: DietaryTag) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleClaimPortion = (recipeId: string) => {
    // Handle claiming a portion
    console.log('Claiming portion for recipe:', recipeId);
  };

  const navigateToPlanner = () => {
    navigation.navigate('Planner' as never);
  };

  const renderFilters = () => {
    const unselectedFilters = dietaryFilters.filter(filter => !activeFilters.includes(filter));
    const shouldShowMoreButton = !filtersExpanded && unselectedFilters.length > 0;

    return (
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Dietary Filters</Text>
        <View style={filtersExpanded ? styles.filtersExpanded : styles.filtersCollapsed}>
          {/* Always show selected filters first */}
          {activeFilters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, styles.filterChipActive]}
              onPress={() => toggleFilter(filter)}
            >
              <Text style={[styles.filterChipText, styles.filterChipTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* If no active filters and not expanded, show first few unselected filters */}
          {!filtersExpanded && activeFilters.length === 0 && unselectedFilters.slice(0, 3).map(filter => (
            <TouchableOpacity
              key={filter}
              style={styles.filterChip}
              onPress={() => toggleFilter(filter)}
            >
              <Text style={styles.filterChipText}>
                {filter}
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
                {filter}
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
                  ? `+${unselectedFilters.length - 3} more`
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
      marginBottom: theme.spacing.md,
    },
    filtersTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
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

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={() => console.log('View recipe:', item.id)}
      onClaimPortion={() => handleClaimPortion(item.id)}
    />
  );

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

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
        style={styles.recipesContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
