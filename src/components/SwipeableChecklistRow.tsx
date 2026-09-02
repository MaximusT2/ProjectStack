import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ChecklistItem } from '../types';

interface SwipeableChecklistRowProps {
  item: ChecklistItem;
  onToggle: () => void;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = 75;

export const SwipeableChecklistRow: React.FC<SwipeableChecklistRowProps> = ({
  item,
  onToggle,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const isSwiping = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        // Capture swipe left gestures (dx < -6) firmly over vertical scrolling
        return gestureState.dx < -6 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx < -6 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderGrant: () => {
        isSwiping.current = true;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          // Dragging left (negative values)
          const drag = Math.abs(gestureState.dx) > SWIPE_THRESHOLD
            ? -SWIPE_THRESHOLD - (Math.abs(gestureState.dx) - SWIPE_THRESHOLD) * 0.35
            : gestureState.dx;
          translateX.setValue(drag);
        } else {
          translateX.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Slide completely off to the left and trigger delete
          Animated.timing(translateX, {
            toValue: -Dimensions.get('window').width,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
          });
        } else {
          // Reset position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start(() => {
            setTimeout(() => {
              isSwiping.current = false;
            }, 50);
          });
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => {
          isSwiping.current = false;
        });
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Red Trash Bin Background (Revealed on the Right Side when Swiping Left) */}
      <TouchableOpacity
        style={styles.deleteBackground}
        activeOpacity={0.8}
        onPress={onDelete}
      >
        <View style={styles.deleteAction}>
          <Feather name="trash-2" size={20} color={theme.colors.paper} />
          <Text style={styles.deleteText}>Delete</Text>
        </View>
      </TouchableOpacity>

      {/* Foreground Swipeable Content */}
      <Animated.View
        style={[
          styles.rowForeground,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.touchableArea}
          activeOpacity={0.7}
          onPress={() => {
            if (!isSwiping.current) {
              onToggle();
            }
          }}
        >
          <View style={[styles.checkBox, item.completed && styles.checkBoxCompleted]}>
            {item.completed && <Feather name="check" size={16} color={theme.colors.paper} />}
          </View>
          <Text style={[styles.checkLabel, item.completed && styles.checkLabelCompleted]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: theme.colors.rule,
    overflow: 'hidden',
    backgroundColor: theme.colors.warning,
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
    zIndex: 1,
  },
  deleteAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deleteText: {
    color: theme.colors.paper,
    fontWeight: '700',
    fontSize: 14,
  },
  rowForeground: {
    backgroundColor: theme.colors.paper,
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    zIndex: 2,
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.paper,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderWidth: 1.75,
    borderColor: theme.colors.ink,
    borderRadius: 4,
    backgroundColor: theme.colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxCompleted: {
    backgroundColor: theme.colors.green,
    borderColor: theme.colors.green,
  },
  checkLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.ink,
  },
  checkLabelCompleted: {
    fontWeight: '700',
  },
});
