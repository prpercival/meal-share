import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CommunityFeedScreen } from '../screens/CommunityFeedScreen';
import { MealExchangeHubScreen } from '../screens/MealExchangeHubScreen';
import { PersonalMealPlannerScreen } from '../screens/PersonalMealPlannerScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Community') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'Exchange') {
              iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
            } else if (route.name === 'Planner') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Community"
          component={CommunityFeedScreen}
          options={{
            title: 'Community',
          }}
        />
        <Tab.Screen
          name="Exchange"
          component={MealExchangeHubScreen}
          options={{
            title: 'Exchange',
          }}
        />
        <Tab.Screen
          name="Planner"
          component={PersonalMealPlannerScreen}
          options={{
            title: 'Planner',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
