import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useProjects } from '../context/ProjectsContext';
import { Header } from '../components/Header';
import { BottomTabBar } from '../components/BottomTabBar';
import { SegmentedProgressBar } from '../components/SegmentedProgressBar';
import { PhotoViewerModal } from '../components/PhotoViewerModal';
import { SwipeableChecklistRow } from '../components/SwipeableChecklistRow';
import { SwipeableExpenseRow } from '../components/SwipeableExpenseRow';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { CarIllustration } from '../components/CarIllustration';
import { PhotoItem, ExpenseCategory } from '../types';

interface ProjectDetailScreenProps {
  route: any;
  navigation: any;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({ route, navigation }) => {
  const { projectId } = route.params || { projectId: 'bmw-e30-drift-build' };
  const {
    getProject,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    addExpenseToProject,
    deleteExpenseFromProject,
  } = useProjects();

  const project = getProject(projectId);

  const [showIllustration, setShowIllustration] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [isAllPhotosModalOpen, setIsAllPhotosModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [selectedExpenseFilter, setSelectedExpenseFilter] = useState<'all' | ExpenseCategory>('all');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);

  if (!project) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title="Project" leftType="back" onLeftPress={() => navigation.goBack()} />
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>Project not found</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const completedCount = project.checklist.filter((item) => item.completed).length;
  const totalCount = project.checklist.length;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 3 most recent photos (latest added first)
  const recentPhotos = [...project.photos].slice(-3).reverse();

  // Filtered expenses
  const expensesList = project.expenses || [];
  const filteredExpenses = selectedExpenseFilter === 'all'
    ? expensesList
    : expensesList.filter((e) => e.category === selectedExpenseFilter);

  const totalExpenseSum = expensesList.reduce((sum, e) => sum + e.amount, 0);

  const handleOpenPhoto = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
    setIsPhotoViewerOpen(true);
  };

  const handleAddChecklistSubmit = () => {
    if (newChecklistText.trim()) {
      addChecklistItem(project.id, newChecklistText.trim());
      setNewChecklistText('');
      setIsAddingChecklist(false);
    }
  };

