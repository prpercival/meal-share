import { User, Recipe, MealExchange, CookingSession, PlannedMeal, ShoppingListItem, PantryItem } from '../types';

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
    dietaryPreferences: ['vegetarian', 'gluten-free'],
    cookingSpecialties: ['Italian', 'Mediterranean'],
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
    dietaryPreferences: ['dairy-free'],
    cookingSpecialties: ['Asian', 'Fusion'],
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
    dietaryPreferences: ['vegan'],
    cookingSpecialties: ['Mexican', 'Plant-based'],
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
    dietaryPreferences: ['keto', 'low-carb'],
    cookingSpecialties: ['German', 'European'],
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
    dietaryPreferences: ['vegetarian'],
    cookingSpecialties: ['Indian', 'Spicy'],
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
    dietaryPreferences: ['gluten-free'],
    cookingSpecialties: ['French', 'Pastry'],
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
    dietaryPreferences: [],
    cookingSpecialties: ['Chinese', 'Szechuan'],
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
    dietaryPreferences: ['vegan', 'gluten-free'],
    cookingSpecialties: ['Raw Food', 'Smoothie Bowls'],
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
    dietaryPreferences: ['keto'],
    cookingSpecialties: ['BBQ', 'Grilling'],
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
    dietaryTags: ['vegetarian'],
    nutritionInfo: {
      calories: 180,
      protein: 6,
      carbs: 28,
      fat: 5,
      fiber: 3,
    },
    authorId: '1',
    createdAt: '2024-01-15',
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
    dietaryTags: [],
    nutritionInfo: {
      calories: 210,
      protein: 8,
      carbs: 35,
      fat: 4,
      fiber: 2,
    },
    authorId: '2',
    createdAt: '2024-01-14',
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
    dietaryTags: [],
    nutritionInfo: {
      calories: 290,
      protein: 12,
      carbs: 40,
      fat: 8,
      fiber: 2,
    },
    authorId: '3',
    createdAt: '2024-01-13',
  },
];

export const mockExchanges: MealExchange[] = [
  {
    id: '1',
    recipeId: '1',
    cookId: '1',
    recipientId: '2',
    scheduledDate: '2024-01-18',
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
    scheduledDate: '2024-01-17',
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
    scheduledDate: '2024-01-16',
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
    scheduledDate: '2024-01-20',
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
    scheduledDate: '2024-01-22',
    location: {
      latitude: 40.7580,
      longitude: -73.9855,
      address: 'Community Kitchen B',
    },
    maxParticipants: 3,
    status: 'open',
    notes: 'Korean cooking session - bring your appetite for spice!',
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