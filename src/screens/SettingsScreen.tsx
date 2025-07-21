import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useAppContext } from '../context/AppContext';
import { DIETARY_PREFERENCES, COOKING_SPECIALTIES } from '../data/mockData';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { showSuccess, showInfo } = useSnackbar();
  const { currentUser } = useAppContext();
  const insets = useSafeAreaInsets();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDietaryModal, setShowDietaryModal] = useState(false);
  const [showCookingModal, setShowCookingModal] = useState(false);
  const [tempLocation, setTempLocation] = useState({
    address: currentUser?.location.address || '',
    latitude: currentUser?.location.latitude || 0,
    longitude: currentUser?.location.longitude || 0,
  });
  const [tempDietaryPreferences, setTempDietaryPreferences] = useState<string[]>(
    currentUser?.dietaryPreferences || []
  );
  const [tempCookingSpecialties, setTempCookingSpecialties] = useState<string[]>(
    currentUser?.cookingSpecialties || []
  );
  const [dietarySearchQuery, setDietarySearchQuery] = useState('');
  const [cookingSearchQuery, setCookingSearchQuery] = useState('');

  // Use centralized dietary preferences list with search filtering
  const availableDietaryOptions = DIETARY_PREFERENCES.filter(option =>
    option.toLowerCase().includes(dietarySearchQuery.toLowerCase()) ||
    option.split('-').some(word => word.toLowerCase().includes(dietarySearchQuery.toLowerCase()))
  );

  // Use centralized cooking specialties list with search filtering
  const availableCookingOptions = COOKING_SPECIALTIES.filter(option =>
    option.toLowerCase().includes(cookingSearchQuery.toLowerCase()) ||
    option.split('-').some(word => word.toLowerCase().includes(cookingSearchQuery.toLowerCase()))
  );

  const handleUpdateLocation = async () => {
    if (!tempLocation.address.trim()) {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }
    
    try {
      // Try to geocode the address if lat/lng are not provided or are default values
      if (tempLocation.latitude === 0 || tempLocation.longitude === 0) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          try {
            const geocoded = await Location.geocodeAsync(tempLocation.address);
            if (geocoded.length > 0) {
              tempLocation.latitude = geocoded[0].latitude;
              tempLocation.longitude = geocoded[0].longitude;
            }
          } catch (geocodeError) {
            console.log('Geocoding failed, using provided coordinates:', geocodeError);
            // If geocoding fails, we'll use the manually entered coordinates
          }
        }
      }
      
      // Update the current user in mockData (in-memory)
      if (currentUser) {
        currentUser.location = {
          address: tempLocation.address,
          latitude: tempLocation.latitude,
          longitude: tempLocation.longitude,
        };
      }
      
      setShowLocationModal(false);
      showSuccess('Location updated successfully!');
    } catch (error) {
      console.error('Error updating location:', error);
      Alert.alert('Error', 'Failed to update location. Please try again.');
    }
  };

  const handleUpdateDietaryPreferences = () => {
    // Update the current user in mockData (in-memory)
    if (currentUser) {
      currentUser.dietaryPreferences = [...tempDietaryPreferences] as any;
    }
    
    setShowDietaryModal(false);
    showSuccess('Dietary preferences updated successfully!');
  };

  const handleUpdateCookingSpecialties = () => {
    // Update the current user in mockData (in-memory)
    if (currentUser) {
      currentUser.cookingSpecialties = [...tempCookingSpecialties] as any;
    }
    
    setShowCookingModal(false);
    showSuccess('Cooking specialties updated successfully!');
  };

  const toggleDietaryPreference = (preference: string) => {
    setTempDietaryPreferences(prev => 
      prev.includes(preference) 
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const toggleCookingSpecialty = (specialty: string) => {
    setTempCookingSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

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
      overflow: 'hidden',
    },
    userAvatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 40,
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
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    modalTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },
    modalContent: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    formSection: {
      marginBottom: theme.spacing.lg,
    },
    formLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '600',
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      ...theme.typography.body,
    },
    updateButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    updateButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
    },
    preferencesContainer: {
      marginBottom: theme.spacing.md,
    },
    preferenceOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      marginBottom: theme.spacing.sm,
    },
    preferenceOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    preferenceOptionText: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    preferenceOptionTextSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    helperText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontStyle: 'italic',
    },
    coordinateInput: {
      backgroundColor: theme.colors.background,
      opacity: 0.8,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      ...theme.typography.body,
    },
    dietaryModalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    fixedSearchHeader: {
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      padding: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dietaryScrollContent: {
      flex: 1,
    },
    dietaryScrollContentContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg * 3 + Math.max(theme.spacing.lg, insets.bottom + theme.spacing.lg) + 50, // Button container height + button height + extra spacing
    },
    fixedButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: Math.max(theme.spacing.lg, insets.bottom + theme.spacing.lg), // Consistent spacing
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    noResultsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
      fontStyle: 'italic',
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
          onPress: () => {
            toggleTheme();
            showSuccess(`Switched to ${isDark ? 'light' : 'dark'} mode`);
          },
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
          onPress: () => {
            showInfo('Edit Profile functionality coming soon!');
          },
        },
        {
          icon: 'location-outline',
          title: 'Location Settings',
          description: 'Manage your pickup and delivery preferences',
          action: 'navigate',
          onPress: () => {
            setTempLocation({
              address: currentUser?.location.address || '',
              latitude: currentUser?.location.latitude || 0,
              longitude: currentUser?.location.longitude || 0,
            });
            setShowLocationModal(true);
          },
        },
        {
          icon: 'nutrition-outline',
          title: 'Dietary Preferences',
          description: 'Update your dietary restrictions and preferences',
          action: 'navigate',
          onPress: () => {
            setTempDietaryPreferences([...(currentUser?.dietaryPreferences || [])]);
            setDietarySearchQuery('');
            setShowDietaryModal(true);
          },
        },
        {
          icon: 'restaurant-outline',
          title: 'Cooking Specialties',
          description: 'Select your areas of cooking expertise',
          action: 'navigate',
          onPress: () => {
            setTempCookingSpecialties([...(currentUser?.cookingSpecialties || [])]);
            setCookingSearchQuery('');
            setShowCookingModal(true);
          },
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
          onPress: () => {
            showInfo('Help & FAQ functionality coming soon!');
          },
        },
        {
          icon: 'chatbubble-outline',
          title: 'Contact Support',
          description: 'Get help from our support team',
          action: 'navigate',
          onPress: () => {
            console.log('Contact Support button pressed'); // Debug log
            Alert.alert(
              'Contact Support',
              'Need help? Contact our support team:\n\nEmail: support@mealshare.com\nPhone: (555) 123-4567\n\nWe typically respond within 24 hours.',
              [{ text: 'OK' }]
            );
          },
        },
        {
          icon: 'document-text-outline',
          title: 'Privacy Policy',
          description: 'Review our privacy policy',
          action: 'navigate',
          onPress: () => {
            Alert.alert(
              'Privacy Policy',
              'Your privacy is important to us. We collect minimal data necessary to provide our service and never share your personal information with third parties.\n\nFor the full privacy policy, visit our website.',
              [{ text: 'OK' }]
            );
          },
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
            {currentUser.avatar ? (
              <Image 
                source={currentUser.avatar}
                style={styles.userAvatarImage}
                placeholder={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=${theme.colors.primary.slice(1)}&color=fff&size=150&format=png`}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <Text style={styles.userAvatarText}>
                {currentUser.name.charAt(0)}
              </Text>
            )}
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
                onPress={() => {
                  console.log('TouchableOpacity pressed for:', item.title, 'Action:', item.action);
                  if (item.action === 'navigate') {
                    item.onPress();
                  }
                }}
                disabled={item.action === 'toggle'}
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
      
      {/* Location Settings Modal */}
      <Modal visible={showLocationModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Location</Text>
            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Address *</Text>
              <TextInput
                style={styles.textInput}
                value={tempLocation.address}
                onChangeText={(text) => setTempLocation(prev => ({ ...prev, address: text }))}
                placeholder="Enter your full address (e.g., 123 Main St, New York, NY 10001)"
                placeholderTextColor={theme.colors.textSecondary}
                multiline
              />
              <Text style={styles.helperText}>
                💡 Enter your full address. We'll automatically find the coordinates for you!
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Latitude (Auto-filled)</Text>
              <TextInput
                style={[styles.textInput, styles.coordinateInput]}
                value={tempLocation.latitude.toString()}
                onChangeText={(text) => setTempLocation(prev => ({ ...prev, latitude: parseFloat(text) || 0 }))}
                placeholder="40.7128"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
                editable={true}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Longitude (Auto-filled)</Text>
              <TextInput
                style={[styles.textInput, styles.coordinateInput]}
                value={tempLocation.longitude.toString()}
                onChangeText={(text) => setTempLocation(prev => ({ ...prev, longitude: parseFloat(text) || 0 }))}
                placeholder="-74.0060"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
                editable={true}
              />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateLocation}>
              <Text style={styles.updateButtonText}>Update Location</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Dietary Preferences Modal */}
      <Modal visible={showDietaryModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.dietaryModalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Dietary Preferences</Text>
            <TouchableOpacity onPress={() => setShowDietaryModal(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Fixed Search Header */}
          <View style={styles.fixedSearchHeader}>
            <Text style={styles.formLabel}>Select your dietary preferences:</Text>
            <TextInput
              style={styles.searchInput}
              value={dietarySearchQuery}
              onChangeText={setDietarySearchQuery}
              placeholder="Search preferences (e.g., gluten, vegan, keto...)"
              placeholderTextColor={theme.colors.textSecondary}
              returnKeyType="search"
            />
          </View>
          
          <ScrollView 
            style={styles.dietaryScrollContent} 
            contentContainerStyle={styles.dietaryScrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.preferencesContainer}>
              {availableDietaryOptions.length > 0 ? (
                availableDietaryOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.preferenceOption,
                      tempDietaryPreferences.includes(option) && styles.preferenceOptionSelected
                    ]}
                    onPress={() => toggleDietaryPreference(option)}
                  >
                    <Text style={[
                      styles.preferenceOptionText,
                      tempDietaryPreferences.includes(option) && styles.preferenceOptionTextSelected
                    ]}>
                      {option.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Text>
                    {tempDietaryPreferences.includes(option) && (
                      <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>
                  No preferences found matching "{dietarySearchQuery}"
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Fixed Update Button */}
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateDietaryPreferences}>
              <Text style={styles.updateButtonText}>
                Update Preferences ({tempDietaryPreferences.length} selected)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cooking Specialties Modal */}
      <Modal visible={showCookingModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.dietaryModalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cooking Specialties</Text>
            <TouchableOpacity onPress={() => setShowCookingModal(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Fixed Search Header */}
          <View style={styles.fixedSearchHeader}>
            <Text style={styles.formLabel}>Select your cooking specialties:</Text>
            <TextInput
              style={styles.searchInput}
              value={cookingSearchQuery}
              onChangeText={setCookingSearchQuery}
              placeholder="Search specialties (e.g., Italian, BBQ, baking...)"
              placeholderTextColor={theme.colors.textSecondary}
              returnKeyType="search"
            />
          </View>
          
          <ScrollView 
            style={styles.dietaryScrollContent} 
            contentContainerStyle={styles.dietaryScrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.preferencesContainer}>
              {availableCookingOptions.length > 0 ? (
                availableCookingOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.preferenceOption,
                      tempCookingSpecialties.includes(option) && styles.preferenceOptionSelected
                    ]}
                    onPress={() => toggleCookingSpecialty(option)}
                  >
                    <Text style={[
                      styles.preferenceOptionText,
                      tempCookingSpecialties.includes(option) && styles.preferenceOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                    {tempCookingSpecialties.includes(option) && (
                      <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>
                  No specialties found matching "{cookingSearchQuery}"
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Fixed Update Button */}
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateCookingSpecialties}>
              <Text style={styles.updateButtonText}>
                Update Specialties ({tempCookingSpecialties.length} selected)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
