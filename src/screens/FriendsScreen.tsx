import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';
import { UserProfileModal } from '../components/UserProfileModal';
import { 
  mockUsers, 
  currentUser, 
  mockPotentialFriends, 
  getCurrentUserFriends, 
  getPotentialFriends,
  mockFriendships 
} from '../data/mockData';

export const FriendsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showSuccess, showError, showInfo } = useSnackbar();
  const [friends, setFriends] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [potentialFriends, setPotentialFriends] = useState<User[]>([]);
  const [searchPotentialQuery, setSearchPotentialQuery] = useState('');
  const [filteredPotentialFriends, setFilteredPotentialFriends] = useState<User[]>([]);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // Load current user's friends
    const userFriends = getCurrentUserFriends();
    setFriends(userFriends);
    setFilteredFriends(userFriends);

    // Load potential friends (users not yet connected)
    const potential = getPotentialFriends();
    setPotentialFriends(potential);
    setFilteredPotentialFriends(potential);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.cookingSpecialties.some(specialty =>
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredFriends(filtered);
    }
  }, [searchQuery, friends]);

  useEffect(() => {
    if (searchPotentialQuery.trim() === '') {
      setFilteredPotentialFriends(potentialFriends);
    } else {
      const filtered = potentialFriends.filter(user =>
        user.name.toLowerCase().includes(searchPotentialQuery.toLowerCase()) ||
        user.cookingSpecialties.some(specialty =>
          specialty.toLowerCase().includes(searchPotentialQuery.toLowerCase())
        ) ||
        user.dietaryPreferences.some(pref =>
          pref.toLowerCase().includes(searchPotentialQuery.toLowerCase())
        )
      );
      setFilteredPotentialFriends(filtered);
    }
  }, [searchPotentialQuery, potentialFriends]);

  const handleAddFriend = (friendId: string) => {
    // In a real app, this would send an API request
    const newFriend = potentialFriends.find(f => f.id === friendId);
    if (newFriend) {
      setFriends(prev => [...prev, newFriend]);
      setFilteredFriends(prev => [...prev, newFriend]);
      setPotentialFriends(prev => prev.filter(f => f.id !== friendId));
      setFilteredPotentialFriends(prev => prev.filter(f => f.id !== friendId));
      
      // Update mock friendships data
      if (!mockFriendships[currentUser.id]) {
        mockFriendships[currentUser.id] = [];
      }
      mockFriendships[currentUser.id].push(friendId);
      
      showSuccess(
        `Friend request sent to ${newFriend.name}!`,
        {
          label: 'View Friends',
          onPress: () => {
            setShowAddFriends(false);
          }
        }
      );
    }
  };

  const handleMessageFriend = (friendId: string) => {
    const friend = mockUsers.find(user => user.id === friendId);
    if (friend) {
      showInfo('Messaging functionality coming soon!');
    }
  };

  const handleViewProfile = (friendId: string) => {
    const friend = [...mockUsers, ...mockPotentialFriends].find(user => user.id === friendId);
    if (friend) {
      setSelectedUser(friend);
      setProfileModalVisible(true);
    }
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
      marginBottom: theme.spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      paddingVertical: theme.spacing.md,
    },
    friendCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      padding: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    friendHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: theme.spacing.md,
    },
    friendInfo: {
      flex: 1,
    },
    friendName: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    friendStats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    statText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    specialtiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    specialtyTag: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 16,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    specialtyText: {
      ...theme.typography.caption,
      color: 'white',
      fontSize: 11,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      borderRadius: 8,
      marginHorizontal: theme.spacing.xs,
    },
    messageButton: {
      backgroundColor: theme.colors.primary,
    },
    profileButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      ...theme.typography.body,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    messageButtonText: {
      color: 'white',
    },
    profileButtonText: {
      color: theme.colors.text,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    emptyStateText: {
      ...theme.typography.h3,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    addFriendsButton: {
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
    addFriendsButtonText: {
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
    modalSearchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      paddingHorizontal: theme.spacing.md,
      margin: theme.spacing.md,
    },
    potentialFriendCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      padding: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    addFriendButton: {
      backgroundColor: theme.colors.success,
    },
    addFriendButtonText: {
      color: 'white',
    },
    distanceText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
  });

  const renderPotentialFriend = ({ item }: { item: User }) => (
    <View style={styles.potentialFriendCard}>
      <View style={styles.friendHeader}>
        <Image 
          source={typeof item.avatar === 'string' ? { uri: item.avatar } : item.avatar} 
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.name}</Text>
          <View style={styles.friendStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color={theme.colors.secondary} />
              <Text style={styles.statText}>{item.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="swap-horizontal" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.statText}>{item.totalExchanges} exchanges</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.distanceText}>0.5 mi away</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.specialtiesContainer}>
        {item.cookingSpecialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.profileButton]}
          onPress={() => handleViewProfile(item.id)}
        >
          <Ionicons name="person" size={16} color={theme.colors.text} />
          <Text style={[styles.actionButtonText, styles.profileButtonText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.addFriendButton]}
          onPress={() => handleAddFriend(item.id)}
        >
          <Ionicons name="person-add" size={16} color="white" />
          <Text style={[styles.actionButtonText, styles.addFriendButtonText]}>
            Add Friend
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFriend = ({ item }: { item: User }) => (
    <View style={styles.friendCard}>
      <View style={styles.friendHeader}>
        <Image 
          source={typeof item.avatar === 'string' ? { uri: item.avatar } : item.avatar} 
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.name}</Text>
          <View style={styles.friendStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color={theme.colors.secondary} />
              <Text style={styles.statText}>{item.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="swap-horizontal" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.statText}>{item.totalExchanges} exchanges</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.specialtiesContainer}>
        {item.cookingSpecialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => handleMessageFriend(item.id)}
        >
          <Ionicons name="chatbubble" size={16} color="white" />
          <Text style={[styles.actionButtonText, styles.messageButtonText]}>
            Message
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.profileButton]}
          onPress={() => handleViewProfile(item.id)}
        >
          <Ionicons name="person" size={16} color={theme.colors.text} />
          <Text style={[styles.actionButtonText, styles.profileButtonText]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.subtitle}>
          Connect with your cooking community
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={theme.colors.textSecondary} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends or cuisines..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.addFriendsButton}
        onPress={() => setShowAddFriends(true)}
      >
        <Ionicons name="person-add" size={20} color="white" />
        <Text style={styles.addFriendsButtonText}>Find New Friends</Text>
      </TouchableOpacity>

      {filteredFriends.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No friends match your search' : 'No friends yet!\nTap "Find New Friends" to get started.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFriends}
          renderItem={renderFriend}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Friends Modal */}
      <Modal
        visible={showAddFriends}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Find Friends</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAddFriends(false)}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalSearchContainer}>
            <Ionicons 
              name="search" 
              size={20} 
              color={theme.colors.textSecondary} 
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, cuisine, or dietary preference..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchPotentialQuery}
              onChangeText={setSearchPotentialQuery}
            />
          </View>

          {filteredPotentialFriends.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                {searchPotentialQuery ? 'No users match your search' : 'Start typing to find people in your area'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredPotentialFriends}
              renderItem={renderPotentialFriend}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </Modal>

      {selectedUser && (
        <UserProfileModal
          visible={profileModalVisible}
          onClose={() => {
            setProfileModalVisible(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}
    </View>
  );
};
