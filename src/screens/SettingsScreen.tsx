import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { currentUser } = useAppContext();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingItemFirst: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    settingItemLast: {
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      borderBottomWidth: 0,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: theme.spacing.md,
    },
    settingText: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    settingDescription: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    userCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      borderRadius: 12,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    userAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    userAvatarText: {
      ...theme.typography.h2,
      color: 'white',
    },
    userName: {
      ...theme.typography.h2,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    userStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: theme.spacing.md,
    },
    userStat: {
      alignItems: 'center',
    },
    userStatValue: {
      ...theme.typography.h3,
      color: theme.colors.primary,
    },
    userStatLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
  });

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon-outline',
          title: 'Dark Mode',
          description: 'Toggle between light and dark themes',
          action: 'toggle',
          value: isDark,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Push Notifications',
          description: 'Receive notifications about meal exchanges',
          action: 'toggle',
          value: true,
          onPress: () => {},
        },
        {
          icon: 'mail-outline',
          title: 'Email Notifications',
          description: 'Get weekly meal planning reminders',
          action: 'toggle',
          value: false,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          title: 'Edit Profile',
          description: 'Update your personal information',
          action: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'location-outline',
          title: 'Location Settings',
          description: 'Manage your pickup and delivery preferences',
          action: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'nutrition-outline',
          title: 'Dietary Preferences',
          description: 'Update your dietary restrictions and preferences',
          action: 'navigate',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Help & FAQ',
          description: 'Get answers to common questions',
          action: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'chatbubble-outline',
          title: 'Contact Support',
          description: 'Get help from our support team',
          action: 'navigate',
          onPress: () => {},
        },
        {
          icon: 'document-text-outline',
          title: 'Privacy Policy',
          description: 'Review our privacy policy',
          action: 'navigate',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Customize your MealShare experience
        </Text>
      </View>

      {currentUser && (
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {currentUser.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <View style={styles.userStats}>
            <View style={styles.userStat}>
              <Text style={styles.userStatValue}>{currentUser.totalExchanges}</Text>
              <Text style={styles.userStatLabel}>Exchanges</Text>
            </View>
            <View style={styles.userStat}>
              <Text style={styles.userStatValue}>{currentUser.rating.toFixed(1)}</Text>
              <Text style={styles.userStatLabel}>Rating</Text>
            </View>
            <View style={styles.userStat}>
              <Text style={styles.userStatValue}>{currentUser.cookingSpecialties.length}</Text>
              <Text style={styles.userStatLabel}>Specialties</Text>
            </View>
          </View>
        </View>
      )}

      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex === 0 && styles.settingItemFirst,
                  itemIndex === section.items.length - 1 && styles.settingItemLast,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.settingLeft}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={theme.colors.primary}
                    style={styles.settingIcon}
                  />
                  <View>
                    <Text style={styles.settingText}>{item.title}</Text>
                    {item.description && (
                      <Text style={styles.settingDescription}>{item.description}</Text>
                    )}
                  </View>
                </View>
                {item.action === 'toggle' && 'value' in item && (
                  <Switch
                    value={item.value}
                    onValueChange={item.onPress}
                    trackColor={{
                      false: theme.colors.border,
                      true: theme.colors.primary,
                    }}
                  />
                )}
                {item.action === 'navigate' && (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
