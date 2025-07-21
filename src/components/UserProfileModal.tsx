import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  onClose,
  user,
}) => {
  const { theme } = useTheme();

  const formatJoinedDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 20,
      width: '100%',
      maxHeight: '80%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    closeButton: {
      padding: 8,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    onlineIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.success,
      marginRight: 6,
    },
    statusText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 12,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    location: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    ratingText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: 4,
    },
    exchangeCount: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    bio: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 22,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    infoLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
      flex: 2,
      textAlign: 'right',
    },
    specialtiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    specialtyTag: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    specialtyText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    dietaryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    dietaryTag: {
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    dietaryText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    emptyState: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.statusIndicator}>
                <View style={styles.onlineIndicator} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.profileSection}>
              <Image 
                source={typeof user.avatar === 'string' ? { uri: user.avatar } : user.avatar}
                style={styles.avatar} 
              />
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.location}>{user.location.address}</Text>
              
              <View style={styles.rating}>
                <Ionicons name="star" size={18} color="#FFD700" />
                <Text style={styles.ratingText}>{user.rating}</Text>
              </View>
              
              <Text style={styles.exchangeCount}>
                {user.totalExchanges} meal exchanges
              </Text>
            </View>

            {user.bio && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.bio}>{user.bio}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cooking Level</Text>
                <Text style={styles.infoValue}>
                  {user.cookingLevel || 'Not specified'}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {formatJoinedDate(user.joinedDate)}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cooking Specialties</Text>
              {user.cookingSpecialties.length > 0 ? (
                <View style={styles.specialtiesContainer}>
                  {user.cookingSpecialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyTag}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyState}>No specialties listed</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dietary Preferences</Text>
              {user.dietaryPreferences.length > 0 ? (
                <View style={styles.dietaryContainer}>
                  {user.dietaryPreferences.map((preference, index) => (
                    <View key={index} style={styles.dietaryTag}>
                      <Text style={styles.dietaryText}>{preference}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyState}>No dietary restrictions</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
