import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        }
      ]
    );
  };

  const handleMenuPress = (item: string) => {
    Alert.alert(item, `${item} feature coming soon!`);
  };

  return (
    <SafeAreaProvider>
      <ThemedView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
        
        <LinearGradient
          colors={isDark ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#E2E8F0']}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
          >
            
            {/* Profile Header */}
            <ThemedView style={[styles.profileCard, {
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
            }]}>
              <ThemedView style={styles.profileHeader}>
                <ThemedView style={[styles.avatarContainer, { 
                  backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)' 
                }]}>
                  <IconSymbol size={40} name="person.fill" color="#22C55E" />
                </ThemedView>
                
                <ThemedView style={styles.profileInfo}>
                  <ThemedText style={[styles.userName, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>
                    {user?.name || 'User Name'}
                  </ThemedText>
                  <ThemedText style={[styles.userPhone, { 
                    color: isDark ? '#94A3B8' : '#64748B' 
                  }]}>
                    {user?.phone || 'Phone Number'}
                  </ThemedText>
                  <ThemedView style={[styles.memberBadge, { 
                    backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)' 
                  }]}>
                    <IconSymbol size={12} name="star.fill" color="#F59E0B" />
                    <ThemedText style={[styles.memberText, { color: '#F59E0B' }]}>
                      Premium Member
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Impact Stats */}
            <ThemedView style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { 
                color: isDark ? '#E2E8F0' : '#334155' 
              }]}>
                Your Impact 🌱
              </ThemedText>
              <ThemedView style={styles.impactGrid}>
                <ThemedView style={[styles.impactCard, {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                }]}>
                  <ThemedView style={[styles.impactIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                    <IconSymbol size={24} name="calendar" color="#22C55E" />
                  </ThemedView>
                  <ThemedText style={[styles.impactNumber, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>45</ThemedText>
                  <ThemedText style={[styles.impactLabel, { 
                    color: isDark ? '#94A3B8' : '#64748B' 
                  }]}>Days Active</ThemedText>
                </ThemedView>
                
                <ThemedView style={[styles.impactCard, {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                }]}>
                  <ThemedView style={[styles.impactIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                    <IconSymbol size={24} name="leaf.fill" color="#3B82F6" />
                  </ThemedView>
                  <ThemedText style={[styles.impactNumber, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>127 kg</ThemedText>
                  <ThemedText style={[styles.impactLabel, { 
                    color: isDark ? '#94A3B8' : '#64748B' 
                  }]}>Waste Sorted</ThemedText>
                </ThemedView>
                
                <ThemedView style={[styles.impactCard, {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                }]}>
                  <ThemedView style={[styles.impactIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <IconSymbol size={24} name="star.fill" color="#F59E0B" />
                  </ThemedView>
                  <ThemedText style={[styles.impactNumber, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>1,247</ThemedText>
                  <ThemedText style={[styles.impactLabel, { 
                    color: isDark ? '#94A3B8' : '#64748B' 
                  }]}>Points Earned</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Household Info */}
            <ThemedView style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { 
                color: isDark ? '#E2E8F0' : '#334155' 
              }]}>
                Household Info 🏠
              </ThemedText>
              <ThemedView style={[styles.infoCard, {
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
              }]}>
                
                <ThemedView style={styles.infoRow}>
                  <ThemedView style={[styles.infoIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                    <IconSymbol size={20} name="house.fill" color="#22C55E" />
                  </ThemedView>
                  <ThemedView style={styles.infoContent}>
                    <ThemedText style={[styles.infoLabel, { 
                      color: isDark ? '#94A3B8' : '#64748B' 
                    }]}>Address</ThemedText>
                    <ThemedText style={[styles.infoValue, { 
                      color: isDark ? '#F1F5F9' : '#1E293B' 
                    }]}>{user?.address || 'Not provided'}</ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedView style={styles.infoRow}>
                  <ThemedView style={[styles.infoIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                    <IconSymbol size={20} name="person.2.fill" color="#3B82F6" />
                  </ThemedView>
                  <ThemedView style={styles.infoContent}>
                    <ThemedText style={[styles.infoLabel, { 
                      color: isDark ? '#94A3B8' : '#64748B' 
                    }]}>Household Members</ThemedText>
                    <ThemedText style={[styles.infoValue, { 
                      color: isDark ? '#F1F5F9' : '#1E293B' 
                    }]}>{user?.householdMembers || 1} people</ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedView style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                  <ThemedView style={[styles.infoIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <IconSymbol size={20} name="envelope.fill" color="#F59E0B" />
                  </ThemedView>
                  <ThemedView style={styles.infoContent}>
                    <ThemedText style={[styles.infoLabel, { 
                      color: isDark ? '#94A3B8' : '#64748B' 
                    }]}>Email</ThemedText>
                    <ThemedText style={[styles.infoValue, { 
                      color: isDark ? '#F1F5F9' : '#1E293B' 
                    }]}>{user?.email || 'Not provided'}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Settings Menu */}
            <ThemedView style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { 
                color: isDark ? '#E2E8F0' : '#334155' 
              }]}>
                Account Settings ⚙️
              </ThemedText>
              <ThemedView style={[styles.menuCard, {
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
              }]}>
                
                <Pressable style={styles.menuItem} onPress={() => handleMenuPress('Edit Profile')}>
                  <ThemedView style={[styles.menuIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                    <IconSymbol size={20} name="pencil" color="#22C55E" />
                  </ThemedView>
                  <ThemedText style={[styles.menuText, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>Edit Profile</ThemedText>
                  <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
                </Pressable>
                
                <Pressable style={styles.menuItem} onPress={() => handleMenuPress('Notification Settings')}>
                  <ThemedView style={[styles.menuIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                    <IconSymbol size={20} name="bell.fill" color="#3B82F6" />
                  </ThemedView>
                  <ThemedText style={[styles.menuText, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>Notification Settings</ThemedText>
                  <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
                </Pressable>
                
                <Pressable style={styles.menuItem} onPress={() => handleMenuPress('Rewards & History')}>
                  <ThemedView style={[styles.menuIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <IconSymbol size={20} name="star.fill" color="#F59E0B" />
                  </ThemedView>
                  <ThemedText style={[styles.menuText, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>Rewards & History</ThemedText>
                  <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
                </Pressable>
                
                <Pressable style={styles.menuItem} onPress={() => handleMenuPress('Help & Support')}>
                  <ThemedView style={[styles.menuIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                    <IconSymbol size={20} name="questionmark.circle.fill" color="#8B5CF6" />
                  </ThemedView>
                  <ThemedText style={[styles.menuText, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>Help & Support</ThemedText>
                  <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
                </Pressable>
                
                <Pressable style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => handleMenuPress('Privacy Policy')}>
                  <ThemedView style={[styles.menuIcon, { backgroundColor: 'rgba(107, 114, 128, 0.15)' }]}>
                    <IconSymbol size={20} name="shield.fill" color="#6B7280" />
                  </ThemedView>
                  <ThemedText style={[styles.menuText, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>Privacy Policy</ThemedText>
                  <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
                </Pressable>
              </ThemedView>
            </ThemedView>

            {/* Logout Button */}
            <ThemedView style={styles.section}>
              <Pressable onPress={handleLogout}>
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoutButton}
                >
                  <IconSymbol size={20} name="arrow.right.square.fill" color="white" />
                  <ThemedText style={styles.logoutText}>Logout</ThemedText>
                </LinearGradient>
              </Pressable>
            </ThemedView>

            <ThemedView style={{ height: Platform.OS === 'ios' ? 100 : 80 }} />
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  memberText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  impactGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  impactCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  impactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  impactNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
