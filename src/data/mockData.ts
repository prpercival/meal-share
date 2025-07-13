import { User, Recipe, MealExchange, CookingSession, PlannedMeal, ShoppingListItem } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Preston Percival',
    email: 'ppercival3@gatech.edu',
    avatar: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main St, New York, NY',
    },
    dietaryPreferences: ['vegetarian', 'gluten-free'],
    cookingSpecialties: ['Italian', 'Mediterranean'],
    rating: 4.8,
    totalExchanges: 25,
  },
  {
    id: '2',
    name: 'Bradley Van Egeren',
    email: 'begeren3@gatech.edu',
    avatar: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
    location: {
      latitude: 40.7580,
      longitude: -73.9855,
      address: '456 Oak Ave, New York, NY',
    },
    dietaryPreferences: ['dairy-free'],
    cookingSpecialties: ['Asian', 'Fusion'],
    rating: 4.6,
    totalExchanges: 18,
  },
  {
    id: '3',
    name: 'Andrew Fitton',
    email: 'afitton3@gatech.edu',
    avatar: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    dietaryPreferences: ['vegan'],
    cookingSpecialties: ['Mexican', 'Plant-based'],
    rating: 4.9,
    totalExchanges: 32,
  },
  {
    id: '4',
    name: 'Jan Roessler',
    email: 'jroessler3@gatech.edu',
    avatar: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    dietaryPreferences: ['keto', 'low-carb'],
    cookingSpecialties: ['German', 'European'],
    rating: 4.7,
    totalExchanges: 28,
  },
  {
    id: '5',
    name: 'Sidhartha Chakravarty',
    email: 'sidhartha.chakravarty@gatech.edu',
    avatar: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '789 Pine St, New York, NY',
    },
    dietaryPreferences: ['vegetarian'],
    cookingSpecialties: ['Indian', 'Spicy'],
    rating: 4.9,
    totalExchanges: 35,
  },
];

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