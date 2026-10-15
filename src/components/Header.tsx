import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface HeaderProps {
  title: string;
  leftType?: 'menu' | 'back' | 'none';
  onLeftPress?: () => void;
  rightType?: 'add' | 'close' | 'none';
  onRightPress?: () => void;
  rightAccessory?: React.ReactNode;
  isAddActive?: boolean;
  showBottomBorder?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftType = 'menu',
  onLeftPress,
  rightType = 'none',
  onRightPress,
  rightAccessory,
  isAddActive = false,
  showBottomBorder = true,
}) => {
  return (
    <View style={[styles.container, !showBottomBorder && styles.noBottomBorder]}>
      <View style={styles.content}>
        {leftType === 'menu' && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionButton}
            onPress={onLeftPress}
            accessibilityLabel="Open menu"
          >
            <Feather name="menu" size={23} color={theme.colors.paper} />
          </TouchableOpacity>
        )}

        {leftType === 'back' && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionButton}
            onPress={onLeftPress}
            accessibilityLabel="Go back"
          >
            <Feather name="arrow-left" size={23} color={theme.colors.paper} />
          </TouchableOpacity>
        )}

        {leftType === 'none' && <View style={styles.actionButtonEmpty} />}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightActions}>
          {rightAccessory}

          {rightType === 'add' && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.actionButton, isAddActive && styles.actionButtonRotated]}
              onPress={onRightPress}
              accessibilityLabel="Add project"
            >
              <Feather name="plus" size={24} color={theme.colors.paper} />
            </TouchableOpacity>
          )}

          {rightType === 'close' && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionButton}
              onPress={onRightPress}
              accessibilityLabel="Close"
            >
              <Feather name="x" size={23} color={theme.colors.paper} />
            </TouchableOpacity>
          )}

          {rightType === 'none' && !rightAccessory && <View style={styles.actionButtonEmpty} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 20,
    backgroundColor: theme.colors.cobalt,
    borderBottomWidth: theme.borders.ink.borderWidth,
    borderBottomColor: theme.borders.ink.borderColor,
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  actionButtonEmpty: {
    width: 44,
    height: 44,
  },
  actionButtonRotated: {
    transform: [{ rotate: '45deg' }],
  },
  title: {
    flex: 1,
    fontSize: 21,
    fontWeight: '700',
    color: theme.colors.paper,
    marginHorizontal: 8,
    letterSpacing: -0.3,
  },
});
