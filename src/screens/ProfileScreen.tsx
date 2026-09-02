import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useProjects } from '../context/ProjectsContext';
import { Header } from '../components/Header';
import { BottomTabBar } from '../components/BottomTabBar';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { projects } = useProjects();

  const totalSpent = projects.reduce((sum, p) => sum + p.totalSpent, 0);
  const completedBuilds = projects.filter((p) => p.status === 'Completed').length;
  const inProgressBuilds = projects.filter((p) => p.status !== 'Completed').length;

  const handleTabPress = (tab: 'Projects' | 'Gallery' | 'Profile') => {
    if (tab === 'Projects') {
      navigation.navigate('ProjectsList');
    } else if (tab === 'Gallery') {
      navigation.navigate('SavePhoto');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Workshop Profile" leftType="none" rightType="settings" />

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={36} color={theme.colors.paper} />
            </View>
            <Text style={styles.userName}>Workshop Builder</Text>
            <Text style={styles.userRole}>Master Fabricator · Folio Member</Text>
          </View>

          {/* Stats Module */}
          <View style={styles.inkModule}>
            <Text style={styles.moduleTitle}>Workshop Overview</Text>

            <View style={styles.statGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{projects.length}</Text>
                <Text style={styles.statLabel}>Total Cars</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{inProgressBuilds}</Text>
                <Text style={styles.statLabel}>Active Builds</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{completedBuilds}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>

            <View style={styles.spendRow}>
              <Text style={styles.spendLabel}>Total Invested in Builds</Text>
              <Text style={styles.spendValue}>${totalSpent.toLocaleString()}</Text>
            </View>
          </View>

          {/* About / Settings Module */}
          <View style={styles.inkModule}>
            <Text style={styles.moduleTitle}>Workshop Settings</Text>

            <View style={styles.settingRow}>
              <Feather name="folder" size={18} color={theme.colors.ink} />
              <Text style={styles.settingText}>Storage Location</Text>
              <Text style={styles.settingValue}>Local Canvas</Text>
            </View>

            <View style={styles.settingRow}>
              <Feather name="cloud" size={18} color={theme.colors.ink} />
              <Text style={styles.settingText}>Cloud Sync</Text>
              <Text style={styles.settingValue}>Enabled</Text>
            </View>

            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <Feather name="info" size={18} color={theme.colors.ink} />
              <Text style={styles.settingText}>Version</Text>
              <Text style={styles.settingValue}>Folio 1.0 (Expo)</Text>
            </View>
          </View>
        </ScrollView>

        <BottomTabBar currentTab="Profile" onTabPress={handleTabPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.cobalt,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: theme.colors.paper,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: theme.colors.cobalt,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  userRole: {
    fontSize: 14,
    color: theme.colors.ink,
    opacity: 0.75,
  },
  inkModule: {
    backgroundColor: theme.colors.paper,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.pale,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.ink,
    opacity: 0.8,
  },
  spendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.rule,
  },
  spendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  spendValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.cobalt,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rule,
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  settingValue: {
    fontSize: 13,
    color: theme.colors.ink,
    opacity: 0.75,
  },
});
