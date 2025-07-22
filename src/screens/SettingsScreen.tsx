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
  Platform,
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
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{address: string, lat: number, lon: number}>>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

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

  const handleAddressChange = async (address: string) => {
    setTempLocation(prev => ({ ...prev, address }));
    
    // Show suggestions for addresses with at least 3 characters
    if (address.length >= 3) {
      try {
        const suggestions = await getAddressSuggestions(address);
        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(suggestions.length > 0);
      } catch (error) {
        console.log('Error getting address suggestions:', error);
        setShowAddressSuggestions(false);
        setAddressSuggestions([]);
      }
    } else {
      setShowAddressSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const getAddressSuggestions = async (input: string): Promise<Array<{address: string, lat: number, lon: number}>> => {
    try {
      // Using Nominatim (OpenStreetMap) - completely free, no API key needed
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(input)}` +
        `&format=json` +
        `&addressdetails=1` +
        `&limit=5` +
        `&countrycodes=us,ca,gb,au` + // Limit to major English-speaking countries
        `&accept-language=en`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        return data.map((item: any) => ({
          address: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
      } else {
        // If no results, try Google Places API as fallback (if API key available)
        return await getGooglePlacesSuggestions(input);
      }
    } catch (error) {
      console.log('Nominatim API error, trying Google Places fallback:', error);
      // Fallback to Google Places API
      return await getGooglePlacesSuggestions(input);
    }
  };

  const getGooglePlacesSuggestions = async (input: string): Promise<Array<{address: string, lat: number, lon: number}>> => {
    try {
      const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
      
      if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'YOUR_API_KEY_HERE') {
        // No Google API key available
        console.log('No Google Places API key found, no suggestions available');
        return [];
      }
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
        `input=${encodeURIComponent(input)}` +
        `&types=address` +
        `&key=${GOOGLE_PLACES_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.predictions) {
        // For Google Places, we need to get coordinates separately using Place Details API
        const suggestionsWithCoords = await Promise.all(
          data.predictions.slice(0, 5).map(async (prediction: any) => {
            try {
              const detailsResponse = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?` +
                `place_id=${prediction.place_id}` +
                `&fields=geometry` +
                `&key=${GOOGLE_PLACES_API_KEY}`
              );
              
              if (detailsResponse.ok) {
                const details = await detailsResponse.json();
                if (details.result?.geometry?.location) {
                  return {
                    address: prediction.description,
                    lat: details.result.geometry.location.lat,
                    lon: details.result.geometry.location.lng
                  };
                }
              }
            } catch (error) {
              console.log('Error fetching place details:', error);
            }
            
            // Fallback if coordinates can't be fetched
            return {
              address: prediction.description,
              lat: 0,
              lon: 0
            };
          })
        );
        
        return suggestionsWithCoords;
      } else {
        return [];
      }
    } catch (error) {
      console.log('Google Places API error:', error);
      return [];
    }
  };

  const selectAddressSuggestion = async (selectedSuggestion: {address: string, lat: number, lon: number}) => {
    setTempLocation(prev => ({
      ...prev,
      address: selectedSuggestion.address,
      latitude: selectedSuggestion.lat,
      longitude: selectedSuggestion.lon
    }));
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  const manualGeocodeAddress = async () => {
    if (!tempLocation.address.trim()) {
      Alert.alert('Error', 'Please enter an address first');
      return;
    }

    try {
      const suggestions = await getAddressSuggestions(tempLocation.address);
      if (suggestions.length > 0) {
        // Use the first (best) match
        const bestMatch = suggestions[0];
        setTempLocation(prev => ({
          ...prev,
          latitude: bestMatch.lat,
          longitude: bestMatch.lon
        }));
        Alert.alert('Success', 'Coordinates updated from address!');
      } else {
        Alert.alert('No Results', 'Could not find coordinates for this address. Please check the address or try a different one.');
      }
    } catch (error) {
      console.error('Manual geocoding failed:', error);
      Alert.alert('Error', 'Failed to get coordinates. Please try again.');
    }
  };

  const handleUpdateLocation = async () => {
    if (!tempLocation.address.trim()) {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }
    
    try {
      let finalLocation = { ...tempLocation };
      
      // If coordinates are still 0, try to get them from the address
      if (tempLocation.latitude === 0 || tempLocation.longitude === 0) {
        try {
          const suggestions = await getAddressSuggestions(tempLocation.address);
          if (suggestions.length > 0) {
            const bestMatch = suggestions[0];
            finalLocation = {
              ...finalLocation,
              latitude: bestMatch.lat,
              longitude: bestMatch.lon,
            };
            // Update the temp state to show the new coordinates
            setTempLocation(finalLocation);
          }
        } catch (geocodeError) {
          console.log('Address lookup failed, using provided coordinates:', geocodeError);
          // If lookup fails, we'll use the manually entered coordinates
        }
      }
      
      // Update the current user in mockData (in-memory)
      if (currentUser) {
        currentUser.location = {
          address: finalLocation.address,
          latitude: finalLocation.latitude,
          longitude: finalLocation.longitude,
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
    addressSuggestionsContainer: {
      maxHeight: 200,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderTopWidth: 0,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      marginTop: -8, // Connect to the input field
      zIndex: 1000,
    },
    addressSuggestion: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    addressSuggestionLast: {
      borderBottomWidth: 0,
    },
    addressSuggestionText: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    addressInputContainer: {
      position: 'relative',
      zIndex: 1001,
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
      <Modal 
        visible={showLocationModal} 
        animationType="slide" 
        presentationStyle={Platform.OS === 'web' ? 'overFullScreen' : 'pageSheet'}
        transparent={Platform.OS === 'web'}
      >
        <View style={Platform.OS === 'web' ? { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' } : null}>
          <View style={[styles.modalContainer, Platform.OS === 'web' && { maxWidth: 480, width: '90%', height: '80%', borderRadius: 12 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Address *</Text>
              <View style={styles.addressInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={tempLocation.address}
                  onChangeText={handleAddressChange}
                  onBlur={() => {
                    // Hide suggestions when input loses focus (with small delay)
                    setTimeout(() => setShowAddressSuggestions(false), 150);
                  }}
                  onFocus={() => {
                    // Show suggestions if we have them when input gains focus
                    if (addressSuggestions.length > 0) {
                      setShowAddressSuggestions(true);
                    }
                  }}
                  placeholder="Enter your full address (e.g., 123 Main St, New York, NY 10001)"
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                />
                {showAddressSuggestions && addressSuggestions.length > 0 && (
                  <ScrollView 
                    style={styles.addressSuggestionsContainer}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                  >
                    {addressSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.addressSuggestion,
                          index === addressSuggestions.length - 1 && styles.addressSuggestionLast
                        ]}
                        onPress={() => selectAddressSuggestion(suggestion)}
                      >
                        <Text style={styles.addressSuggestionText}>{suggestion.address}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
              <Text style={styles.helperText}>
                💡 Start typing your address to see real suggestions from OpenStreetMap (free) or Google Places API. Coordinates will auto-fill when you select an address!
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

            {/* Manual Geocode Button */}
            <View style={styles.formSection}>
              <TouchableOpacity 
                style={[styles.updateButton, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]} 
                onPress={manualGeocodeAddress}
              >
                <Text style={[styles.updateButtonText, { color: theme.colors.primary }]}>
                  📍 Get Coordinates from Address
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateLocation}>
              <Text style={styles.updateButtonText}>Update Location</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      </Modal>

      {/* Dietary Preferences Modal */}
      <Modal 
        visible={showDietaryModal} 
        animationType="slide" 
        presentationStyle={Platform.OS === 'web' ? 'overFullScreen' : 'pageSheet'}
        transparent={Platform.OS === 'web'}
      >
        <View style={Platform.OS === 'web' ? { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' } : null}>
          <View style={[styles.dietaryModalContainer, Platform.OS === 'web' && { maxWidth: 480, width: '90%', height: '80%', borderRadius: 12 }]}>
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
      </View>
      </Modal>

      {/* Cooking Specialties Modal */}
      <Modal 
        visible={showCookingModal} 
        animationType="slide" 
        presentationStyle={Platform.OS === 'web' ? 'overFullScreen' : 'pageSheet'}
        transparent={Platform.OS === 'web'}
      >
        <View style={Platform.OS === 'web' ? { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' } : null}>
          <View style={[styles.dietaryModalContainer, Platform.OS === 'web' && { maxWidth: 480, width: '90%', height: '80%', borderRadius: 12 }]}>
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
      </View>
      </Modal>
    </ScrollView>
  );
};
