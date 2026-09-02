import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface DiscardDialogProps {
  visible: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

export const DiscardDialog: React.FC<DiscardDialogProps> = ({ visible, onKeepEditing, onDiscard }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          <Text style={styles.title}>Discard photo details?</Text>
          <Text style={styles.message}>Your project and log selections have changed.</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.keepButton]} onPress={onKeepEditing} activeOpacity={0.7}>
              <Text style={styles.keepButtonText}>Keep editing</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.discardButton]} onPress={onDiscard} activeOpacity={0.7}>
              <Text style={styles.discardButtonText}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.inkOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: theme.colors.paper,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 14,
    padding: 20,
    shadowColor: theme.colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: theme.colors.ink,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: theme.colors.ink,
    opacity: 0.85,
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepButton: {
    backgroundColor: theme.colors.paper,
  },
  keepButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  discardButton: {
    backgroundColor: theme.colors.warning,
    borderColor: theme.colors.warning,
  },
  discardButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.paper,
  },
});
