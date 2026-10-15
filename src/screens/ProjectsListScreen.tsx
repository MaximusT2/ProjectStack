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

type StatusFilter = 'all' | ProjectCar['status'];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All vehicles' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Completed', label: 'Completed' },
  { key: 'Planning', label: 'Planning' },
];

export const ProjectsListScreen: React.FC<ProjectsListScreenProps> = ({ navigation }) => {
  const { projects, setSelectedProjectId, addProject, deleteProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedStatus === 'all' || project.status === selectedStatus)
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
          rightAccessory={
            <View style={styles.filterControl}>
              <TouchableOpacity
                style={[styles.filterButton, selectedStatus !== 'all' && styles.filterButtonActive]}
                onPress={() => setIsFilterMenuOpen((open) => !open)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={selectedStatus === 'all' ? 'Filter projects by status' : `Filter: ${selectedStatus}`}
                accessibilityState={{ expanded: isFilterMenuOpen }}
              >
                <Feather
                  name="filter"
                  size={18}
                  color={selectedStatus === 'all' ? theme.colors.paper : theme.colors.cobalt}
                />
              </TouchableOpacity>

              {isFilterMenuOpen && (
                <View style={styles.filterMenu}>
                  <Text style={styles.filterMenuTitle}>Vehicle status</Text>
                  {STATUS_FILTERS.map((filter) => (
                    <TouchableOpacity
                      key={filter.key}
                      style={[
                        styles.filterOption,
                        selectedStatus === filter.key && styles.filterOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedStatus(filter.key);
                        setIsFilterMenuOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedStatus === filter.key && styles.filterOptionTextSelected,
                        ]}
                      >
                        {filter.label}
                      </Text>
                      {selectedStatus === filter.key && (
                        <Feather name="check" size={16} color={theme.colors.cobalt} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          }
          showBottomBorder={false}
        />

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color={theme.colors.ink} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              underlineColorAndroid="transparent"
              placeholder="Search"
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
              <Text style={styles.emptyTitle}>No projects match these filters</Text>
              <TouchableOpacity
                style={styles.clearSearchBtn}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setIsFilterMenuOpen(false);
                }}
              >
                <Text style={styles.clearSearchText}>Clear filters</Text>
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
    paddingTop: 3,
    paddingBottom: 9,
    borderBottomWidth: theme.borders.ink.borderWidth,
    borderBottomColor: theme.borders.ink.borderColor,
    zIndex: 10,
  },
  searchBar: {
    width: '100%',
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
    outlineWidth: 0,
    outlineColor: 'transparent',
    fontSize: 16,
    color: theme.colors.ink,
  },
  clearButton: {
    padding: 4,
  },
  filterControl: {
    position: 'relative',
    zIndex: 20,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.paper,
  },
  filterMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 180,
    backgroundColor: theme.colors.paper,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.colors.ink,
    borderRadius: 8,
    paddingVertical: 4,
    zIndex: 30,
    elevation: 8,
    shadowColor: theme.colors.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  filterMenuTitle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.colors.inkLight,
    fontSize: 12,
    fontWeight: '700',
  },
  filterOption: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  filterOptionSelected: {
    backgroundColor: theme.colors.wash,
  },
  filterOptionText: {
    color: theme.colors.ink,
    fontSize: 14,
  },
  filterOptionTextSelected: {
    color: theme.colors.cobalt,
    fontWeight: '700',
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
