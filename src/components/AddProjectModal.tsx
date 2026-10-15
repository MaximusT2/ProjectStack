import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ProjectCar } from '../types';

interface AddProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (project: Omit<ProjectCar, 'id'>) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'Planning' | 'In Progress' | 'Completed'>('Planning');
  const [nextAction, setNextAction] = useState('');
  const [spent, setSpent] = useState('');
  const [engine, setEngine] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a project title.');
      return;
    }

    const numericSpent = parseFloat(spent.replace(/[^0-9.]/g, '')) || 0;

    const newProject: Omit<ProjectCar, 'id'> = {
      title: title.trim(),
      status,
      lastUpdated: 'Updated just now',
      nextAction: nextAction.trim() ? `Next: ${nextAction.trim()}` : undefined,
      totalSpent: numericSpent,
      image: imageUri ? { uri: imageUri } : require('../../assets/cars/bmw-e30.jpeg'),
      checklist: [
        { id: `c-${Date.now()}-1`, text: 'Initial vehicle inspection', completed: true },
        { id: `c-${Date.now()}-2`, text: 'Order baseline parts', completed: false },
        { id: `c-${Date.now()}-3`, text: 'Safety gear & setup', completed: false },
      ],
      specs: [
        { id: `s-${Date.now()}-1`, label: 'Engine', value: engine.trim() || 'Factory Spec' },
        { id: `s-${Date.now()}-2`, label: 'Oil', value: '5W-40 Synthetic' },
        { id: `s-${Date.now()}-3`, label: 'Coolant', value: '50/50 Mix' },
        { id: `s-${Date.now()}-4`, label: 'Tires', value: 'Performance Street' },
      ],
      photos: [],
      expenses: [],
    };

    onAdd(newProject);
    setTitle('');
    setNextAction('');
    setSpent('');
    setEngine('');
    setImageUri(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add New Project</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Feather name="x" size={24} color={theme.colors.paper} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* Photo Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage} activeOpacity={0.8}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Feather name="camera" size={32} color={theme.colors.cobalt} />
                <Text style={styles.imagePlaceholderText}>Choose project cover photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Form fields */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Project Car Title *</Text>
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="e.g. Nissan Silvia S15 Spec-R"
              placeholderTextColor={theme.colors.inkLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Build Status</Text>
            <View style={styles.statusRow}>
              {(['Planning', 'In Progress', 'Completed'] as const).map((s) => {
                const isSelected = status === s;
                let activeStyle = styles.statusOptionPlanning;
                let activeTextStyle = styles.statusTextPlanning;

                if (isSelected) {
                  if (s === 'In Progress') {
                    activeStyle = styles.statusOptionInProgress;
                    activeTextStyle = styles.statusTextInProgress;
                  } else if (s === 'Completed') {
                    activeStyle = styles.statusOptionCompleted;
                    activeTextStyle = styles.statusTextCompleted;
                  }
                }

                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusOption, isSelected && activeStyle]}
                    onPress={() => setStatus(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.statusOptionText, isSelected && activeTextStyle]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Next Immediate Action</Text>
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="e.g. Turbo manifold fitment"
              placeholderTextColor={theme.colors.inkLight}
              value={nextAction}
              onChangeText={setNextAction}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Engine / Drivetrain</Text>
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="e.g. SR20DET 6-Speed Manual"
              placeholderTextColor={theme.colors.inkLight}
              value={engine}
              onChangeText={setEngine}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Current Total Spent ($)</Text>
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="e.g. 4500"
              placeholderTextColor={theme.colors.inkLight}
              keyboardType="numeric"
              value={spent}
              onChangeText={setSpent}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleCreate} activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>Create Project</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  header: {
    height: 56,
    backgroundColor: theme.colors.cobalt,
    borderBottomWidth: theme.borders.ink.borderWidth,
    borderBottomColor: theme.borders.ink.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.paper,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: theme.colors.wash,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    outlineWidth: 0,
    outlineColor: 'transparent',
    backgroundColor: theme.colors.pale,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: theme.colors.ink,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    height: 40,
    backgroundColor: theme.colors.paper,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusOptionPlanning: {
    backgroundColor: theme.colors.cobalt,
    borderColor: theme.colors.cobalt,
  },
  statusTextPlanning: {
    color: theme.colors.paper,
    fontWeight: '700',
  },
  statusOptionInProgress: {
    backgroundColor: theme.colors.orange,
    borderColor: theme.colors.orange,
  },
  statusTextInProgress: {
    color: theme.colors.paper,
    fontWeight: '700',
  },
  statusOptionCompleted: {
    backgroundColor: theme.colors.green,
    borderColor: theme.colors.green,
  },
  statusTextCompleted: {
    color: theme.colors.paper,
    fontWeight: '700',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  submitButton: {
    marginTop: 10,
    height: 52,
    backgroundColor: theme.colors.cobalt,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.paper,
  },
});
