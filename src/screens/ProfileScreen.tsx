import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
  const [userName, setUserName] = useState('Workshop Builder');
  const [nameDraft, setNameDraft] = useState('Workshop Builder');
  const [isEditingName, setIsEditingName] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

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

  const saveName = () => {
    const trimmedName = nameDraft.trim();
    if (trimmedName) setUserName(trimmedName);
    setIsEditingName(false);
  };

  const handleAvatarAction = async (source: 'library' | 'camera') => {
    setAvatarError(null);
    setIsAvatarPickerOpen(false);

    try {
      if (source === 'camera' && Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setAvatarError('Camera access is required to take a photo.');
          setIsAvatarPickerOpen(true);
          return;
        }
      }

      const result =
        source === 'library'
          ? await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })
          : await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

      if (!result.canceled && result.assets[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch {
      setAvatarError('Unable to open the image picker. Please try again.');
      setIsAvatarPickerOpen(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Workshop Profile" leftType="none" />

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <TouchableOpacity
                style={styles.avatar}
                onPress={() => {
                  setAvatarError(null);
                  setIsAvatarPickerOpen(true);
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Change profile picture"
              >
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} resizeMode="cover" />
                ) : (
                  <Ionicons name="person" size={36} color={theme.colors.paper} />
                )}
              </TouchableOpacity>
              <View pointerEvents="none" style={styles.avatarCameraBadge}>
                <Feather name="camera" size={12} color={theme.colors.ink} />
              </View>
            </View>
            {isEditingName ? (
              <View style={styles.nameEditRow}>
                <TextInput
                  style={[styles.userName, styles.nameInput]}
                  underlineColorAndroid="transparent"
                  value={nameDraft}
                  onChangeText={setNameDraft}
                  placeholder="Your name"
                  placeholderTextColor={theme.colors.inkLight}
                  autoFocus
                  selectTextOnFocus
                  returnKeyType="done"
                  onSubmitEditing={saveName}
                  accessibilityLabel="Your name"
                />
                <TouchableOpacity
                  style={styles.saveNameButton}
                  onPress={saveName}
                  accessibilityLabel="Save name"
                >
                  <Feather name="check" size={18} color={theme.colors.cobalt} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.userNameButton}
                onPress={() => {
                  setNameDraft(userName);
                  setIsEditingName(true);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Edit profile name, ${userName}`}
              >
                <Text style={styles.userName} numberOfLines={1}>
                  {userName}
                </Text>
                <Feather style={styles.nameEditIcon} name="edit-2" size={14} color={theme.colors.cobalt} />
              </TouchableOpacity>
            )}
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

      <Modal
        visible={isAvatarPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAvatarPickerOpen(false)}
      >
        <View style={styles.avatarModalOverlay}>
          <View style={styles.avatarModal}>
            <Text style={styles.avatarModalTitle}>Profile picture</Text>
            {avatarError ? <Text style={styles.avatarError}>{avatarError}</Text> : null}
            <TouchableOpacity
              style={styles.avatarAction}
              onPress={() => handleAvatarAction('library')}
              activeOpacity={0.7}
            >
              <Feather name="image" size={18} color={theme.colors.ink} />
              <Text style={styles.avatarActionText}>Choose from photos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarAction}
              onPress={() => handleAvatarAction('camera')}
              activeOpacity={0.7}
            >
              <Feather name="camera" size={18} color={theme.colors.ink} />
              <Text style={styles.avatarActionText}>Take a photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarCancel}
              onPress={() => setIsAvatarPickerOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.avatarCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  avatarWrap: {
    width: 68,
    height: 68,
    marginBottom: 4,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: theme.colors.cobalt,
    borderWidth: 2,
    borderColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarCameraBadge: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.paper,
    borderWidth: 1,
    borderColor: theme.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.ink,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  userNameButton: {
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameEditRow: {
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    width: '100%',
    maxWidth: 280,
    outlineWidth: 0,
    outlineColor: 'transparent',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rule,
    paddingHorizontal: 28,
  },
  nameEditIcon: {
    position: 'absolute',
    right: 6,
  },
  saveNameButton: {
    position: 'absolute',
    right: 6,
    padding: 4,
  },
  avatarModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.inkOverlay,
    padding: 16,
  },
  avatarModal: {
    backgroundColor: theme.colors.paper,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.colors.ink,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  avatarModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.ink,
    marginBottom: 4,
  },
  avatarError: {
    color: theme.colors.warning,
    fontSize: 13,
  },
  avatarAction: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  avatarActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  avatarCancel: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.rule,
    marginTop: 4,
  },
  avatarCancelText: {
    color: theme.colors.cobalt,
    fontSize: 14,
    fontWeight: '700',
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
