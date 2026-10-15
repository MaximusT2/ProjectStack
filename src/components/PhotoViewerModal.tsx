import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { PhotoItem } from '../types';

interface PhotoViewerModalProps {
  visible: boolean;
  photo: PhotoItem | null;
  onClose: () => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({ visible, photo, onClose }) => {
  if (!photo) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Project photo</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityLabel="Close photo viewer"
          >
            <Feather name="x" size={24} color={theme.colors.paper} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.imageFrame}>
            {photo.localAsset ? (
              <Image source={photo.localAsset} style={styles.image} resizeMode="cover" />
            ) : photo.uri ? (
              <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.placeholder}>
                <Feather name="image" size={48} color={theme.colors.cobalt} />
              </View>
            )}
          </View>

          <Text style={styles.photoTitle}>{photo.title}</Text>
          {photo.caption && <Text style={styles.photoCaption}>{photo.caption}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  topBar: {
    height: 56,
    backgroundColor: theme.colors.cobalt,
    borderBottomWidth: theme.borders.ink.borderWidth,
    borderBottomColor: theme.borders.ink.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.paper,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderWidth: theme.borders.ink.borderWidth,
    borderColor: theme.borders.ink.borderColor,
    borderRadius: 12,
    backgroundColor: theme.colors.wash,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTitle: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.ink,
    letterSpacing: -0.3,
  },
  photoCaption: {
    marginTop: 6,
    fontSize: 15,
    color: theme.colors.ink,
    opacity: 0.85,
  },
});
