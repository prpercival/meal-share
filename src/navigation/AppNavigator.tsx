import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CommunityFeedScreen } from '../screens/CommunityFeedScreen';
import { MealExchangeHubScreen } from '../screens/MealExchangeHubScreen';
import { PersonalMealPlannerScreen } from '../screens/PersonalMealPlannerScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
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
            } else if (route.name === 'Friends') {
              iconName = focused ? 'people' : 'people-outline';
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
            height: 70, // Increase height to accommodate 5 tabs and text properly
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11, // Slightly smaller font for 5 tabs
            fontWeight: '600',
            paddingBottom: 2,
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
          name="Friends"
          component={FriendsScreen}
          options={{
            title: 'Friends',
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
