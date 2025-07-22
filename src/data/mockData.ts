import { User, Recipe, MealExchange, CookingSession, PlannedMeal, ShoppingListItem, PantryItem, DietaryTag, CookingSpecialtyTag } from '../types';

// Centralized dietary preferences dictionary
export const DIETARY_PREFERENCES = [
  'vegetarian',
  'vegan', 
  'gluten-free',
  'dairy-free',
  'keto',
  'low-carb',
  'paleo',
  'mediterranean',
  'nut-free',
  'shellfish-free',
  'egg-free',
  'pescatarian',
  'halal',
  'kosher',
  'raw-food',
  'soy-free'
] as const;

export type DietaryPreference = typeof DIETARY_PREFERENCES[number];

// Centralized cooking specialties dictionary
export const COOKING_SPECIALTIES = [
  'Italian',
  'Mediterranean',
  'Asian',
  'Chinese',
  'Japanese',
  'Korean',
  'Thai',
  'Indian',
  'Mexican',
  'French',
  'German',
  'European',
  'American',
  'Southern',
  'BBQ',
  'Grilling',
  'Baking',
  'Pastry',
  'Desserts',
  'Bread',
  'Pizza',
  'Pasta',
  'Seafood',
  'Vegetarian',
  'Vegan',
  'Plant-based',
  'Raw Food',
  'Fusion',
  'Street Food',
  'Comfort Food',
  'Healthy',
  'Quick Meals',
  'Slow Cooking',
  'Pressure Cooking',
  'Air Frying',
  'Fermentation',
  'Pickling',
  'Smoking',
  'Canning',
  'Meal Prep',
  'Kid-Friendly',
  'Holiday Cooking',
  'Breakfast',
  'Brunch',
  'Soup',
  'Salads',
  'Smoothie Bowls'
] as const;

export type CookingSpecialty = typeof COOKING_SPECIALTIES[number];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Preston Percival',
    email: 'ppercival3@gatech.edu',
    avatar: require('../../assets/avatars/preston.jpg'),
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main St, New York, NY',
    },
    dietaryPreferences: [] as DietaryTag[],
    cookingSpecialties: ['Italian', 'Mediterranean'] as CookingSpecialtyTag[],
    rating: 4.8,
    totalExchanges: 25,
    bio: 'Passionate home cook who loves sharing healthy Mediterranean recipes. Always excited to try new cuisines and meet fellow food enthusiasts!',
    joinedDate: '2023-03-15',
    favoriteRecipes: ['1', '3'],
    cookingLevel: 'Advanced',
  },
  {
    id: '2',
    name: 'Bradley Van Egeren',
    email: 'begeren3@gatech.edu',
    avatar: require('../../assets/avatars/brad.jpg'),
    location: {
      latitude: 40.7580,
      longitude: -73.9855,
      address: '456 Oak Ave, New York, NY',
    },
    dietaryPreferences: ['dairy-free'] as DietaryTag[],
    cookingSpecialties: ['Asian', 'Fusion'] as CookingSpecialtyTag[],
    rating: 4.6,
    totalExchanges: 18,
    bio: 'Love experimenting with Asian fusion dishes. Specializing in dairy-free alternatives that don\'t compromise on flavor!',
    joinedDate: '2023-05-22',
    favoriteRecipes: ['2'],
    cookingLevel: 'Intermediate',
  },
  {
    id: '3',
    name: 'Andrew Fitton',
    email: 'afitton3@gatech.edu',
    avatar: require('../../assets/avatars/drew.jpg'),
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    dietaryPreferences: ['vegan'] as DietaryTag[],
    cookingSpecialties: ['Mexican', 'Plant-based'] as CookingSpecialtyTag[],
    rating: 4.9,
    totalExchanges: 32,
    bio: 'Plant-based chef focused on creating delicious vegan versions of classic dishes. Let\'s prove that vegan food can be incredibly satisfying!',
    joinedDate: '2023-01-10',
    favoriteRecipes: ['1', '2'],
    cookingLevel: 'Expert',
  },
  {
    id: '4',
    name: 'Jan Roessler',
    email: 'jroessler3@gatech.edu',
    avatar: require('../../assets/avatars/jan.jpg'),
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    dietaryPreferences: ['keto', 'low-carb'] as DietaryTag[],
    cookingSpecialties: ['German', 'European'] as CookingSpecialtyTag[],
    rating: 4.7,
    totalExchanges: 28,
    bio: 'Traditional German cooking with a modern low-carb twist. Love sharing hearty, satisfying meals that fit a healthy lifestyle.',
    joinedDate: '2023-02-28',
    favoriteRecipes: ['3'],
    cookingLevel: 'Advanced',
  },
  {
    id: '5',
    name: 'Sidhartha Chakravarty',
    email: 'sidhartha.chakravarty@gatech.edu',
    avatar: require('../../assets/avatars/sid.jpg'),
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    dietaryPreferences: ['vegetarian'] as DietaryTag[],
    cookingSpecialties: ['Indian', 'Street Food'] as CookingSpecialtyTag[],
    rating: 4.9,
    totalExchanges: 35,
    bio: 'Authentic Indian cuisine enthusiast. I love introducing people to the complex flavors and spices of traditional Indian cooking.',
    joinedDate: '2022-12-05',
    favoriteRecipes: ['1', '2', '3'],
    cookingLevel: 'Expert',
  },
];

// Additional users for search functionality
export const mockPotentialFriends: User[] = [
  {
    id: '6',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '321 Elm St, New York, NY',
    },
    dietaryPreferences: ['gluten-free'] as DietaryTag[],
    cookingSpecialties: ['French', 'Baking'] as CookingSpecialtyTag[],
    rating: 4.5,
    totalExchanges: 15,
    bio: 'French pastry enthusiast with a focus on gluten-free baking. Love creating beautiful desserts that everyone can enjoy!',
    joinedDate: '2023-06-12',
    favoriteRecipes: [],
    cookingLevel: 'Advanced',
  },
  {
    id: '7',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: '654 Maple Ave, New York, NY',
    },
    dietaryPreferences: [] as DietaryTag[],
    cookingSpecialties: ['Chinese', 'Asian'] as CookingSpecialtyTag[],
    rating: 4.7,
    totalExchanges: 22,
    bio: 'Authentic Szechuan cuisine specialist. I bring the heat and bold flavors of traditional Chinese cooking to the neighborhood!',
    joinedDate: '2023-04-08',
    favoriteRecipes: [],
    cookingLevel: 'Expert',
  },
  {
    id: '8',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
    location: {
      latitude: 40.7489,
      longitude: -73.9680,
      address: '987 Cedar Rd, New York, NY',
    },
    dietaryPreferences: ['vegan', 'gluten-free'] as DietaryTag[],
    cookingSpecialties: ['Raw Food', 'Smoothie Bowls'] as CookingSpecialtyTag[],
    rating: 4.8,
    totalExchanges: 19,
    bio: 'Raw food and smoothie bowl artist. Passionate about nutrient-dense, colorful meals that nourish both body and soul.',
    joinedDate: '2023-07-03',
    favoriteRecipes: [],
    cookingLevel: 'Intermediate',
  },
  {
    id: '9',
    name: 'David Martinez',
    email: 'david.martinez@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    location: {
      latitude: 40.7516,
      longitude: -73.9755,
      address: '159 Oak Street, New York, NY',
    },
    dietaryPreferences: ['keto'] as DietaryTag[],
    cookingSpecialties: ['BBQ', 'Grilling'] as CookingSpecialtyTag[],
    rating: 4.6,
    totalExchanges: 31,
    bio: 'BBQ master and grilling enthusiast. Specializing in keto-friendly smoked meats and low-carb sides that pack incredible flavor.',
    joinedDate: '2023-03-20',
    favoriteRecipes: [],
    cookingLevel: 'Advanced',
  },
];

