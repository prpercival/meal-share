export interface PantryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: PantryCategory;
  expirationDate?: string;
  dateAdded: string;
  location?: string; // e.g., "Fridge", "Pantry", "Freezer"
}

export type PantryCategory = 
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'pantry'
  | 'frozen'
  | 'beverages'
  | 'condiments'
  | 'spices';