  const handleTabPress = (tab: 'Projects' | 'Gallery' | 'Profile') => {
    if (tab === 'Projects') {
      navigation.navigate('ProjectsList');
    } else if (tab === 'Gallery') {
      navigation.navigate('SavePhoto');
    } else if (tab === 'Profile') {
      navigation.navigate('Profile');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Header
          title={project.title}
          leftType="back"
          onLeftPress={() => navigation.goBack()}
          rightType="settings"
          onRightPress={() => {}}
        />

        {/* Scrollable Main Content */}
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {/* Hero Window */}
          <View style={styles.heroWindow}>
            {showIllustration ? (
              <CarIllustration width="100%" height="100%" />
            ) : project.image ? (
              <Image source={project.image} style={styles.heroPhoto} resizeMode="cover" />
            ) : (
              <CarIllustration width="100%" height="100%" />
            )}

            {/* View Mode Toggle Switch */}
            <TouchableOpacity
              style={styles.heroToggle}
              activeOpacity={0.8}
              onPress={() => setShowIllustration(!showIllustration)}
            >
              <Ionicons
                name={showIllustration ? 'image' : 'color-palette'}
                size={14}
                color={theme.colors.paper}
              />
              <Text style={styles.heroToggleText}>
                {showIllustration ? 'Photo view' : 'Blueprint view'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Checklist Module */}
          <View style={styles.inkModule}>
            <View style={styles.moduleHeader}>
              <Text style={styles.sectionHeading}>Checklist</Text>
              <Text style={styles.summaryText}>
                {completedCount} of {totalCount} completed · {percentCompleted}%
              </Text>
            </View>

            {/* Segmented Progress Bar */}
            <SegmentedProgressBar total={totalCount} completed={completedCount} />

            {/* Swipeable Checklist items */}
            {project.checklist.map((item) => (
              <SwipeableChecklistRow
                key={item.id}
                item={item}
                onToggle={() => toggleChecklistItem(project.id, item.id)}
                onDelete={() => deleteChecklistItem(project.id, item.id)}
              />
            ))}

            {/* Add Checklist Item */}
            {isAddingChecklist ? (
              <View style={styles.addChecklistRow}>
                <TextInput
                  style={styles.addChecklistInput}
                  placeholder="New task item..."
                  placeholderTextColor={theme.colors.inkLight}
                  value={newChecklistText}
                  onChangeText={setNewChecklistText}
                  autoFocus
                  onSubmitEditing={handleAddChecklistSubmit}
                />
                <TouchableOpacity style={styles.addChecklistSave} onPress={handleAddChecklistSubmit}>
                  <Text style={styles.addChecklistSaveText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addChecklistCancel}
                  onPress={() => setIsAddingChecklist(false)}
                >
                  <Feather name="x" size={18} color={theme.colors.ink} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addChecklistTrigger}
                onPress={() => setIsAddingChecklist(true)}
              >
                <Feather name="plus" size={16} color={theme.colors.cobalt} />
                <Text style={styles.addChecklistTriggerText}>Add checklist task</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Recent Photos Module (Static Layout) */}
          <View style={styles.inkModule}>
            <View style={styles.moduleHeader}>
              <Text style={styles.sectionHeading}>Recent Photos</Text>
              <Text style={styles.summaryText}>{project.photos.length} photos</Text>
            </View>

            {/* Static 4-Column Grid: 3 Recent Photos + View All */}
            <View style={styles.staticPhotoRow}>
              {recentPhotos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.staticPhotoThumb}
                  activeOpacity={0.7}
                  onPress={() => handleOpenPhoto(photo)}
                >
                  {photo.localAsset ? (
                    <Image source={photo.localAsset} style={styles.thumbImage} resizeMode="cover" />
                  ) : photo.uri ? (
                    <Image source={{ uri: photo.uri }} style={styles.thumbImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.thumbPlaceholder}>
                      <Feather name="image" size={20} color={theme.colors.cobalt} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              {/* View All Photos Button */}
              <TouchableOpacity
                style={styles.staticViewAllButton}
                activeOpacity={0.7}
                onPress={() => setIsAllPhotosModalOpen(true)}
              >
                <Ionicons name="images" size={20} color={theme.colors.cobalt} />
                <Text style={styles.staticViewAllText} numberOfLines={2}>
                  View all photos
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Build Expenses & Receipts Module */}
          <View style={styles.inkModule}>
            <View style={styles.moduleHeader}>
              <Text style={styles.sectionHeading}>Build Expenses</Text>
              <View style={styles.totalBadge}>
                <Text style={styles.totalBadgeText}>Total: ${totalExpenseSum.toLocaleString()}</Text>
              </View>
            </View>

            {/* Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPillsScroll}>
              <View style={styles.filterPillsRow}>
                {(
                  [
                    { key: 'all', label: 'All' },
                    { key: 'wof_reg', label: 'WOF & Reg' },
                    { key: 'parts', label: 'Parts' },
                    { key: 'labor', label: 'Labor' },
                    { key: 'fluids', label: 'Fluids' },
                  ] as const
                ).map((f) => {
                  const isSelected = selectedExpenseFilter === f.key;
                  return (
                    <TouchableOpacity
                      key={f.key}
                      style={[styles.filterPill, isSelected && styles.filterPillSelected]}
                      onPress={() => setSelectedExpenseFilter(f.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.filterPillText, isSelected && styles.filterPillTextSelected]}>
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Expenses List */}
            {filteredExpenses.length === 0 ? (
              <View style={styles.emptyExpensesBox}>
                <Text style={styles.emptyExpensesText}>No expenses logged in this category.</Text>
              </View>
            ) : (
              filteredExpenses.map((exp) => (
                <SwipeableExpenseRow
                  key={exp.id}
                  item={exp}
                  onDelete={() => deleteExpenseFromProject(project.id, exp.id)}
                />
              ))
            )}

            {/* Log Expense Action Button */}
            <TouchableOpacity
              style={styles.addExpenseTrigger}
              activeOpacity={0.7}
              onPress={() => setIsAddExpenseModalOpen(true)}
            >
              <Feather name="plus" size={16} color={theme.colors.cobalt} />
              <Text style={styles.addExpenseTriggerText}>Log expense (Parts, WOF, Rego)</Text>
            </TouchableOpacity>
          </View>

          {/* Technical Specifications Module */}
          <View style={styles.inkModule}>
            <Text style={[styles.sectionHeading, { marginBottom: 8 }]}>Technical specifications</Text>
            {project.specs.map((spec, index) => (
              <View
                key={spec.id}
                style={[styles.specRow, index === 0 && { borderTopWidth: 0 }]}
              >
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomTabBar currentTab="Projects" onTabPress={handleTabPress} />

        {/* Fullscreen Photo Viewer Modal */}
        <PhotoViewerModal
          visible={isPhotoViewerOpen}
          photo={selectedPhoto}
          onClose={() => setIsPhotoViewerOpen(false)}
        />

        {/* Add Expense Modal */}
        <AddExpenseModal
          visible={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
          onAdd={(exp) => addExpenseToProject(project.id, exp)}
        />

        {/* All Photos Gallery Modal */}
        <Modal
          visible={isAllPhotosModalOpen}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setIsAllPhotosModalOpen(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>All Photos ({project.photos.length})</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setIsAllPhotosModalOpen(false)}
                  activeOpacity={0.7}
                >
                  <Feather name="x" size={24} color={theme.colors.paper} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.allPhotosContent} contentContainerStyle={styles.allPhotosGrid}>
                {project.photos.length === 0 ? (
                  <View style={styles.emptyPhotosState}>
                    <Feather name="image" size={40} color={theme.colors.inkLight} />
                    <Text style={styles.emptyPhotosText}>No photos added yet</Text>
                  </View>
                ) : (
                  project.photos.map((photo, index) => (
                    <TouchableOpacity
                      key={photo.id}
                      style={styles.galleryCard}
                      activeOpacity={0.8}
                      onPress={() => {
                        handleOpenPhoto(photo);
                      }}
                    >
                      <View style={styles.galleryImageContainer}>
                        {photo.localAsset ? (
                          <Image source={photo.localAsset} style={styles.galleryImage} resizeMode="cover" />
                        ) : photo.uri ? (
                          <Image source={{ uri: photo.uri }} style={styles.galleryImage} resizeMode="cover" />
                        ) : (
                          <View style={styles.galleryPlaceholder}>
                            <Feather name="image" size={28} color={theme.colors.cobalt} />
                          </View>
                        )}
                      </View>
                      <View style={styles.galleryCardInfo}>
                        <Text style={styles.galleryCardTitle} numberOfLines={1}>
                          {photo.title}
                        </Text>
                        <Text style={styles.galleryCardCaption} numberOfLines={1}>
                          {photo.caption || `${index + 1} of ${project.photos.length} · ${project.title}`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  heroWindow: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 14,
    backgroundColor: theme.colors.wash,
    overflow: 'hidden',
    position: 'relative',
  },
  heroPhoto: {
    width: '100%',
    height: '100%',
  },
  heroToggle: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: theme.colors.ink,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroToggleText: {
    color: theme.colors.paper,
    fontSize: 11,
    fontWeight: '700',
  },
  inkModule: {
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 12,
    backgroundColor: theme.colors.paper,
    padding: 14,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  totalBadge: {
    backgroundColor: theme.colors.pale,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  totalBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  filterPillsScroll: {
    marginTop: 8,
    marginBottom: 4,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: theme.colors.rule,
    backgroundColor: theme.colors.paper,
  },
  filterPillSelected: {
    backgroundColor: theme.colors.cobalt,
    borderColor: theme.colors.cobalt,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  filterPillTextSelected: {
    color: theme.colors.paper,
    fontWeight: '700',
  },
  emptyExpensesBox: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  emptyExpensesText: {
    fontSize: 13,
    color: theme.colors.ink,
    opacity: 0.7,
  },
  addExpenseTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.rule,
    marginTop: 6,
  },
  addExpenseTriggerText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.cobalt,
  },
  addChecklistTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.rule,
  },
  addChecklistTriggerText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.cobalt,
  },
  addChecklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.rule,
  },
  addChecklistInput: {
    flex: 1,
    height: 38,
    backgroundColor: theme.colors.pale,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.ink,
    paddingHorizontal: 10,
    fontSize: 14,
    color: theme.colors.ink,
  },
  addChecklistSave: {
    backgroundColor: theme.colors.cobalt,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addChecklistSaveText: {
    color: theme.colors.paper,
    fontWeight: '700',
    fontSize: 13,
  },
  addChecklistCancel: {
    padding: 6,
  },
  staticPhotoRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    width: '100%',
  },
  staticPhotoThumb: {
    flex: 1,
    height: 68,
    borderWidth: 1.75,
    borderColor: theme.colors.ink,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: theme.colors.wash,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staticViewAllButton: {
    flex: 1,
    height: 68,
    borderWidth: 1.75,
    borderColor: theme.colors.cobalt,
    borderRadius: 7,
    backgroundColor: theme.colors.wash,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 3,
  },
  staticViewAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.cobaltDeep,
    textAlign: 'center',
    lineHeight: 13,
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: theme.colors.rule,
  },
  specLabel: {
    width: 90,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  specValue: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.ink,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: theme.colors.cobalt,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  modalHeader: {
    height: 56,
    backgroundColor: theme.colors.cobalt,
    borderBottomWidth: theme.borders.ink.borderWidth,
    borderBottomColor: theme.borders.ink.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.paper,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allPhotosContent: {
    flex: 1,
  },
  allPhotosGrid: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  emptyPhotosState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyPhotosText: {
    fontSize: 16,
    color: theme.colors.ink,
    fontWeight: '600',
  },
  galleryCard: {
    backgroundColor: theme.colors.paper,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: theme.colors.wash,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryCardInfo: {
    padding: 10,
    gap: 2,
    borderTopWidth: 1,
    borderTopColor: theme.colors.rule,
  },
  galleryCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  galleryCardCaption: {
    fontSize: 13,
    color: theme.colors.ink,
    opacity: 0.8,
  },
});