// Friends relationship data
export const mockFriendships: Record<string, string[]> = {
  '1': ['2', '3', '4', '5'], // Preston's friends
  '2': ['1', '3', '5'],      // Bradley's friends
  '3': ['1', '2', '4'],      // Andrew's friends
  '4': ['1', '3', '5'],      // Jan's friends
  '5': ['1', '2', '4'],      // Sidhartha's friends
};

// Helper functions for friend management
export const getCurrentUserFriends = (): User[] => {
  const friendIds = mockFriendships[currentUser.id] || [];
  return mockUsers.filter(user => friendIds.includes(user.id));
};

export const getPotentialFriends = (): User[] => {
  const friendIds = mockFriendships[currentUser.id] || [];
  const allNonFriends = [...mockUsers, ...mockPotentialFriends].filter(
    user => user.id !== currentUser.id && !friendIds.includes(user.id)
  );
  return allNonFriends;
};

// Shared recipes - recipes people want to share for others to cook
export interface SharedRecipe {
  id: string;
  recipeId: string;
  sharedBy: string;
  sharedDate: string;
  personalNotes?: string;
  tags: string[];
  isRecommended?: boolean;
}

export const mockSharedRecipes: SharedRecipe[] = [
  {
    id: 'sr1',
    recipeId: '1', // Mediterranean Quinoa Bowl
    sharedBy: '4', // Jan
    sharedDate: '2025-07-19',
    personalNotes: 'This is my go-to healthy lunch! I add extra feta and olives.',
    tags: ['healthy', 'quick', 'vegetarian'],
    isRecommended: true,
  },
  {
    id: 'sr2',
    recipeId: '2', // Korean Kimchi Fried Rice
    sharedBy: '2', // Bradley
    sharedDate: '2025-07-18',
    personalNotes: 'Perfect for using up leftover rice. Add a fried egg on top!',
    tags: ['leftover-friendly', 'spicy', 'asian'],
  },
  {
    id: 'sr3',
    recipeId: '3', // Italian Carbonara
    sharedBy: '5', // Sidhartha
    sharedDate: '2025-07-17',
    personalNotes: 'Took me a few tries to get right, but worth it! Don\'t rush the egg mixing.',
    tags: ['italian', 'pasta', 'comfort-food'],
    isRecommended: true,
  },
  {
    id: 'sr4',
    recipeId: '4', // Thai Green Curry with Vegetables
    sharedBy: '2', // Bradley
    sharedDate: '2025-07-16',
    personalNotes: 'Love the fresh flavors! I use extra Thai basil and serve with jasmine rice.',
    tags: ['thai', 'curry', 'dairy-free', 'vegetables'],
    isRecommended: true,
  },
  {
    id: 'sr5',
    recipeId: '5', // Vegan Buddha Bowl
    sharedBy: '3', // Andrew
    sharedDate: '2025-07-15',
    personalNotes: 'My favorite post-workout meal! The tahini dressing is incredible.',
    tags: ['vegan', 'healthy', 'plant-based', 'protein-rich'],
    isRecommended: true,
  },
  {
    id: 'sr6',
    recipeId: '6', // Keto Bacon-Wrapped Chicken Thighs
    sharedBy: '4', // Jan
    sharedDate: '2025-07-14',
    personalNotes: 'Perfect for my keto lifestyle! I serve with roasted brussels sprouts.',
    tags: ['keto', 'low-carb', 'protein', 'bacon'],
  },
  {
    id: 'sr7',
    recipeId: '7', // Indian Chickpea Curry (Chana Masala)
    sharedBy: '5', // Sidhartha
    sharedDate: '2025-07-13',
    personalNotes: 'My grandmother\'s recipe! The secret is slow-cooking the onions first.',
    tags: ['indian', 'vegan', 'spices', 'comfort-food'],
    isRecommended: true,
  },
  {
    id: 'sr8',
    recipeId: '8', // Classic French Ratatouille
    sharedBy: '6', // Emma Wilson
    sharedDate: '2025-07-12',
    personalNotes: 'Learned this in culinary school. Great way to use up summer vegetables!',
    tags: ['french', 'vegetarian', 'summer', 'mediterranean'],
  },
  {
    id: 'sr9',
    recipeId: '9', // Mexican Street Corn Salad (Esquites)
    sharedBy: '7', // Michael Chen
    sharedDate: '2025-07-11',
    personalNotes: 'Reminds me of street food from my travels! Great for BBQ parties.',
    tags: ['mexican', 'street-food', 'corn', 'party-food'],
    isRecommended: true,
  },
  {
    id: 'sr10',
    recipeId: '10', // Moroccan Lamb Tagine
    sharedBy: '9', // David Martinez
    sharedDate: '2025-07-10',
    personalNotes: 'Slow-cooked perfection! I use my cast iron Dutch oven instead of a tagine.',
    tags: ['moroccan', 'lamb', 'slow-cooked', 'aromatic'],
  },
  {
    id: 'sr11',
    recipeId: '11', // Japanese Miso Ramen
    sharedBy: '5', // Sidhartha
    sharedDate: '2025-07-09',
    personalNotes: 'Homemade ramen is so much better! I make extra broth and freeze it.',
    tags: ['japanese', 'ramen', 'comfort-food', 'soup'],
    isRecommended: true,
  },
  {
    id: 'sr12',
    recipeId: '12', // Paleo Zucchini Lasagna
    sharedBy: '8', // Sarah Johnson
    sharedDate: '2025-07-08',
    personalNotes: 'You won\'t miss the pasta! I add extra herbs for flavor.',
    tags: ['paleo', 'gluten-free', 'healthy', 'vegetables'],
  },
];

// Helper functions for shared recipes
export const getSharedRecipes = (): SharedRecipe[] => {
  return mockSharedRecipes;
};

