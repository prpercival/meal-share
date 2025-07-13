export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dietaryPreferences: DietaryTag[];
  cookingSpecialties: string[];
  rating: number;
  totalExchanges: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: DietaryTag[];
  nutritionInfo: NutritionInfo;
  authorId: string;
  createdAt: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export type DietaryTag = 
  | 'vegetarian' 
  | 'vegan' 
  | 'gluten-free' 
  | 'dairy-free' 
  | 'low-carb' 
  | 'keto' 
  | 'paleo' 
  | 'nut-free';

export interface MealExchange {
  id: string;
  recipeId: string;
  cookId: string;
  recipientId: string;
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'cooking' | 'ready' | 'completed' | 'cancelled';
  exchangeType: 'cook-trade' | 'cook-together';
  portionSize: number;
  pickupLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
  rating?: number;
  review?: string;
}

export interface CookingSession {
  id: string;
  recipeId: string;
  hostId: string;
  participants: string[];
  scheduledDate: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  maxParticipants: number;
  status: 'open' | 'full' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface WeeklyMealPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  plannedMeals: PlannedMeal[];
  contributionRecipe?: string;
  shoppingList: ShoppingListItem[];
}

export interface PlannedMeal {
  id: string;
  recipeId: string;
  scheduledDate: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  source: 'exchange' | 'self-cook' | 'group-cook';
  exchangeId?: string;
}

export interface ShoppingListItem {
  id: string;
  ingredient: string;
  amount: number;
  unit: string;
  recipeId: string;
  purchased: boolean;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
}

import { TextStyle } from 'react-native';
