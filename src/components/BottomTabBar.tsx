import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface BottomTabBarProps {
  currentTab: 'Projects' | 'Gallery' | 'Profile';
  onTabPress: (tab: 'Projects' | 'Gallery' | 'Profile') => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={0.7}
        onPress={() => onTabPress('Projects')}
        accessibilityLabel="Projects tab"
      >
        <Ionicons
          name={currentTab === 'Projects' ? 'folder' : 'folder-outline'}
          size={22}
          color={currentTab === 'Projects' ? theme.colors.cobalt : theme.colors.ink}
        />
        <Text style={[styles.tabLabel, currentTab === 'Projects' && styles.activeTabLabel]}>
          Projects
        </Text>
        {currentTab === 'Projects' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={0.7}
        onPress={() => onTabPress('Gallery')}
        accessibilityLabel="Gallery tab"
      >
        <Ionicons
          name={currentTab === 'Gallery' ? 'images' : 'images-outline'}
          size={22}
          color={currentTab === 'Gallery' ? theme.colors.cobalt : theme.colors.ink}
        />
        <Text style={[styles.tabLabel, currentTab === 'Gallery' && styles.activeTabLabel]}>
          Gallery
        </Text>
        {currentTab === 'Gallery' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={0.7}
        onPress={() => onTabPress('Profile')}
        accessibilityLabel="Profile tab"
      >
        <Ionicons
          name={currentTab === 'Profile' ? 'person' : 'person-outline'}
          size={22}
          color={currentTab === 'Profile' ? theme.colors.cobalt : theme.colors.ink}
        />
        <Text style={[styles.tabLabel, currentTab === 'Profile' && styles.activeTabLabel]}>
          Profile
        </Text>
        {currentTab === 'Profile' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    backgroundColor: theme.colors.paper,
    borderTopWidth: theme.borders.ink.borderWidth,
    borderTopColor: theme.borders.ink.borderColor,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 12,
    color: theme.colors.ink,
    marginTop: 2,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: theme.colors.cobalt,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 26,
    height: 2.5,
    backgroundColor: theme.colors.cobalt,
    transform: [{ rotate: '-1deg' }],
  },
});
