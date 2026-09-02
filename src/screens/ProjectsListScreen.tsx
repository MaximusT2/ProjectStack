import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useProjects } from '../context/ProjectsContext';
import { Header } from '../components/Header';
import { BottomTabBar } from '../components/BottomTabBar';
import { AddProjectModal } from '../components/AddProjectModal';
import { SwipeableProjectCard } from '../components/SwipeableProjectCard';
import { ProjectCar } from '../types';

interface ProjectsListScreenProps {
  navigation: any;
}

export const ProjectsListScreen: React.FC<ProjectsListScreenProps> = ({ navigation }) => {
  const { projects, setSelectedProjectId, addProject, deleteProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProject = (project: ProjectCar) => {
    setSelectedProjectId(project.id);
    navigation.navigate('ProjectDetail', { projectId: project.id });
  };

  const handleTabPress = (tab: 'Projects' | 'Gallery' | 'Profile') => {
    if (tab === 'Gallery') {
      navigation.navigate('SavePhoto');
    } else if (tab === 'Profile') {
      navigation.navigate('Profile');
    }
  };

  const renderProjectItem = ({ item }: { item: ProjectCar }) => {
    return (
      <SwipeableProjectCard
        item={item}
        onPress={() => handleSelectProject(item)}
        onDelete={() => deleteProject(item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Header
          title="My project cars"
          leftType="menu"
          onLeftPress={() => {}}
          rightType="add"
          onRightPress={() => setIsAddModalOpen(true)}
        />

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color={theme.colors.ink} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search projects"
              placeholderTextColor={theme.colors.inkLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Feather name="x" size={16} color={theme.colors.ink} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Main List */}
        <View style={styles.listContainer}>
          {/* Project Count Badge */}
          <View style={styles.countContainer}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredProjects.length} cars</Text>
            </View>
          </View>

          {filteredProjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No projects match ‘{searchQuery}’</Text>
              <TouchableOpacity style={styles.clearSearchBtn} onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>Clear search</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredProjects}
              keyExtractor={(item) => item.id}
              renderItem={renderProjectItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Bottom Navigation */}
        <BottomTabBar currentTab="Projects" onTabPress={handleTabPress} />

        {/* Add Project Modal */}
        <AddProjectModal
          visible={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addProject}
        />
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
  searchSection: {
    backgroundColor: theme.colors.cobalt,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: theme.borders.ink.borderWidth,
    borderBottomColor: theme.borders.ink.borderColor,
  },
  searchBar: {
    height: 44,
    backgroundColor: theme.colors.paper,
    borderRadius: 7,
    borderWidth: 1.75,
    borderColor: theme.colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: theme.colors.ink,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  countContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  countBadge: {
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: theme.colors.paper,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  listContent: {
    gap: 10,
    paddingBottom: 20,
  },
  emptyState: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.ink,
    marginBottom: 12,
  },
  clearSearchBtn: {
    paddingVertical: 8,
  },
  clearSearchText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.cobalt,
    textDecorationLine: 'underline',
  },
});
