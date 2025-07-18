# MealShare 🍽️

A React Native social meal prepping application that connects users in local communities to share the burden and costs of healthy meal preparation.

## 🎯 About

MealShare solves common meal prepping challenges by enabling community members to prepare family-sized portions of one meal per week and exchange portions with neighbors. This creates diverse weekly meal plans while requiring users to cook only once per week.

**Core Benefits:**
- Reduce meal prep time from hours to once per week
- Cut grocery costs through bulk cooking and sharing
- Enjoy meal variety without extensive planning
- Build community connections through food sharing
- Maintain healthy eating habits with less effort

## ✨ Features

### 🏠 Community Feed & Recipe Discovery
- Browse weekly meal calendar from community members
- Filter recipes by dietary preferences (vegetarian, gluten-free, etc.)
- Claim portions from available meals
- Share and discover new recipes
- View nutritional information and cooking difficulty

### 🔄 Meal Exchange Hub
- Manage active meal exchanges with status tracking
- Choose between "Cook & Trade" or "Cook Together" sessions
- Coordinate pickup/delivery logistics with interactive map
- Organize group cooking events with RSVP functionality
- Rate and review completed exchanges

### 📅 Personal Meal Planner
- Plan weekly meals with confirmed exchanges
- Track nutrition goals and macro intake
- Generate shopping lists from planned recipes
- Monitor cooking schedule and prep times
- Manage personal recipe collection and pantry items

### 👥 Social Features
- Connect with local meal prep community
- View user profiles with cooking specialties and ratings
- Chat functionality for exchange coordination
- Community announcements and meal prep tips

### ⚙️ Settings & Customization
- Light/dark theme toggle
- Notification preferences
- Dietary restriction settings
- Account and profile management

## 🛠️ Tech Stack

- **Framework**: React Native with Expo (~53.0.17)
- **Language**: TypeScript
- **Navigation**: React Navigation v7 with bottom tabs
- **State Management**: React Context API
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

## 🎨 Design System

- **Theme Support**: Light and dark mode with automatic system detection
- **Typography**: Consistent font scaling and hierarchy
- **Colors**: Material Design-inspired color palette
- **Components**: Reusable card layouts, buttons, and form elements
- **Accessibility**: Proper contrast ratios and text scaling support

## 📊 Current Status

This is a fully functional prototype with:
- ✅ Complete UI implementation for all core screens
- ✅ Mock data service with realistic sample content
- ✅ Full navigation flow between all features
- ✅ Responsive design for various screen sizes
- ✅ Theme system with light/dark mode support
- ✅ TypeScript implementation with proper typing

### Ready for:
- Backend API integration
- Real user authentication
- GPS/Maps integration for pickup locations
- Push notifications for exchange updates
- Camera functionality for meal photo uploads
- Real-time messaging between users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions or suggestions, please open an issue or contact the development team.

---

Built with ❤️ for the meal prep community