export const addRecipeToSchedule = (recipeId: string, scheduledDate: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): boolean => {
  // Create a new planned meal
  const newPlannedMeal: PlannedMeal = {
    id: Date.now().toString(),
    recipeId,
    scheduledDate,
    mealType,
    source: 'self-cook',
  };
  
  // Add to current user's planned meals
  if (!mockPlannedMealsByUser[currentUser.id]) {
    mockPlannedMealsByUser[currentUser.id] = [];
  }
  mockPlannedMealsByUser[currentUser.id].push(newPlannedMeal);
  return true;
};

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Mediterranean Quinoa Bowl',
    description: 'A healthy and colorful quinoa bowl packed with Mediterranean flavors',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    ingredients: [
      { name: 'Quinoa', amount: 2, unit: 'cups' },
      { name: 'Cherry tomatoes', amount: 1, unit: 'cup' },
      { name: 'Cucumber', amount: 1, unit: 'large' },
      { name: 'Red onion', amount: 0.5, unit: 'medium' },
      { name: 'Feta cheese', amount: 0.5, unit: 'cup' },
      { name: 'Olive oil', amount: 3, unit: 'tbsp' },
      { name: 'Lemon juice', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Dice cucumber and red onion',
      'Halve cherry tomatoes',
      'Mix olive oil and lemon juice for dressing',
      'Combine all ingredients in a bowl',
      'Top with feta cheese and serve',
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['vegetarian', 'gluten-free', 'mediterranean'],
    nutritionInfo: {
      calories: 320,
      protein: 8,
      carbs: 28,
      fat: 18,
      fiber: 3,
    },
    authorId: '1',
    createdAt: '2025-07-23',
  },
  {
    id: '2',
    title: 'Spicy Korean Kimchi Fried Rice',
    description: 'A flavorful and spicy fried rice made with fermented kimchi',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    ingredients: [
      { name: 'Cooked rice', amount: 3, unit: 'cups' },
      { name: 'Kimchi', amount: 1, unit: 'cup' },
      { name: 'Eggs', amount: 2, unit: 'large' },
      { name: 'Green onions', amount: 3, unit: 'stalks' },
      { name: 'Sesame oil', amount: 2, unit: 'tbsp' },
      { name: 'Soy sauce', amount: 2, unit: 'tbsp' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
    ],
    instructions: [
      'Heat sesame oil in a large pan',
      'Add minced garlic and cook until fragrant',
      'Add kimchi and cook for 2-3 minutes',
      'Add cold rice and stir-fry for 5 minutes',
      'Push rice to one side, scramble eggs on the other',
      'Mix everything together with soy sauce',
      'Garnish with chopped green onions',
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'Medium',
    dietaryTags: ['dairy-free'],
    nutritionInfo: {
      calories: 420,
      protein: 12,
      carbs: 35,
      fat: 22,
      fiber: 2,
    },
    authorId: '2',
    createdAt: '2025-07-20',
  },
  {
    id: '3',
    title: 'Classic Italian Carbonara',
    description: 'Authentic Roman pasta dish with eggs, cheese, and pancetta',
    image: 'https://as2.ftcdn.net/v2/jpg/01/41/12/25/1000_F_141122511_X1eEXS9nH13p6TziRMEmAvPmQVCYbyWy.jpg',
    ingredients: [
      { name: 'Spaghetti', amount: 400, unit: 'g' },
      { name: 'Pancetta', amount: 150, unit: 'g' },
      { name: 'Eggs', amount: 4, unit: 'large' },
      { name: 'Pecorino Romano', amount: 100, unit: 'g' },
      { name: 'Black pepper', amount: 1, unit: 'tsp' },
      { name: 'Salt', amount: 1, unit: 'tsp' },
    ],
    instructions: [
      'Cook spaghetti in salted boiling water until al dente',
      'Fry pancetta until crispy',
      'Whisk eggs with grated cheese and black pepper',
      'Drain pasta, reserving 1 cup of pasta water',
      'Add hot pasta to pancetta pan',
      'Remove from heat, add egg mixture while tossing',
      'Add pasta water as needed for creaminess',
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['dairy-free'],
    nutritionInfo: {
      calories: 680,
      protein: 28,
      carbs: 40,
      fat: 42,
      fiber: 2,
    },
    authorId: '3',
    createdAt: '2025-07-21',
  },
  {
    id: '4',
    title: 'Thai Green Curry with Vegetables',
    description: 'Aromatic and spicy Thai curry with fresh vegetables and coconut milk',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
    ingredients: [
      { name: 'Green curry paste', amount: 3, unit: 'tbsp' },
      { name: 'Coconut milk', amount: 400, unit: 'ml' },
      { name: 'Eggplant', amount: 1, unit: 'large' },
      { name: 'Bell peppers', amount: 2, unit: 'medium' },
      { name: 'Bamboo shoots', amount: 1, unit: 'cup' },
      { name: 'Thai basil', amount: 0.5, unit: 'cup' },
      { name: 'Fish sauce', amount: 2, unit: 'tbsp' },
      { name: 'Brown sugar', amount: 1, unit: 'tbsp' },
      { name: 'Lime juice', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Heat 2 tbsp of thick coconut milk in a wok',
      'Add curry paste and fry until fragrant',
      'Add remaining coconut milk gradually',
      'Add eggplant and cook for 5 minutes',
      'Add bell peppers and bamboo shoots',
      'Season with fish sauce and sugar',
      'Simmer until vegetables are tender',
      'Garnish with Thai basil and lime juice',
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['dairy-free', 'gluten-free'],
    nutritionInfo: {
      calories: 280,
      protein: 5,
      carbs: 18,
      fat: 20,
      fiber: 4,
    },
    authorId: '2',
    createdAt: '2025-07-19',
  },
  {
    id: '5',
    title: 'Vegan Buddha Bowl',
    description: 'Nourishing bowl with quinoa, roasted vegetables, and tahini dressing',
    image: 'https://images.unsplash.com/photo-1542354255-839e272e3408?w=400',
    ingredients: [
      { name: 'Quinoa', amount: 1, unit: 'cup' },
      { name: 'Sweet potato', amount: 1, unit: 'large' },
      { name: 'Broccoli', amount: 1, unit: 'head' },
      { name: 'Chickpeas', amount: 1, unit: 'can' },
      { name: 'Avocado', amount: 1, unit: 'medium' },
      { name: 'Tahini', amount: 3, unit: 'tbsp' },
      { name: 'Lemon juice', amount: 2, unit: 'tbsp' },
      { name: 'Maple syrup', amount: 1, unit: 'tbsp' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Roast cubed sweet potato at 400°F for 25 minutes',
      'Steam broccoli until tender',
      'Rinse and drain chickpeas',
      'Whisk tahini, lemon juice, and maple syrup for dressing',
      'Arrange all ingredients in bowls',
      'Slice avocado and add to bowls',
      'Drizzle with tahini dressing',
    ],
    prepTime: 20,
    cookTime: 30,
    servings: 2,
    difficulty: 'Easy',
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'nut-free'],
    nutritionInfo: {
      calories: 380,
      protein: 12,
      carbs: 52,
      fat: 14,
      fiber: 8,
    },
    authorId: '3',
    createdAt: '2025-07-18',
  },
  {
    id: '6',
    title: 'Keto Bacon-Wrapped Chicken Thighs',
    description: 'Juicy chicken thighs wrapped in crispy bacon, perfect for keto diet',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
    ingredients: [
      { name: 'Chicken thighs', amount: 6, unit: 'pieces' },
      { name: 'Bacon strips', amount: 12, unit: 'pieces' },
      { name: 'Garlic powder', amount: 1, unit: 'tsp' },
      { name: 'Paprika', amount: 1, unit: 'tsp' },
      { name: 'Black pepper', amount: 0.5, unit: 'tsp' },
      { name: 'Salt', amount: 0.5, unit: 'tsp' },
      { name: 'Thyme', amount: 1, unit: 'tsp' },
    ],
    instructions: [
      'Preheat oven to 425°F',
      'Season chicken thighs with spices',
      'Wrap each thigh with 2 bacon strips',
      'Secure with toothpicks if needed',
      'Place on baking sheet',
      'Bake for 25-30 minutes until bacon is crispy',
      'Let rest for 5 minutes before serving',
    ],
    prepTime: 10,
    cookTime: 30,
    servings: 6,
    difficulty: 'Easy',
    dietaryTags: ['keto', 'low-carb', 'gluten-free', 'dairy-free'],
    nutritionInfo: {
      calories: 520,
      protein: 35,
      carbs: 2,
      fat: 40,
      fiber: 0,
    },
    authorId: '4',
    createdAt: '2025-07-17',
  },
  {
    id: '7',
    title: 'Indian Chickpea Curry (Chana Masala)',
    description: 'Authentic spiced chickpea curry with tomatoes and aromatic spices',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    ingredients: [
      { name: 'Chickpeas', amount: 2, unit: 'cans' },
      { name: 'Onion', amount: 1, unit: 'large' },
      { name: 'Tomatoes', amount: 2, unit: 'large' },
      { name: 'Ginger', amount: 1, unit: 'inch piece' },
      { name: 'Garlic', amount: 4, unit: 'cloves' },
      { name: 'Cumin seeds', amount: 1, unit: 'tsp' },
      { name: 'Coriander powder', amount: 2, unit: 'tsp' },
      { name: 'Turmeric', amount: 1, unit: 'tsp' },
      { name: 'Garam masala', amount: 1, unit: 'tsp' },
      { name: 'Coconut oil', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Heat oil and add cumin seeds',
      'Add chopped onions and cook until golden',
      'Add ginger-garlic paste and cook for 2 minutes',
      'Add chopped tomatoes and spices',
      'Cook until tomatoes break down',
      'Add drained chickpeas and 1 cup water',
      'Simmer for 15 minutes',
      'Garnish with fresh cilantro',
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free'],
    nutritionInfo: {
      calories: 240,
      protein: 10,
      carbs: 38,
      fat: 6,
      fiber: 9,
    },
    authorId: '5',
    createdAt: '2025-07-16',
  },
  {
    id: '8',
    title: 'Classic French Ratatouille',
    description: 'Traditional Provençal vegetable stew with herbs and olive oil',
    image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=400',
    ingredients: [
      { name: 'Eggplant', amount: 1, unit: 'large' },
      { name: 'Zucchini', amount: 2, unit: 'medium' },
      { name: 'Bell peppers', amount: 2, unit: 'medium' },
      { name: 'Tomatoes', amount: 4, unit: 'large' },
      { name: 'Onion', amount: 1, unit: 'large' },
      { name: 'Garlic', amount: 4, unit: 'cloves' },
      { name: 'Olive oil', amount: 4, unit: 'tbsp' },
      { name: 'Thyme', amount: 2, unit: 'tsp' },
      { name: 'Basil', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Dice all vegetables into 1-inch pieces',
      'Heat olive oil in a large pot',
      'Sauté onions until translucent',
      'Add garlic and cook for 1 minute',
      'Add eggplant and cook for 5 minutes',
      'Add peppers and zucchini',
      'Add tomatoes, thyme, and seasonings',
      'Simmer covered for 30 minutes',
      'Garnish with fresh basil',
    ],
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    difficulty: 'Easy',
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'mediterranean'],
    nutritionInfo: {
      calories: 120,
      protein: 3,
      carbs: 18,
      fat: 6,
      fiber: 6,
    },
    authorId: '1',
    createdAt: '2025-07-15',
  },
  {
    id: '9',
    title: 'Mexican Street Corn Salad (Esquites)',
    description: 'Creamy, spicy corn salad with lime, chili powder, and cotija cheese',
    image: 'https://images.unsplash.com/photo-1630748661719-875c3b7ebfb7?w=400',
    ingredients: [
      { name: 'Corn kernels', amount: 4, unit: 'cups' },
      { name: 'Mayonnaise', amount: 0.25, unit: 'cup' },
      { name: 'Sour cream', amount: 0.25, unit: 'cup' },
      { name: 'Cotija cheese', amount: 0.5, unit: 'cup' },
      { name: 'Lime juice', amount: 3, unit: 'tbsp' },
      { name: 'Chili powder', amount: 1, unit: 'tsp' },
      { name: 'Cilantro', amount: 0.25, unit: 'cup' },
      { name: 'Garlic', amount: 2, unit: 'cloves' },
    ],
    instructions: [
      'Char corn in a dry skillet until slightly blackened',
      'Mix mayonnaise, sour cream, and minced garlic',
      'Add lime juice and chili powder to mixture',
      'Toss warm corn with creamy mixture',
      'Add crumbled cotija cheese',
      'Garnish with cilantro and extra chili powder',
      'Serve immediately while warm',
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['vegetarian', 'gluten-free'],
    nutritionInfo: {
      calories: 350,
      protein: 8,
      carbs: 32,
      fat: 22,
      fiber: 4,
    },
    authorId: '2',
    createdAt: '2025-07-14',
  },
  {
    id: '10',
    title: 'Moroccan Lamb Tagine',
    description: 'Slow-cooked lamb with apricots, almonds, and warming spices',
    image: 'https://images.unsplash.com/photo-1544637115-4016d9ec2ed9?w=400',
    ingredients: [
      { name: 'Lamb shoulder', amount: 2, unit: 'lbs' },
      { name: 'Onions', amount: 2, unit: 'large' },
      { name: 'Dried apricots', amount: 1, unit: 'cup' },
      { name: 'Almonds', amount: 0.5, unit: 'cup' },
      { name: 'Cinnamon', amount: 1, unit: 'tsp' },
      { name: 'Ginger', amount: 1, unit: 'tsp' },
      { name: 'Saffron', amount: 0.25, unit: 'tsp' },
      { name: 'Beef broth', amount: 2, unit: 'cups' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Cut lamb into 2-inch pieces',
      'Brown lamb in olive oil in tagine or pot',
      'Add sliced onions and cook until soft',
      'Add spices and cook for 2 minutes',
      'Add broth and bring to boil',
      'Reduce heat, cover and simmer 1.5 hours',
      'Add apricots and cook 30 minutes more',
      'Garnish with toasted almonds',
    ],
    prepTime: 20,
    cookTime: 120,
    servings: 6,
    difficulty: 'Hard',
    dietaryTags: ['dairy-free', 'nut-free'],
    nutritionInfo: {
      calories: 420,
      protein: 32,
      carbs: 18,
      fat: 24,
      fiber: 3,
    },
    authorId: '4',
    createdAt: '2025-07-13',
  },
  {
    id: '11',
    title: 'Japanese Miso Ramen',
    description: 'Rich and savory ramen with miso broth, soft-boiled eggs, and vegetables',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    ingredients: [
      { name: 'Ramen noodles', amount: 4, unit: 'portions' },
      { name: 'Miso paste', amount: 4, unit: 'tbsp' },
      { name: 'Chicken broth', amount: 6, unit: 'cups' },
      { name: 'Eggs', amount: 4, unit: 'large' },
      { name: 'Green onions', amount: 4, unit: 'stalks' },
      { name: 'Corn kernels', amount: 1, unit: 'cup' },
      { name: 'Seaweed sheets', amount: 4, unit: 'pieces' },
      { name: 'Sesame oil', amount: 2, unit: 'tbsp' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
    ],
    instructions: [
      'Soft-boil eggs for 6-7 minutes, then ice bath',
      'Heat chicken broth in a large pot',
      'Whisk miso paste with some hot broth',
      'Add miso mixture back to pot',
      'Cook ramen noodles according to package',
      'Add sesame oil and minced garlic to broth',
      'Divide noodles among bowls',
      'Pour hot broth over noodles',
      'Top with halved eggs, corn, and green onions',
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['dairy-free'],
    nutritionInfo: {
      calories: 450,
      protein: 18,
      carbs: 55,
      fat: 16,
      fiber: 4,
    },
    authorId: '5',
    createdAt: '2025-07-12',
  },
  {
    id: '12',
    title: 'Paleo Zucchini Lasagna',
    description: 'Grain-free lasagna using zucchini slices instead of pasta',
    image: 'https://images.unsplash.com/photo-1654657639692-1cccc800046c?w=400',
    ingredients: [
      { name: 'Large zucchini', amount: 3, unit: 'whole' },
      { name: 'Ground beef', amount: 1, unit: 'lb' },
      { name: 'Marinara sauce', amount: 2, unit: 'cups' },
      { name: 'Cashew cream', amount: 1, unit: 'cup' },
      { name: 'Nutritional yeast', amount: 0.25, unit: 'cup' },
      { name: 'Spinach', amount: 2, unit: 'cups' },
      { name: 'Italian herbs', amount: 2, unit: 'tsp' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Slice zucchini lengthwise into thin strips',
      'Salt zucchini slices and let drain 30 minutes',
      'Brown ground beef with garlic and herbs',
      'Add marinara sauce to beef and simmer',
      'Mix cashew cream with nutritional yeast',
      'Layer zucchini, meat sauce, and cashew mixture',
      'Repeat layers, ending with cashew cream',
      'Bake at 375°F for 45 minutes',
      'Let rest 10 minutes before serving',
    ],
    prepTime: 45,
    cookTime: 45,
    servings: 8,
    difficulty: 'Medium',
    dietaryTags: ['paleo', 'gluten-free', 'dairy-free'],
    nutritionInfo: {
      calories: 320,
      protein: 22,
      carbs: 12,
      fat: 22,
      fiber: 3,
    },
    authorId: '1',
    createdAt: '2025-07-11',
  },
];

export const mockExchanges: MealExchange[] = [
  {
    id: '1',
    recipeId: '1',
    cookId: '1',
    recipientId: '2',
    scheduledDate: '2025-07-21',
    status: 'pending',
    exchangeType: 'cook-trade',
    portionSize: 2,
    pickupLocation: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Community Way, New York, NY',
    },
    notes: 'Looking forward to trying this healthy recipe!',
  },
  {
    id: '2',
    recipeId: '2',
    cookId: '2',
    recipientId: '3',
    scheduledDate: '2025-07-22',
    status: 'confirmed',
    exchangeType: 'cook-trade',
    portionSize: 1,
    pickupLocation: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '789 Library Ave, New York, NY',
    },
    notes: 'Can you make it extra spicy?',
  },
  {
    id: '3',
    recipeId: '3',
    cookId: '3',
    recipientId: '1',
    scheduledDate: '2025-07-20',
    status: 'completed',
    exchangeType: 'cook-trade',
    portionSize: 3,
    pickupLocation: {
      latitude: 40.7829,
      longitude: -73.9654,
      address: 'Central Park, New York, NY',
    },
    notes: 'Perfect for a cozy dinner!',
    rating: 5,
    review: 'Amazing carbonara! Will definitely request again.',
  },
];

export const mockCookingSessions: CookingSession[] = [
  {
    id: '1',
    recipeId: '1',
    hostId: '1',
    participants: ['2', '3'],
    scheduledDate: '2025-07-21',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'Community Kitchen A',
    },
    maxParticipants: 4,
    status: 'open',
    notes: 'Let\'s cook healthy Mediterranean bowls together!',
  },
  {
    id: '2',
    recipeId: '2',
    hostId: '2',
    participants: ['4'],
    scheduledDate: '2025-07-22',
    location: {
      latitude: 40.7580,
      longitude: -73.9855,
      address: 'Community Kitchen B',
    },
    maxParticipants: 3,
    status: 'open',
    notes: 'Korean cooking session - bring your appetite for spice!',
  },
  {
    id: '3',
    recipeId: '4', // Thai Green Curry
    hostId: '3', // Andrew Fitton
    participants: ['1', '5'],
    scheduledDate: '2025-07-23',
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: 'Community Kitchen C',
    },
    maxParticipants: 5,
    status: 'open',
    notes: 'Learn authentic Thai curry techniques! We\'ll make curry paste from scratch.',
  },
  {
    id: '4',
    recipeId: '7', // Indian Chickpea Curry
    hostId: '5', // Sidhartha Chakravarty
    participants: ['2'],
    scheduledDate: '2025-07-24',
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: 'Community Kitchen A',
    },
    maxParticipants: 6,
    status: 'open',
    notes: 'Indian spice masterclass! Learn to blend your own garam masala.',
  },
  {
    id: '5',
    recipeId: '8', // French Ratatouille
    hostId: '6', // Emma Wilson
    participants: ['1', '4'],
    scheduledDate: '2025-07-25',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: 'Community Kitchen D',
    },
    maxParticipants: 4,
    status: 'open',
    notes: 'Classic French cooking! Perfect knife skills and vegetable prep techniques.',
  },
  {
    id: '6',
    recipeId: '11', // Japanese Miso Ramen
    hostId: '5', // Sidhartha Chakravarty
    participants: ['3', '7'],
    scheduledDate: '2025-07-26',
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: 'Community Kitchen B',
    },
    maxParticipants: 4,
    status: 'open',
    notes: 'Ramen workshop! Learn to make authentic miso broth and perfect soft-boiled eggs.',
  },
  {
    id: '7',
    recipeId: '6', // Keto Bacon-Wrapped Chicken
    hostId: '4', // Jan Roessler
    participants: ['9'],
    scheduledDate: '2025-07-27',
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: 'Community Kitchen C',
    },
    maxParticipants: 3,
    status: 'open',
    notes: 'Keto cooking session! Learn low-carb alternatives and cooking techniques.',
  },
  {
    id: '8',
    recipeId: '5', // Vegan Buddha Bowl
    hostId: '3', // Andrew Fitton
    participants: ['8'],
    scheduledDate: '2025-07-28',
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: 'Community Kitchen A',
    },
    maxParticipants: 5,
    status: 'open',
    notes: 'Plant-based cooking! Learn to make nutritious, colorful vegan meals.',
  },
];

// Export current user for easy switching between users
export const currentUser = mockUsers[0]; // Bradley Van Egeren

// Planned meals by user ID
export const mockPlannedMealsByUser: Record<string, PlannedMeal[]> = {
  // Preston Percival's planned meals
  '1': [
    {
      id: '1',
      recipeId: '1', // Mediterranean Quinoa Bowl
      scheduledDate: '2025-07-13', // Today (Sunday)
      mealType: 'breakfast',
      source: 'self-cook',
    },
    {
      id: '2', 
      recipeId: '2', // Spicy Korean Kimchi Fried Rice
      scheduledDate: '2025-07-13', // Today (Sunday)
      mealType: 'lunch',
      source: 'exchange',
    },
    {
      id: '3',
      recipeId: '3', // Classic Italian Carbonara
      scheduledDate: '2025-07-14', // Tomorrow (Monday)
      mealType: 'dinner',
      source: 'group-cook',
    },
    {
      id: '4',
      recipeId: '1', // Mediterranean Quinoa Bowl
      scheduledDate: '2025-07-14', // Tomorrow (Monday)
      mealType: 'lunch',
      source: 'exchange',
    },
  ],
  
  // Bradley Van Egeren's planned meals
  '2': [
    {
      id: '5',
      recipeId: '2', // Spicy Korean Kimchi Fried Rice
      scheduledDate: '2025-07-13', // Today (Sunday)
      mealType: 'breakfast',
      source: 'self-cook',
    },
    {
      id: '6',
      recipeId: '3', // Classic Italian Carbonara
      scheduledDate: '2025-07-13', // Today (Sunday)
      mealType: 'dinner',
      source: 'self-cook',
    },
  ],
  
  // Andrew Fitton's planned meals
  '3': [
    {
      id: '7',
      recipeId: '1', // Mediterranean Quinoa Bowl
      scheduledDate: '2025-07-13', // Today (Sunday)
      mealType: 'lunch',
      source: 'self-cook',
    },
  ],
  
  // Jan Roessler's planned meals
  '4': [
    {
      id: '8',
      recipeId: '3', // Classic Italian Carbonara
      scheduledDate: '2025-07-13', // Today (Sunday)
      mealType: 'dinner',
      source: 'group-cook',
    },
  ],
  
  // Sidhartha Chakravarty's planned meals
  '5': [
    {
      id: '9',
      recipeId: '2', // Spicy Korean Kimchi Fried Rice
      scheduledDate: '2025-07-13', // Today (Sunday)
      mealType: 'lunch',
      source: 'exchange',
    },
  ],
};

// Helper function to get planned meals for current user
export const getCurrentUserPlannedMeals = (): PlannedMeal[] => {
  return mockPlannedMealsByUser[currentUser.id] || [];
};

// Shopping list items by user ID
export const mockShoppingListByUser: Record<string, ShoppingListItem[]> = {
  // Preston Percival's shopping list
  '1': [
    { id: '1', ingredient: 'Quinoa', amount: 2, unit: 'cups', recipeId: '1', purchased: false },
    { id: '2', ingredient: 'Cherry tomatoes', amount: 1, unit: 'lb', recipeId: '1', purchased: true },
    { id: '3', ingredient: 'Cucumber', amount: 1, unit: 'large', recipeId: '1', purchased: false },
    { id: '4', ingredient: 'Red onion', amount: 0.5, unit: 'medium', recipeId: '1', purchased: false },
    { id: '5', ingredient: 'Feta cheese', amount: 0.5, unit: 'cup', recipeId: '1', purchased: false },
    { id: '6', ingredient: 'Cooked rice', amount: 3, unit: 'cups', recipeId: '2', purchased: false },
    { id: '7', ingredient: 'Kimchi', amount: 1, unit: 'cup', recipeId: '2', purchased: true },
    { id: '8', ingredient: 'Eggs', amount: 2, unit: 'large', recipeId: '2', purchased: false },
  ],
  
  // Bradley Van Egeren's shopping list
  '2': [
    { id: '9', ingredient: 'Brown rice', amount: 3, unit: 'cups', recipeId: '2', purchased: false },
    { id: '10', ingredient: 'Spaghetti', amount: 400, unit: 'g', recipeId: '3', purchased: true },
    { id: '11', ingredient: 'Pancetta', amount: 150, unit: 'g', recipeId: '3', purchased: false },
    { id: '12', ingredient: 'Pecorino Romano', amount: 100, unit: 'g', recipeId: '3', purchased: false },
  ],
  
  // Andrew Fitton's shopping list
  '3': [
    { id: '13', ingredient: 'Quinoa', amount: 1, unit: 'cup', recipeId: '1', purchased: false },
    { id: '14', ingredient: 'Olive oil', amount: 1, unit: 'bottle', recipeId: '1', purchased: true },
  ],
  
  // Jan Roessler's shopping list
  '4': [
    { id: '15', ingredient: 'Lentils', amount: 2, unit: 'cans', recipeId: '3', purchased: false },
    { id: '16', ingredient: 'Black pepper', amount: 1, unit: 'tsp', recipeId: '3', purchased: false },
  ],
  
  // Sidhartha Chakravarty's shopping list
  '5': [
    { id: '17', ingredient: 'Sesame oil', amount: 2, unit: 'tbsp', recipeId: '2', purchased: false },
    { id: '18', ingredient: 'Soy sauce', amount: 2, unit: 'tbsp', recipeId: '2', purchased: true },
    { id: '19', ingredient: 'Green onions', amount: 3, unit: 'stalks', recipeId: '2', purchased: false },
  ],
};

// Helper function to get shopping list for current user
export const getCurrentUserShoppingList = (): ShoppingListItem[] => {
  return mockShoppingListByUser[currentUser.id] || [];
};

// Helper function to add ingredients to shopping list
export const addIngredientsToShoppingList = (ingredients: { name: string; amount: number; unit: string }[], recipeId: string): void => {
  if (!mockShoppingListByUser[currentUser.id]) {
    mockShoppingListByUser[currentUser.id] = [];
  }

  const existingItems = mockShoppingListByUser[currentUser.id];
  
  ingredients.forEach(ingredient => {
    // Check if ingredient already exists in shopping list
    const existingItem = existingItems.find(item => 
      item.ingredient.toLowerCase() === ingredient.name.toLowerCase() && 
      item.unit.toLowerCase() === ingredient.unit.toLowerCase()
    );

    if (existingItem) {
      // If it exists, add to the amount
      existingItem.amount += ingredient.amount;
    } else {
      // If it doesn't exist, create new item
      const newItem: ShoppingListItem = {
        id: `shopping_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ingredient: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        recipeId: recipeId,
        purchased: false,
      };
      existingItems.push(newItem);
    }
  });
};

// Pantry items by user ID
export const mockPantryByUser: Record<string, PantryItem[]> = {
  // Preston Percival's pantry
  '1': [
    { 
      id: 'p1', 
      name: 'Olive oil', 
      amount: 1, 
      unit: 'bottle', 
      category: 'condiments',
      expirationDate: '2025-12-01',
      dateAdded: '2025-06-15',
      location: 'Pantry'
    },
    { 
      id: 'p2', 
      name: 'Quinoa', 
      amount: 0.5, 
      unit: 'cups', 
      category: 'pantry',
      expirationDate: '2026-01-01',
      dateAdded: '2025-07-01',
      location: 'Pantry'
    },
    { 
      id: 'p3', 
      name: 'Cherry tomatoes', 
      amount: 0.5, 
      unit: 'lb', 
      category: 'produce',
      expirationDate: '2025-07-16',
      dateAdded: '2025-07-11',
      location: 'Fridge'
    },
    { 
      id: 'p4', 
      name: 'Garlic', 
      amount: 2, 
      unit: 'cloves', 
      category: 'produce',
      expirationDate: '2025-07-20',
      dateAdded: '2025-07-10',
      location: 'Pantry'
    },
    { 
      id: 'p5', 
      name: 'Salt', 
      amount: 1, 
      unit: 'container', 
      category: 'spices',
      dateAdded: '2025-01-01',
      location: 'Pantry'
    },
  ],
  
  // Bradley Van Egeren's pantry
  '2': [
    { 
      id: 'p6', 
      name: 'Soy sauce', 
      amount: 1, 
      unit: 'bottle', 
      category: 'condiments',
      expirationDate: '2026-03-01',
      dateAdded: '2025-05-15',
      location: 'Pantry'
    },
    { 
      id: 'p7', 
      name: 'Brown rice', 
      amount: 2, 
      unit: 'cups', 
      category: 'pantry',
      expirationDate: '2025-12-01',
      dateAdded: '2025-06-01',
      location: 'Pantry'
    },
    { 
      id: 'p8', 
      name: 'Eggs', 
      amount: 6, 
      unit: 'large', 
      category: 'dairy',
      expirationDate: '2025-07-20',
      dateAdded: '2025-07-12',
      location: 'Fridge'
    },
  ],

  // Andrew Fitton's pantry
  '3': [
    { 
      id: 'p9', 
      name: 'Olive oil', 
      amount: 0.8, 
      unit: 'bottle', 
      category: 'condiments',
      expirationDate: '2025-11-01',
      dateAdded: '2025-06-01',
      location: 'Pantry'
    },
    { 
      id: 'p10', 
      name: 'Nutritional yeast', 
      amount: 0.5, 
      unit: 'cup', 
      category: 'spices',
      expirationDate: '2025-10-01',
      dateAdded: '2025-05-01',
      location: 'Pantry'
    },
  ],

  // Jan Roessler's pantry
  '4': [
    { 
      id: 'p11', 
      name: 'Black pepper', 
      amount: 1, 
      unit: 'container', 
      category: 'spices',
      dateAdded: '2025-01-01',
      location: 'Pantry'
    },
    { 
      id: 'p12', 
      name: 'Butter', 
      amount: 0.5, 
      unit: 'stick', 
      category: 'dairy',
      expirationDate: '2025-07-25',
      dateAdded: '2025-07-10',
      location: 'Fridge'
    },
  ],

  // Sidhartha Chakravarty's pantry
  '5': [
    { 
      id: 'p13', 
      name: 'Sesame oil', 
      amount: 1, 
      unit: 'bottle', 
      category: 'condiments',
      expirationDate: '2025-09-01',
      dateAdded: '2025-04-01',
      location: 'Pantry'
    },
    { 
      id: 'p14', 
      name: 'Turmeric', 
      amount: 1, 
      unit: 'container', 
      category: 'spices',
      dateAdded: '2025-01-01',
      location: 'Pantry'
    },
    { 
      id: 'p15', 
      name: 'Basmati rice', 
      amount: 3, 
      unit: 'cups', 
      category: 'pantry',
      expirationDate: '2026-01-01',
      dateAdded: '2025-06-01',
      location: 'Pantry'
    },
  ],
};

// Helper function to get pantry for current user
export const getCurrentUserPantry = (): PantryItem[] => {
  return mockPantryByUser[currentUser.id] || [];
};

// Helper function to check if ingredient is available in pantry
export const checkPantryAvailability = (ingredientName: string, requiredAmount: number, unit: string): { available: boolean, pantryItem?: PantryItem, amountAvailable?: number } => {
  const pantry = getCurrentUserPantry();
  
  // Simple name matching (in a real app, this would be more sophisticated)
  const pantryItem = pantry.find(item => 
    item.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
    ingredientName.toLowerCase().includes(item.name.toLowerCase())
  );
  
  if (!pantryItem) {
    return { available: false };
  }
  
  // Simple unit matching (in a real app, this would handle unit conversions)
  const unitMatch = pantryItem.unit === unit || 
    (pantryItem.unit === 'bottle' && (unit === 'tbsp' || unit === 'tsp')) ||
    (pantryItem.unit === 'container' && (unit === 'tbsp' || unit === 'tsp'));
    
  if (!unitMatch) {
    return { available: false, pantryItem };
  }
  
  const available = pantryItem.amount >= requiredAmount;
  return { 
    available, 
    pantryItem, 
    amountAvailable: pantryItem.amount 
  };
};

// Available meal exchanges for Community Feed
export interface AvailableMealExchange {
  id: string;
  recipeId: string;
  cookId: string;
  cookingDate: string;
  availablePortions: number;
  totalPortions: number;
  pricePerPortion?: number;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
  cookingTime: string; // e.g., "6:00 PM"
}

export const mockAvailableMealExchanges: AvailableMealExchange[] = [
  {
    id: 'ame1',
    recipeId: '1', // Mediterranean Quinoa Bowl
    cookId: '2', // Bradley Van Egeren
    cookingDate: new Date().toISOString().split('T')[0], // Today
    availablePortions: 3,
    totalPortions: 6,
    pricePerPortion: 8,
    pickupLocation: {
      latitude: 40.7580,
      longitude: -73.9855,
      address: '456 Oak Ave, New York, NY',
    },
    notes: 'Fresh ingredients from the farmer\'s market! Ready for pickup after 7 PM.',
    cookingTime: '6:00 PM',
  },
  {
    id: 'ame2',
    recipeId: '2', // Spicy Korean Kimchi Fried Rice
    cookId: '3', // Andrew Fitton
    cookingDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    availablePortions: 2,
    totalPortions: 4,
    pricePerPortion: 6,
    pickupLocation: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    notes: 'Made with homemade kimchi! Can adjust spice level on request.',
    cookingTime: '12:00 PM',
  },
  {
    id: 'ame3',
    recipeId: '3', // Classic Italian Carbonara
    cookId: '4', // Jan Roessler
    cookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    availablePortions: 4,
    totalPortions: 8,
    pricePerPortion: 10,
    pickupLocation: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    notes: 'Authentic Roman recipe with fresh eggs and pecorino!',
    cookingTime: '7:30 PM',
  },
  {
    id: 'ame4',
    recipeId: '1', // Mediterranean Quinoa Bowl
    cookId: '5', // Sidhartha Chakravarty
    cookingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    availablePortions: 1,
    totalPortions: 4,
    pricePerPortion: 7,
    pickupLocation: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    notes: 'Vegetarian version with extra Mediterranean spices!',
    cookingTime: '5:00 PM',
  },
  {
    id: 'ame5',
    recipeId: '4', // Thai Green Curry with Vegetables
    cookId: '2', // Bradley Van Egeren
    cookingDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    availablePortions: 3,
    totalPortions: 6,
    pricePerPortion: 9,
    pickupLocation: {
      latitude: 40.7580,
      longitude: -73.9855,
      address: '456 Oak Ave, New York, NY',
    },
    notes: 'Authentic Thai curry with fresh vegetables from the Asian market!',
    cookingTime: '6:30 PM',
  },
  {
    id: 'ame6',
    recipeId: '5', // Vegan Buddha Bowl
    cookId: '3', // Andrew Fitton
    cookingDate: new Date().toISOString().split('T')[0], // Today
    availablePortions: 2,
    totalPortions: 4,
    pricePerPortion: 12,
    pickupLocation: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    notes: 'Nutrient-packed vegan bowl with tahini dressing. Perfect for plant-based eaters!',
    cookingTime: '1:00 PM',
  },
  {
    id: 'ame7',
    recipeId: '6', // Keto Bacon-Wrapped Chicken Thighs
    cookId: '4', // Jan Roessler
    cookingDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    availablePortions: 4,
    totalPortions: 6,
    pricePerPortion: 15,
    pickupLocation: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    notes: 'Keto-friendly! Juicy chicken wrapped in crispy bacon. Low-carb heaven!',
    cookingTime: '7:00 PM',
  },
  {
    id: 'ame8',
    recipeId: '7', // Indian Chickpea Curry (Chana Masala)
    cookId: '5', // Sidhartha Chakravarty
    cookingDate: new Date().toISOString().split('T')[0], // Today
    availablePortions: 5,
    totalPortions: 8,
    pricePerPortion: 8,
    pickupLocation: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    notes: 'Authentic family recipe! Served with homemade chapati. Vegan and delicious!',
    cookingTime: '6:00 PM',
  },
  {
    id: 'ame9',
    recipeId: '8', // Classic French Ratatouille
    cookId: '6', // Emma Wilson (from potential friends)
    cookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    availablePortions: 3,
    totalPortions: 6,
    pricePerPortion: 10,
    pickupLocation: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '321 Elm St, New York, NY',
    },
    notes: 'Classic French countryside recipe. Slow-cooked to perfection!',
    cookingTime: '5:30 PM',
  },
  {
    id: 'ame10',
    recipeId: '9', // Mexican Street Corn Salad (Esquites)
    cookId: '7', // Michael Chen (from potential friends)
    cookingDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    availablePortions: 2,
    totalPortions: 4,
    pricePerPortion: 7,
    pickupLocation: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: '654 Maple Ave, New York, NY',
    },
    notes: 'Street food favorite! Made with charred corn and fresh lime.',
    cookingTime: '4:00 PM',
  },
  {
    id: 'ame11',
    recipeId: '11', // Japanese Miso Ramen
    cookId: '5', // Sidhartha Chakravarty
    cookingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    availablePortions: 3,
    totalPortions: 4,
    pricePerPortion: 14,
    pickupLocation: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    notes: 'Rich miso broth with soft-boiled eggs. Comfort food at its finest!',
    cookingTime: '7:30 PM',
  },
  {
    id: 'ame12',
    recipeId: '12', // Paleo Zucchini Lasagna
    cookId: '8', // Sarah Johnson (from potential friends)
    cookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    availablePortions: 6,
    totalPortions: 8,
    pricePerPortion: 13,
    pickupLocation: {
      latitude: 40.7489,
      longitude: -73.9680,
      address: '987 Cedar Rd, New York, NY',
    },
    notes: 'Grain-free lasagna! Perfect for paleo and gluten-free diets.',
    cookingTime: '6:00 PM',
  },
];

// Helper function to get available meal exchanges
export const getAvailableMealExchanges = (): AvailableMealExchange[] => {
  return mockAvailableMealExchanges.filter(exchange => exchange.availablePortions > 0);
};

// Helper function to check if an exchange is already claimed by current user
export const isExchangeAlreadyClaimed = (exchangeId: string): boolean => {
  const userPlannedMeals = mockPlannedMealsByUser[currentUser.id] || [];
  return userPlannedMeals.some(meal => meal.exchangeId === exchangeId);
};

// Helper function to claim a portion
export const claimMealPortion = (exchangeId: string): { success: boolean, exchange?: AvailableMealExchange, newPlannedMeal?: PlannedMeal } => {
  const exchange = mockAvailableMealExchanges.find(e => e.id === exchangeId);
  if (!exchange || exchange.availablePortions <= 0) {
    return { success: false };
  }

  // Reduce available portions
  exchange.availablePortions -= 1;

  // Create a new planned meal
  const newPlannedMeal: PlannedMeal = {
    id: `pm_${Date.now()}`,
    recipeId: exchange.recipeId,
    scheduledDate: exchange.cookingDate,
    mealType: 'dinner', // Default to dinner, could be configurable
    source: 'exchange',
    exchangeId,
  };

  // Add to current user's planned meals
  if (!mockPlannedMealsByUser[currentUser.id]) {
    mockPlannedMealsByUser[currentUser.id] = [];
  }
  mockPlannedMealsByUser[currentUser.id].push(newPlannedMeal);

  return { success: true, exchange, newPlannedMeal };
};