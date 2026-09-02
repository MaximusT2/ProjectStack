import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ExpenseCategory, ExpenseItem } from '../types';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<ExpenseItem, 'id'>) => void;
}

const CATEGORIES: { key: ExpenseCategory; label: string; icon: string }[] = [
  { key: 'wof_reg', label: 'WOF & Rego', icon: 'file-text' },
  { key: 'parts', label: 'Parts & Hardware', icon: 'cpu' },
  { key: 'labor', label: 'Labor & Tuning', icon: 'tool' },
  { key: 'fluids', label: 'Fluids & Service', icon: 'droplet' },
  { key: 'other', label: 'Other Expenses', icon: 'tag' },
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('wof_reg');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter an expense description.');
      return;
    }

    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid expense cost.');
      return;
    }

    onAdd({
      title: title.trim(),
      amount: numericAmount,
      category,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setCategory('wof_reg');
    setNotes('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Log Build Expense</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Feather name="x" size={24} color={theme.colors.paper} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* Title input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Expense Item / Description *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. WOF Inspection & 12mo Rego"
              placeholderTextColor={theme.colors.inkLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Amount input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Amount ($) *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 185"
              placeholderTextColor={theme.colors.inkLight}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Category Selector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Expense Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                    onPress={() => setCategory(cat.key)}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={cat.icon as any}
                      size={18}
                      color={isSelected ? theme.colors.paper : theme.colors.ink}
                    />
                    <Text style={[styles.categoryCardText, isSelected && styles.categoryCardTextSelected]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Notes input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Notes & Details (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="e.g. Completed at VTNZ with no recheck required."
              placeholderTextColor={theme.colors.inkLight}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>Save Expense</Text>
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
    gap: 16,
    paddingBottom: 40,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  textInput: {
    height: 48,
    backgroundColor: theme.colors.pale,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: theme.colors.ink,
  },
  textArea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.paper,
  },
  categoryCardSelected: {
    backgroundColor: theme.colors.cobalt,
    borderColor: theme.colors.cobalt,
  },
  categoryCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  categoryCardTextSelected: {
    color: theme.colors.paper,
    fontWeight: '700',
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
