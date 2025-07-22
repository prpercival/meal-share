# MealShare 🍽️

A React Native social meal prepping and nutrition tracking application that addresses the complexity and overwhelm of traditional food tracking apps by redistributing meal planning across local communities.

## 🎯 Problem Statement

Traditional food and fitness tracking applications create significant barriers to healthy eating:
- **Complexity Overload**: Users spend more time navigating interfaces than focusing on health goals
- **Individual Burden**: Planning 7 meals, logging every food item, and tracking nutrition becomes overwhelming
- **Decision Fatigue**: Endless food database searches and meal planning decisions lead to app abandonment
- **Isolation**: Solo tracking lacks motivation and accountability for sustained healthy habits

## 💡 Our Solution

MealShare reimagines food tracking by shifting from individual burden to community coordination. Instead of each person planning, cooking, and logging 7 meals per week, users cook 1 larger meal and exchange portions with neighbors, automatically generating diverse weekly nutrition tracking with minimal individual effort.

**Core Benefits:**
- **Reduced Complexity**: Automatic meal filtering and community coordination eliminate overwhelming food database searches
- **Time Efficiency**: Cook once per week instead of daily meal prep and logging
- **Simplified Tracking**: Nutrition data generated through meal exchanges rather than manual food entry
- **Social Motivation**: Community accountability and variety without extensive individual planning
- **Integrated Planning**: Unified calendar, nutrition, shopping, and social coordination in one interface

## ✨ Features

### 🏠 Community Feed & Smart Filtering
- Browse weekly meal offerings with automatic dietary filtering (16+ preferences)
- Eliminate food database searching through curated community meals
- One-tap meal claiming with automatic nutrition tracking
- Visual recipe discovery reducing cognitive load of meal selection

### 🔄 Simplified Meal Exchange System
- Progressive disclosure for meal exchange creation (reducing interface complexity)
- Visual recipe selection supporting recognition over recall
- Automated nutrition calculation from confirmed exchanges
- Social coordination tools replacing individual meal planning burden

### 📅 Integrated Health Tracking
- **Unified Calendar**: Meal exchanges, cooking schedules, and personal planning in one view
- **Automatic Nutrition Tracking**: Macros and calories calculated from community exchanges
- **Smart Shopping Lists**: Ingredients aggregated and organized automatically
- **Pantry Management**: Inventory tracking with expiration monitoring

### 👥 Community-Based Motivation
- Friend discovery system for finding compatible cooking partners
- Profile-based matching using dietary preferences and cooking specialties
- Group cooking events and meal prep coordination
- Social accountability through community interaction

### ⚙️ Streamlined User Experience
- One-time preference setup with persistent filtering across the app
- Light/dark theme with automatic system detection
- Real-time address autocomplete using Nominatim and Google Places APIs
- Consistent navigation patterns reducing learning curve

## 🛠️ Tech Stack

- **Framework**: React Native with Expo (~53.0.17)
- **Language**: TypeScript
- **Navigation**: React Navigation v7 with bottom tabs
- **State Management**: React Context API
- **Maps**: react-native-maps (native) and Leaflet (web)
- **APIs**: Nominatim and Google Places for address autocomplete
- **UI Components**: React Native Elements
- **Icons**: Expo Vector Icons
- **Image Handling**: expo-image for optimized loading
- **Styling**: StyleSheet with centralized theming

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- iOS Simulator or Android Emulator (optional)

*Note: Expo CLI is not required globally since we use npx*

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/meal-share.git
cd meal-share
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
```bash
npx expo start --ios     # iOS Simulator
npx expo start --android # Android Emulator
npx expo start --web     # Web browser
```

## 📱 Screenshots

*Coming soon - screenshots of the main app screens*

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── RecipeCard.tsx
│   └── RecipeScalingCalculator.tsx
├── screens/             # Main application screens
│   ├── CommunityFeedScreen.tsx
│   ├── MealExchangeHubScreen.tsx
│   ├── PersonalMealPlannerScreen.tsx
│   ├── FriendsScreen.tsx
│   └── SettingsScreen.tsx
├── navigation/          # Navigation configuration
├── context/             # React Context providers
├── data/                # Mock data and services
├── theme/               # Theming and design tokens
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## 🎨 Design Principles

### Complexity Reduction
- **Progressive Disclosure**: Break complex tasks into simple, sequential steps
- **Smart Defaults**: Automatic filtering and preferences reduce decision points
- **Recognition over Recall**: Visual selection interfaces minimize memory load

### Efficiency Focus
- **Minimal Data Entry**: Community coordination generates tracking data automatically
- **Integrated Workflows**: Unified interface eliminates app-switching overhead
- **Persistent Preferences**: One-time setup affects entire app experience

### Social Motivation
- **Community Accountability**: Shared commitments increase adherence
- **Effortless Variety**: Access diverse meals without individual planning
- **Trust Building**: Profile and rating systems support food sharing confidence

## 📊 Current Status

This is a fully functional prototype addressing traditional food tracking complexity through:
- ✅ Smart filtering eliminating food database overwhelm
- ✅ Community meal coordination reducing individual planning burden
- ✅ Progressive disclosure simplifying complex meal exchange creation
- ✅ Integrated tracking tools (calendar, nutrition, shopping) in unified interface
- ✅ Social features supporting long-term motivation and accountability
- ✅ Real address autocomplete and mapping for practical logistics
- ✅ Consistent design system reducing cognitive load across features
- ✅ Mock data service demonstrating realistic community interactions

### Addresses Original Problems:
- **Complexity**: Smart filtering and community curation vs. overwhelming food databases
- **Time Investment**: One cooking session per week vs. daily meal prep and logging
- **Decision Fatigue**: Community-driven variety vs. individual meal planning burden
- **User Experience**: Integrated tools and social motivation vs. isolated tracking

### Ready for:
- Backend API integration for real community coordination
- User authentication and profile management
- Push notifications for exchange updates and community engagement
- Camera functionality for meal photo sharing
- Real-time messaging between community members

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or suggestions, please open an issue or contact the development team.

---

Built with ❤️ to make healthy eating accessible and sustainable through community coordination