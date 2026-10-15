import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useProjects } from '../context/ProjectsContext';
import { Header } from '../components/Header';
import { BottomTabBar } from '../components/BottomTabBar';
import { DiscardDialog } from '../components/DiscardDialog';
import { LogType, ExpenseCategory } from '../types';

const LOG_TYPE_LABELS: Record<LogType, string> = {
  'new-part': 'New part',
  repair: 'Repair',
  inspection: 'Inspection',
  note: 'Note',
  'car-photo': 'Photo',
};

interface SavePhotoScreenProps {
  navigation: any;
}

export const SavePhotoScreen: React.FC<SavePhotoScreenProps> = ({ navigation }) => {
  const {
    projects,
    selectedProjectId,
    addPhotoToProject,
    addExpenseToProject,
    currentDraftPhoto,
    setCurrentDraftPhoto,
  } = useProjects();

  const [targetProjectId, setTargetProjectId] = useState(selectedProjectId || 'bmw-e30-drift-build');
  const [logType, setLogType] = useState<LogType>('new-part');
  const [specificPart, setSpecificPart] = useState('Coilover fit');
  const [costAmount, setCostAmount] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Dropdown selector modal states
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isLogTypeDropdownOpen, setIsLogTypeDropdownOpen] = useState(false);

  const selectedProjectObj = projects.find((p) => p.id === targetProjectId) || projects[0];
  const isCarPhoto = logType === 'car-photo';
  const previewSubtitle = isCarPhoto || !specificPart.trim()
    ? undefined
    : `${specificPart.trim()} · Detail view`;

  const handleRetakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].uri) {
      setCurrentDraftPhoto({
        uri: result.assets[0].uri,
        title: isCarPhoto ? 'Car photo' : 'Workshop capture',
      });
      setIsDirty(true);
    }
  };

  const handleLogAndSave = async () => {
    if (isCarPhoto && !currentDraftPhoto?.uri) {
      Alert.alert('Photo required', 'Take a photo before saving a car photo log.');
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    setTimeout(() => {
      // 1. Add photo to project
      addPhotoToProject(targetProjectId, {
        title: isCarPhoto
          ? `${selectedProjectObj?.title || 'Car'} photo`
          : specificPart
          ? `${specificPart} install`
          : 'Workshop photo',
        caption: `Log: ${LOG_TYPE_LABELS[logType]} · ${selectedProjectObj?.title}`,
        uri: currentDraftPhoto?.uri,
        logType,
        specificPart: isCarPhoto ? undefined : specificPart,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      });

      // 2. If cost was entered, also log as an expense!
      const numericCost = parseFloat(costAmount.replace(/[^0-9.]/g, ''));
      if (numericCost && numericCost > 0 && !isCarPhoto) {
        let cat: ExpenseCategory = 'parts';
        if (logType === 'repair') cat = 'labor';
        else if (logType === 'inspection') cat = 'wof_reg';

        addExpenseToProject(targetProjectId, {
          title: specificPart ? `${specificPart} (${logType})` : 'New part / Receipt',
          amount: numericCost,
          category: cat,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          notes: `Logged via Photo Capture (${logType})`,
        });
      }

      setIsSaving(false);
      setSaveStatus(`Saved photo & logs to ${selectedProjectObj?.title}!`);
      setIsDirty(false);

      setTimeout(() => {
        navigation.navigate('ProjectDetail', { projectId: targetProjectId });
      }, 800);
    }, 600);
  };

  const handleSaveToDevice = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('Photo saved to local device gallery!');
      setIsDirty(false);
    }, 400);
  };

  const handleBackPress = () => {
    if (isDirty) {
      setIsDiscardDialogOpen(true);
    } else {
      navigation.goBack();
    }
  };

  const handleTabPress = (tab: 'Projects' | 'Gallery' | 'Profile') => {
    if (tab === 'Projects') {
      if (isDirty) {
        setIsDiscardDialogOpen(true);
      } else {
        navigation.navigate('ProjectsList');
      }
    } else if (tab === 'Profile') {
      navigation.navigate('Profile');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Header title="Gallery" leftType="back" onLeftPress={handleBackPress} />

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {/* Photo Preview Frame */}
          <View style={styles.previewFrame}>
            {currentDraftPhoto?.uri ? (
              <Image source={{ uri: currentDraftPhoto.uri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.previewPlaceholder}>
                <Feather name="image" size={24} color={theme.colors.inkLight} />
                <Text style={styles.previewPlaceholderText}>No image yet</Text>
              </View>
            )}
          </View>

          {/* Photo Info & Retake */}
          <View style={styles.previewInfo}>
            <Text style={styles.previewHeading}>Photo preview</Text>
            {currentDraftPhoto?.uri ? (
              <>
                <Text style={styles.previewTitle}>
                  Last taken: {currentDraftPhoto.title || 'Workshop photo'}
                </Text>
                {previewSubtitle ? (
                  <Text style={styles.previewSubtitle}>{previewSubtitle}</Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.previewTitle}>No photo selected</Text>
            )}

            <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto} activeOpacity={0.7}>
              <Feather name="camera" size={16} color={theme.colors.ink} />
              <Text style={styles.retakeButtonText}>Retake photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form: Save to project */}
          <View style={styles.fieldset}>
            <Text style={styles.legend}>Save to project</Text>

            <View style={styles.formContent}>
              {/* Project Select */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Project</Text>
                <TouchableOpacity
                  style={styles.selectControl}
                  onPress={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectText}>{selectedProjectObj?.title || 'Select Project'}</Text>
                  <Feather name="chevron-down" size={18} color={theme.colors.ink} />
                </TouchableOpacity>

                {isProjectDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {projects.map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        style={[styles.dropdownItem, targetProjectId === p.id && styles.dropdownItemSelected]}
                        onPress={() => {
                          setTargetProjectId(p.id);
                          setIsProjectDropdownOpen(false);
                          setIsDirty(true);
                        }}
                      >
                        <Text style={[styles.dropdownItemText, targetProjectId === p.id && styles.dropdownItemTextSelected]}>
                          {p.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Log Type Select */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Log type</Text>
                <TouchableOpacity
                  style={styles.selectControl}
                  onPress={() => setIsLogTypeDropdownOpen(!isLogTypeDropdownOpen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectText}>{LOG_TYPE_LABELS[logType]}</Text>
                  <Feather name="chevron-down" size={18} color={theme.colors.ink} />
                </TouchableOpacity>

                {isLogTypeDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {(Object.keys(LOG_TYPE_LABELS) as LogType[]).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.dropdownItem, logType === type && styles.dropdownItemSelected]}
                        onPress={() => {
                          setLogType(type);
                          setIsLogTypeDropdownOpen(false);
                          setIsDirty(true);
                        }}
                      >
                        <Text style={[styles.dropdownItemText, logType === type && styles.dropdownItemTextSelected]}>
                          {LOG_TYPE_LABELS[type]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Specific Part Input */}
              {!isCarPhoto && <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Specific part <Text style={styles.optionalText}>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
                  value={specificPart}
                  onChangeText={(val) => {
                    setSpecificPart(val);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. Coilover fit"
                  placeholderTextColor={theme.colors.inkLight}
                />
              </View>}

              {/* Expense Cost ($) Input */}
              {!isCarPhoto && <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Cost ($) <Text style={styles.optionalText}>(optional expense tracking)</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
                  value={costAmount}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    setCostAmount(val);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. 1950 (auto-adds to build expenses)"
                  placeholderTextColor={theme.colors.inkLight}
                />
              </View>}

              {/* Status feedback */}
              {saveStatus && (
                <View style={styles.statusBox}>
                  <Feather name="check-circle" size={16} color={theme.colors.green} />
                  <Text style={styles.statusText}>{saveStatus}</Text>
                </View>
              )}

              {/* Primary Action Button */}
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryActionButton]}
                onPress={handleLogAndSave}
                disabled={isSaving}
                activeOpacity={0.8}
              >
                {isSaving ? (
                  <ActivityIndicator color={theme.colors.paper} size="small" />
                ) : (
                  <Text style={styles.primaryActionText}>Log and save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR SAVE LOCALLY</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form: Save to device */}
          <View style={styles.fieldset}>
            <Text style={styles.legend}>Save to device</Text>

            <View style={styles.formContent}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Project</Text>
                <View style={styles.selectControl}>
                  <Text style={styles.selectText}>None (local save)</Text>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Log type</Text>
                <View style={styles.selectControl}>
                  <Text style={styles.selectText}>Local photo</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryActionButton]}
                onPress={handleSaveToDevice}
                disabled={isSaving}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryActionText}>Save to device</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomTabBar currentTab="Gallery" onTabPress={handleTabPress} />

        {/* Discard Dialog */}
        <DiscardDialog
          visible={isDiscardDialogOpen}
          onKeepEditing={() => setIsDiscardDialogOpen(false)}
          onDiscard={() => {
            setIsDiscardDialogOpen(false);
            setIsDirty(false);
            navigation.goBack();
          }}
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  previewFrame: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 14,
    backgroundColor: theme.colors.pale,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  previewPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.inkLight,
  },
  previewInfo: {
    gap: 4,
  },
  previewHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  previewSubtitle: {
    fontSize: 14,
    color: theme.colors.ink,
    opacity: 0.8,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.cobalt,
  },
  fieldset: {
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 12,
    backgroundColor: theme.colors.paper,
    padding: 14,
    paddingTop: 18,
    position: 'relative',
  },
  legend: {
    position: 'absolute',
    top: -12,
    left: 12,
    backgroundColor: theme.colors.paper,
    paddingHorizontal: 6,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  formContent: {
    gap: 12,
  },
  fieldGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  optionalText: {
    fontWeight: '400',
    fontSize: 13,
  },
  selectControl: {
    height: 48,
    backgroundColor: theme.colors.pale,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  selectText: {
    fontSize: 15,
    color: theme.colors.ink,
    fontWeight: '500',
  },
  dropdownMenu: {
    marginTop: 4,
    backgroundColor: theme.colors.paper,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rule,
  },
  dropdownItemSelected: {
    backgroundColor: theme.colors.pale,
  },
  dropdownItemText: {
    fontSize: 14,
    color: theme.colors.ink,
  },
  dropdownItemTextSelected: {
    fontWeight: '700',
    color: theme.colors.cobalt,
  },
  textInput: {
    height: 48,
    outlineWidth: 0,
    outlineColor: 'transparent',
    backgroundColor: theme.colors.pale,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    color: theme.colors.ink,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: theme.colors.wash,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.green,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.green,
  },
  actionButton: {
    height: 48,
    borderRadius: 6,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryActionButton: {
    backgroundColor: theme.colors.cobalt,
    borderColor: theme.colors.cobalt,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.paper,
  },
  secondaryActionButton: {
    backgroundColor: theme.colors.paper,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.rule,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.ink,
    opacity: 0.7,
    letterSpacing: 1,
  },
});
