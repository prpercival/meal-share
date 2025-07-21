import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useAppContext } from '../context/AppContext';
import { MealExchange, CookingSession, User, Recipe } from '../types';
import { RecipeScalingCalculator } from '../components/RecipeScalingCalculator';
import { 
  mockExchanges, 
  mockCookingSessions, 
  mockUsers, 
  mockRecipes, 
  currentUser,
  getCurrentUserFriends 
} from '../data/mockData';

type ExchangeType = 'cook-trade' | 'cook-together';

export const MealExchangeHubScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showSuccess, showError, showInfo } = useSnackbar();
  const navigation = useNavigation();
  const { exchanges, setExchanges, cookingSessions, setCookingSessions } = useAppContext();
  const [selectedExchangeType, setSelectedExchangeType] = useState<ExchangeType>('cook-trade');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [portionSize, setPortionSize] = useState('2');
  const [notes, setNotes] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('4');

  useEffect(() => {
    setExchanges(mockExchanges);
    setCookingSessions(mockCookingSessions);
  }, [setExchanges, setCookingSessions]);

  // Helper functions to get user and recipe data
  const getUserById = (userId: string): User | undefined => {
    return mockUsers.find(user => user.id === userId);
  };

  const getRecipeById = (recipeId: string): Recipe | undefined => {
    return mockRecipes.find(recipe => recipe.id === recipeId);
  };

  const handleMessageExchangePartner = (exchange: MealExchange) => {
    showInfo('Messaging functionality coming soon!');
  };

  const handleViewRecipe = (recipeId: string) => {
    const recipe = getRecipeById(recipeId);
    if (recipe) {
      setSelectedRecipeForViewing(recipe);
      setShowRecipeModal(true);
    }
  };

  const handleRecipeScale = (scaledRecipe: Recipe, servings: number) => {
    // The RecipeScalingCalculator handles scheduling and shopping list internally
    setShowRecipeModal(false);
    setSelectedRecipeForViewing(null);
    showSuccess(
      `Recipe scaled and scheduled for ${servings} servings!`,
      {
        label: 'View Calendar',
        onPress: () => {
          (navigation as any).navigate('Planner');
        }
      }
    );
  };

  const handleJoinSession = (session: CookingSession) => {
    if (session.participants.includes(currentUser.id)) {
      showInfo('You are already part of this cooking session!');
      return;
    }

    if (session.participants.length >= session.maxParticipants) {
      showError('This cooking session is full!');
      return;
    }

    // Add user to the session
    const updatedSessions = cookingSessions.map(s => 
      s.id === session.id 
        ? { ...s, participants: [...s.participants, currentUser.id] }
        : s
    );
    setCookingSessions(updatedSessions);
    
    showSuccess(
      'Successfully joined cooking session!',
      {
        label: 'View Calendar',
        onPress: () => {
          (navigation as any).navigate('Planner');
        }
      }
    );
  };

  const handleConfirmExchange = (exchange: MealExchange) => {
    if (exchange.status === 'pending') {
      // Update exchange status
      const updatedExchanges = exchanges.map(ex => 
        ex.id === exchange.id ? { ...ex, status: 'confirmed' as const } : ex
      );
      setExchanges(updatedExchanges);
      showSuccess(
        'Exchange confirmed! Check your calendar for pickup details.',
        {
          label: 'View Calendar',
          onPress: () => {
            (navigation as any).navigate('Planner');
          }
        }
      );
    } else {
      const recipe = getRecipeById(exchange.recipeId);
      const partner = getUserById(exchange.recipientId === currentUser.id ? exchange.cookId : exchange.recipientId);
      showInfo(
        `Recipe: ${recipe?.title}\nPartner: ${partner?.name}\nPortions: ${exchange.portionSize}\nStatus: ${exchange.status}`,
        {
          label: 'View Calendar',
          onPress: () => {
            (navigation as any).navigate('Planner');
          }
        }
      );
    }
  };

  const handleViewPickupLocations = () => {
    // Mock pickup locations and venues for demo
    const locations = [
      "Community Center - 123 Main St",
      "City Park Pavilion - 456 Oak Ave", 
      "Local Library - 789 Pine Rd",
      "Farmer's Market - 321 Elm St",
      "Coffee Shop Central - 654 Maple Dr"
    ];

    showInfo(
      `Popular exchange locations in your area:\n\n${locations.map((loc, idx) => `${idx + 1}. ${loc}`).join('\n')}\n\nTap on any exchange to see its specific pickup location.`,
      {
        label: 'Open Map',
        onPress: () => {
          showInfo('Map functionality coming soon!');
        }
      }
    );
  };

  const handleCreateExchange = () => {
    if (!selectedRecipe || !selectedFriend) {
      showError('Please select a recipe and friend');
      return;
    }

    const newExchange: MealExchange = {
      id: (Date.now()).toString(),
      recipeId: selectedRecipe.id,
      cookId: currentUser.id,
      recipientId: selectedFriend.id,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
      status: 'pending',
      exchangeType: 'cook-trade',
      portionSize: parseInt(portionSize) || 2,
      notes,
    };

    setExchanges([newExchange, ...exchanges]);
    showSuccess(
      'Exchange request created!',
      {
        label: 'View Exchanges',
        onPress: () => {
          // Stay on current tab but close modal
          setShowCreateModal(false);
        }
      }
    );
    resetForm();
  };

  const handleCreateCookingSession = () => {
    if (!selectedRecipe) {
      showError('Please select a recipe');
      return;
    }

    const newSession: CookingSession = {
      id: (Date.now()).toString(),
      recipeId: selectedRecipe.id,
      hostId: currentUser.id,
      participants: [],
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
      location: currentUser.location,
      maxParticipants: parseInt(maxParticipants) || 4,
      status: 'open',
      notes,
    };

    setCookingSessions([newSession, ...cookingSessions]);
    showSuccess('Cooking session created!');
    resetForm();
  };

  const resetForm = () => {
    setSelectedRecipe(null);
    setSelectedFriend(null);
    setPortionSize('2');
    setNotes('');
    setMaxParticipants('4');
    setShowCreateModal(false);
  };

  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [showFriendPicker, setShowFriendPicker] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipeForViewing, setSelectedRecipeForViewing] = useState<Recipe | null>(null);

  const RecipePicker = ({ onSelect, onClose }: { onSelect: (recipe: Recipe) => void; onClose: () => void }) => (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.pickerModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Recipe</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={mockRecipes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.pickerItem}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Image 
                source={{ uri: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
                style={styles.recipeImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.pickerItemText}>{item.title}</Text>
                <Text style={[styles.pickerItemText, { color: theme.colors.textSecondary, fontSize: 14 }]}>
                  {item.difficulty} • {item.cookTime + item.prepTime} min
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );

  const FriendPicker = ({ onSelect, onClose }: { onSelect: (friend: User) => void; onClose: () => void }) => (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.pickerModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Friend</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={getCurrentUserFriends()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.pickerItem}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Image 
                source={typeof item.avatar === 'string' ? { uri: item.avatar } : item.avatar}
                style={styles.userAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.pickerItemText}>{item.name}</Text>
                <Text style={[styles.pickerItemText, { color: theme.colors.textSecondary, fontSize: 14 }]}>
                  {item.cookingSpecialties.join(', ')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );

  const renderCreateModal = () => (
    <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            Create {selectedExchangeType === 'cook-trade' ? 'Exchange' : 'Cooking Session'}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          {/* Recipe Selection */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Recipe *</Text>
            <TouchableOpacity
              style={[styles.selectionButton, selectedRecipe && styles.selectionButtonActive]}
              onPress={() => setShowRecipePicker(true)}
            >
              <Text style={[styles.selectionText, selectedRecipe && styles.selectionTextActive]}>
                {selectedRecipe ? selectedRecipe.title : 'Select a recipe...'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Friend Selection for Cook & Trade */}
          {selectedExchangeType === 'cook-trade' && (
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Friend *</Text>
              <TouchableOpacity
                style={[styles.selectionButton, selectedFriend && styles.selectionButtonActive]}
                onPress={() => setShowFriendPicker(true)}
              >
                <Text style={[styles.selectionText, selectedFriend && styles.selectionTextActive]}>
                  {selectedFriend ? selectedFriend.name : 'Select a friend...'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Portion Size / Max Participants */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>
              {selectedExchangeType === 'cook-trade' ? 'Portion Size' : 'Max Participants'}
            </Text>
            <TextInput
              style={styles.textInput}
              value={selectedExchangeType === 'cook-trade' ? portionSize : maxParticipants}
              onChangeText={selectedExchangeType === 'cook-trade' ? setPortionSize : setMaxParticipants}
              placeholder={selectedExchangeType === 'cook-trade' ? 'Number of portions' : 'Maximum participants'}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Notes */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any special notes or requirements..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
          </View>

          <TouchableOpacity
            style={styles.createFormButton}
            onPress={selectedExchangeType === 'cook-trade' ? handleCreateExchange : handleCreateCookingSession}
          >
            <Text style={styles.createFormButtonText}>
              Create {selectedExchangeType === 'cook-trade' ? 'Exchange' : 'Session'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {showRecipePicker && (
        <RecipePicker 
          onSelect={setSelectedRecipe} 
          onClose={() => setShowRecipePicker(false)} 
        />
      )}

      {showFriendPicker && (
        <FriendPicker 
          onSelect={setSelectedFriend} 
          onClose={() => setShowFriendPicker(false)} 
        />
      )}
    </Modal>
  );

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
    typeSelector: {
      flexDirection: 'row',
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.xs,
    },
    typeButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderRadius: 6,
    },
    typeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    typeButtonText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    typeButtonTextActive: {
      color: 'white',
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    exchangeCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: 12,
      padding: theme.spacing.md,
    },
    exchangeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    exchangeTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
      backgroundColor: theme.colors.success,
    },
    statusText: {
      ...theme.typography.caption,
      color: 'white',
      fontSize: 12,
    },
    exchangeDetails: {
      marginBottom: theme.spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    detailText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      ...theme.typography.body,
      fontWeight: '600',
    },
    primaryButtonText: {
      color: 'white',
    },
    secondaryButtonText: {
      color: theme.colors.text,
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    mapButtonText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    contentContainer: {
      flex: 1,
      paddingTop: theme.spacing.sm,
    },
    listContainer: {
      paddingBottom: theme.spacing.lg,
    },
    // User display styles
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    userAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: theme.spacing.sm,
    },
    userName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
    },
    userRole: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    recipeTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    recipeTitle: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
    participantsList: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    participantAvatars: {
      flexDirection: 'row',
      marginLeft: theme.spacing.sm,
    },
    participantAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginLeft: -8,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    hostBadge: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: 8,
      marginLeft: theme.spacing.xs,
    },
    hostBadgeText: {
      ...theme.typography.caption,
      color: theme.colors.primary,
      fontSize: 10,
      fontWeight: '600',
    },
    // Create new styles
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: 8,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    createButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
    modal: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    formContainer: {
      padding: theme.spacing.md,
    },
    formSection: {
      marginBottom: theme.spacing.lg,
    },
    formLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    selectionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectionButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    selectionText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    selectionTextActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      ...theme.typography.body,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    createFormButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    createFormButtonText: {
      ...theme.typography.body,
      color: 'white',
      fontWeight: '600',
    },
    pickerModal: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: theme.spacing.xl,
    },
    pickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    pickerItemText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    recipeImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: theme.spacing.sm,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'completed':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderExchange = ({ item }: { item: MealExchange }) => {
    const cook = getUserById(item.cookId);
    const recipient = getUserById(item.recipientId);
    const recipe = getRecipeById(item.recipeId);

    return (
      <View style={styles.exchangeCard}>
        <View style={styles.exchangeHeader}>
          <Text style={styles.exchangeTitle}>Recipe Exchange</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Recipe Title */}
        {recipe && (
          <View style={styles.recipeTitleRow}>
            <Ionicons name="restaurant-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
          </View>
        )}

        {/* Cook Information */}
        {cook && (
          <View style={styles.userInfo}>
            <Image source={cook.avatar} style={styles.userAvatar} />
            <Text style={styles.userName}>{cook.name}</Text>
            <Text style={styles.userRole}>(Cook)</Text>
          </View>
        )}

        {/* Recipient Information */}
        {recipient && (
          <View style={styles.userInfo}>
            <Image source={recipient.avatar} style={styles.userAvatar} />
            <Text style={styles.userName}>{recipient.name}</Text>
            <Text style={styles.userRole}>(Recipient)</Text>
          </View>
        )}

        <View style={styles.exchangeDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {new Date(item.scheduledDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{item.portionSize} portions</Text>
          </View>
          {item.pickupLocation && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{item.pickupLocation.address}</Text>
            </View>
          )}
          {item.notes && (
            <View style={styles.detailRow}>
              <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{item.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => handleMessageExchangePartner(item)}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleConfirmExchange(item)}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              {item.status === 'pending' ? 'Confirm' : 'View Details'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCookingSession = ({ item }: { item: CookingSession }) => {
    const host = getUserById(item.hostId);
    const recipe = getRecipeById(item.recipeId);
    const participants = item.participants.map(id => getUserById(id)).filter(Boolean) as User[];

    return (
      <View style={styles.exchangeCard}>
        <View style={styles.exchangeHeader}>
          <Text style={styles.exchangeTitle}>Group Cooking</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Recipe Title */}
        {recipe && (
          <View style={styles.recipeTitleRow}>
            <Ionicons name="restaurant-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
          </View>
        )}

        {/* Host Information */}
        {host && (
          <View style={styles.userInfo}>
            <Image source={host.avatar} style={styles.userAvatar} />
            <Text style={styles.userName}>{host.name}</Text>
            <View style={styles.hostBadge}>
              <Text style={styles.hostBadgeText}>HOST</Text>
            </View>
          </View>
        )}

        {/* Participants */}
        {participants.length > 0 && (
          <View style={styles.participantsList}>
            <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>Participants:</Text>
            <View style={styles.participantAvatars}>
              {participants.slice(0, 3).map((participant, index) => (
                <Image 
                  key={participant.id} 
                  source={participant.avatar} 
                  style={[styles.participantAvatar, { zIndex: participants.length - index }]} 
                />
              ))}
              {participants.length > 3 && (
                <View style={[styles.participantAvatar, { 
                  backgroundColor: theme.colors.border, 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  zIndex: 0
                }]}>
                  <Text style={{ ...theme.typography.caption, fontSize: 10, color: theme.colors.text }}>
                    +{participants.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.exchangeDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {new Date(item.scheduledDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {item.participants.length}/{item.maxParticipants} participants
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{item.location.address}</Text>
          </View>
          {item.notes && (
            <View style={styles.detailRow}>
              <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{item.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => handleViewRecipe(item.recipeId)}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>View Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleJoinSession(item)}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              {item.participants.includes(currentUser.id) ? 'Already Joined' : 'Join Session'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal Exchange Hub</Text>
        <Text style={styles.subtitle}>
          Manage your exchanges and cooking sessions
        </Text>
      </View>

      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            selectedExchangeType === 'cook-trade' && styles.typeButtonActive,
          ]}
          onPress={() => setSelectedExchangeType('cook-trade')}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedExchangeType === 'cook-trade' && styles.typeButtonTextActive,
            ]}
          >
            Cook & Trade
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            selectedExchangeType === 'cook-together' && styles.typeButtonActive,
          ]}
          onPress={() => setSelectedExchangeType('cook-together')}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedExchangeType === 'cook-together' && styles.typeButtonTextActive,
            ]}
          >
            Cook Together
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.mapButton}
        onPress={handleViewPickupLocations}
      >
        <Ionicons name="map-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.mapButtonText}>View Pickup Locations & Venues</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.createButtonText}>
          Create {selectedExchangeType === 'cook-trade' ? 'Exchange' : 'Cooking Session'}
        </Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          {selectedExchangeType === 'cook-trade' ? 'Active Exchanges' : 'Cooking Sessions'}
        </Text>
        {selectedExchangeType === 'cook-trade' ? (
          <FlatList
            data={exchanges}
            renderItem={renderExchange}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <FlatList
            data={cookingSessions}
            renderItem={renderCookingSession}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* Create Modal */}
      {showCreateModal && renderCreateModal()}

      {/* Recipe Scaling Calculator */}
      {showRecipeModal && selectedRecipeForViewing && (
        <RecipeScalingCalculator
          recipe={selectedRecipeForViewing}
          visible={showRecipeModal}
          onClose={() => {
            setShowRecipeModal(false);
            setSelectedRecipeForViewing(null);
          }}
          onScale={handleRecipeScale}
        />
      )}
    </View>
  );
};
