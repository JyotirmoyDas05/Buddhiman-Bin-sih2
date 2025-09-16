import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const handleQuickAction = (action: string) => {
    Alert.alert('Feature Coming Soon', `${action} feature will be available in the next update!`);
  };

  return (
    <SafeAreaProvider>
      <ThemedView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
        
        {/* Subtle Background Gradient */}
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
            
            {/* Welcome Header */}
            <ThemedView style={[styles.headerCard, {
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
            }]}>
              <ThemedView style={styles.headerContent}>
                <ThemedView style={styles.welcomeSection}>
                  <ThemedText style={[styles.greeting, { 
                    color: isDark ? '#E2E8F0' : '#475569' 
                  }]}>
                    Good Evening 👋
                  </ThemedText>
                  <ThemedText style={[styles.userName, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>
                    {user?.name?.split(' ')[0] || 'User'}
                  </ThemedText>
                  <ThemedText style={[styles.subtitle, { 
                    color: isDark ? '#94A3B8' : '#64748B' 
                  }]}>
                    Your eco-friendly dashboard
                  </ThemedText>
                </ThemedView>
                
                <ThemedView style={[styles.statusIndicator, {
                  backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)'
                }]}>
                  <ThemedView style={[styles.onlineDot, { backgroundColor: '#22C55E' }]} />
                  <ThemedText style={[styles.statusText, { color: '#22C55E' }]}>Online</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Stats Cards */}
            <ThemedView style={styles.statsSection}>
              <ThemedText style={[styles.sectionTitle, { 
                color: isDark ? '#E2E8F0' : '#334155' 
              }]}>
                Today's Impact ✨
              </ThemedText>
              
              <ThemedView style={styles.statsGrid}>
                <ThemedView style={[styles.statCard, {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                }]}>
                  <ThemedView style={[styles.iconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                    <IconSymbol size={24} name="trash.fill" color="#22C55E" />
                  </ThemedView>
                  <ThemedText style={[styles.statNumber, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>4.2 kg</ThemedText>
                  <ThemedText style={[styles.statLabel, { 
                    color: isDark ? '#94A3B8' : '#64748B' 
                  }]}>Waste Sorted</ThemedText>
                </ThemedView>

                <ThemedView style={[styles.statCard, {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                }]}>
                  <ThemedView style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                    <IconSymbol size={24} name="arrow.3.trianglepath" color="#3B82F6" />
                  </ThemedView>
                  <ThemedText style={[styles.statNumber, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>3.1 kg</ThemedText>
                  <ThemedText style={[styles.statLabel, { 
                    color: isDark ? '#94A3B8' : '#64748B' 
                  }]}>Recycled</ThemedText>
                </ThemedView>

                <ThemedView style={[styles.statCard, {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                }]}>
                  <ThemedView style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <IconSymbol size={24} name="star.fill" color="#F59E0B" />
                  </ThemedView>
                  <ThemedText style={[styles.statNumber, { 
                    color: isDark ? '#F1F5F9' : '#1E293B' 
                  }]}>+25</ThemedText>
                  <ThemedText style={[styles.statLabel, { 
                    color: isDark ? '#94A3B8' : '#64748B' 
                  }]}>Points</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Quick Actions */}
            <ThemedView style={styles.actionsSection}>
              <ThemedText style={[styles.sectionTitle, { 
                color: isDark ? '#E2E8F0' : '#334155' 
              }]}>
                Quick Actions 🚀
              </ThemedText>
              
              {/* Fixed Primary Action Button */}
              <Pressable onPress={() => handleQuickAction('Manual Sort')}>
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryActionButton}
                >
                  <IconSymbol size={20} name="hand.raised.fill" color="#FFFFFF" />
                  <ThemedText style={styles.primaryActionText}>Sort Waste Manually</ThemedText>
                  <IconSymbol size={16} name="chevron.right" color="#FFFFFF" />
                </LinearGradient>
              </Pressable>

              {/* Secondary Actions */}
              <ThemedView style={styles.secondaryGrid}>
                <Pressable onPress={() => handleQuickAction('View Reports')}>
                  <ThemedView style={[styles.secondaryAction, {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                  }]}>
                    <ThemedView style={[styles.secondaryIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                      <IconSymbol size={20} name="chart.line.uptrend.xyaxis" color="#8B5CF6" />
                    </ThemedView>
                    <ThemedText style={[styles.secondaryText, { 
                      color: isDark ? '#E2E8F0' : '#334155' 
                    }]}>Reports</ThemedText>
                  </ThemedView>
                </Pressable>
                
                <Pressable onPress={() => handleQuickAction('Rewards')}>
                  <ThemedView style={[styles.secondaryAction, {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                  }]}>
                    <ThemedView style={[styles.secondaryIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                      <IconSymbol size={20} name="gift.fill" color="#F59E0B" />
                    </ThemedView>
                    <ThemedText style={[styles.secondaryText, { 
                      color: isDark ? '#E2E8F0' : '#334155' 
                    }]}>Rewards</ThemedText>
                  </ThemedView>
                </Pressable>
              </ThemedView>
            </ThemedView>

            {/* Recent Activity */}
            <ThemedView style={styles.activitySection}>
              <ThemedText style={[styles.sectionTitle, { 
                color: isDark ? '#E2E8F0' : '#334155' 
              }]}>
                Recent Activity 📈
              </ThemedText>
              
              <ThemedView style={[styles.activityCard, {
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)'
              }]}>
                <ThemedView style={styles.activityItem}>
                  <ThemedView style={[styles.activityIconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                    <IconSymbol size={16} name="checkmark" color="#22C55E" />
                  </ThemedView>
                  <ThemedView style={styles.activityContent}>
                    <ThemedText style={[styles.activityTitle, { 
                      color: isDark ? '#F1F5F9' : '#1E293B' 
                    }]}>Organic waste sorted</ThemedText>
                    <ThemedText style={[styles.activityTimeText, { 
                      color: isDark ? '#94A3B8' : '#64748B' 
                    }]}>2.3 kg • 2 hours ago</ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.activityItem}>
                  <ThemedView style={[styles.activityIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                    <IconSymbol size={16} name="arrow.3.trianglepath" color="#3B82F6" />
                  </ThemedView>
                  <ThemedView style={styles.activityContent}>
                    <ThemedText style={[styles.activityTitle, { 
                      color: isDark ? '#F1F5F9' : '#1E293B' 
                    }]}>Plastic recycled</ThemedText>
                    <ThemedText style={[styles.activityTimeText, { 
                      color: isDark ? '#94A3B8' : '#64748B' 
                    }]}>1.1 kg • Yesterday</ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={[styles.activityItem, { borderBottomWidth: 0 }]}>
                  <ThemedView style={[styles.activityIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <IconSymbol size={16} name="star.fill" color="#F59E0B" />
                  </ThemedView>
                  <ThemedView style={styles.activityContent}>
                    <ThemedText style={[styles.activityTitle, { 
                      color: isDark ? '#F1F5F9' : '#1E293B' 
                    }]}>Earned reward points</ThemedText>
                    <ThemedText style={[styles.activityTimeText, { 
                      color: isDark ? '#94A3B8' : '#64748B' 
                    }]}>+50 points • 2 days ago</ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Bottom Padding for Tab Bar */}
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
  headerCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 24,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 12,
  },
  secondaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTimeText: {
    fontSize: 14,
    fontWeight: '400',
  },
});
