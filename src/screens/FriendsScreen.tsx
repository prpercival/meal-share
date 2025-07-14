import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';
import { mockUsers, currentUser } from '../data/mockData';

export const FriendsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [friends, setFriends] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);

  useEffect(() => {
    // For now, all other users are considered friends
    // In a real app, this would come from a friends API
    const userFriends = mockUsers.filter(user => user.id !== currentUser.id);
    setFriends(userFriends);
    setFilteredFriends(userFriends);
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

  const handleMessageFriend = (friendId: string) => {
    // Handle messaging functionality
    console.log('Message friend:', friendId);
  };

  const handleViewProfile = (friendId: string) => {
    // Handle view profile functionality
    console.log('View profile:', friendId);
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
  });

  const renderFriend = ({ item }: { item: User }) => (
    <View style={styles.friendCard}>
      <View style={styles.friendHeader}>
        <Image 
          source={item.avatar} 
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

      {filteredFriends.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No friends match your search' : 'No friends yet!\nStart connecting with your community.'}
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
    </View>
  );
};
