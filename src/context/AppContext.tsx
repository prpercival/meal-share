import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, MealExchange, Recipe, WeeklyMealPlan, CookingSession } from '../types';
import { currentUser } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
  exchanges: MealExchange[];
  setExchanges: (exchanges: MealExchange[]) => void;
  cookingSessions: CookingSession[];
  setCookingSessions: (sessions: CookingSession[]) => void;
  weeklyPlan: WeeklyMealPlan | null;
  setWeeklyPlan: (plan: WeeklyMealPlan | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [exchanges, setExchanges] = useState<MealExchange[]>([]);
  const [cookingSessions, setCookingSessions] = useState<CookingSession[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan | null>(null);

  useEffect(() => {
    // Initialize with mock user
    setUser(currentUser);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser: user,
        setCurrentUser: setUser,
        recipes,
        setRecipes,
        exchanges,
        setExchanges,
        cookingSessions,
        setCookingSessions,
        weeklyPlan,
        setWeeklyPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
