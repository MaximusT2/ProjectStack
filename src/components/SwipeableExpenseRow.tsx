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
import { ExpenseItem, ExpenseCategory } from '../types';

interface SwipeableExpenseRowProps {
  item: ExpenseItem;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = 75;

export const SwipeableExpenseRow: React.FC<SwipeableExpenseRowProps> = ({ item, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const isSwiping = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
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
          Animated.timing(translateX, {
            toValue: -Dimensions.get('window').width,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
          });
        } else {
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

  const renderCategoryBadge = (category: ExpenseCategory) => {
    switch (category) {
      case 'wof_reg':
        return (
          <View style={[styles.catBadge, styles.catBadgeWof]}>
            <Feather name="file-text" size={10} color={theme.colors.cobalt} />
            <Text style={[styles.catBadgeText, styles.catTextWof]}>WOF / Reg</Text>
          </View>
        );
      case 'parts':
        return (
          <View style={[styles.catBadge, styles.catBadgeParts]}>
            <Feather name="cpu" size={10} color={theme.colors.orange} />
            <Text style={[styles.catBadgeText, styles.catTextParts]}>Parts</Text>
          </View>
        );
      case 'labor':
        return (
          <View style={[styles.catBadge, styles.catBadgeLabor]}>
            <Feather name="tool" size={10} color={theme.colors.green} />
            <Text style={[styles.catBadgeText, styles.catTextLabor]}>Labor</Text>
          </View>
        );
      case 'fluids':
        return (
          <View style={[styles.catBadge, styles.catBadgeFluids]}>
            <Feather name="droplet" size={10} color={theme.colors.cobaltDeep} />
            <Text style={[styles.catBadgeText, styles.catTextFluids]}>Fluids</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.catBadge, styles.catBadgeOther]}>
            <Feather name="tag" size={10} color={theme.colors.ink} />
            <Text style={[styles.catBadgeText, styles.catTextOther]}>Other</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Red Trash Bin Background */}
      <TouchableOpacity style={styles.deleteBackground} activeOpacity={0.8} onPress={onDelete}>
        <View style={styles.deleteAction}>
          <Feather name="trash-2" size={18} color={theme.colors.paper} />
          <Text style={styles.deleteText}>Delete</Text>
        </View>
      </TouchableOpacity>

      {/* Foreground Item */}
      <Animated.View style={[styles.rowForeground, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
        <View style={styles.content}>
          <View style={styles.leftCol}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.subRow}>
              {renderCategoryBadge(item.category)}
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
          </View>
          <Text style={styles.itemAmount}>${item.amount.toLocaleString()}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
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
    gap: 4,
  },
  deleteText: {
    color: theme.colors.paper,
    fontWeight: '700',
    fontSize: 13,
  },
  rowForeground: {
    backgroundColor: theme.colors.paper,
    width: '100%',
    minHeight: 52,
    justifyContent: 'center',
    zIndex: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 8,
  },
  leftCol: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemDate: {
    fontSize: 12,
    color: theme.colors.ink,
    opacity: 0.7,
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  catBadgeWof: {
    backgroundColor: theme.colors.blueWash,
    borderWidth: 1,
    borderColor: theme.colors.cobalt,
  },
  catTextWof: {
    color: theme.colors.cobaltDeep,
  },
  catBadgeParts: {
    backgroundColor: theme.colors.orangeWash,
    borderWidth: 1,
    borderColor: theme.colors.orange,
  },
  catTextParts: {
    color: theme.colors.orange,
  },
  catBadgeLabor: {
    backgroundColor: theme.colors.greenWash,
    borderWidth: 1,
    borderColor: theme.colors.green,
  },
  catTextLabor: {
    color: theme.colors.green,
  },
  catBadgeFluids: {
    backgroundColor: theme.colors.pale,
  },
  catTextFluids: {
    color: theme.colors.ink,
  },
  catBadgeOther: {
    backgroundColor: theme.colors.wash,
  },
  catTextOther: {
    color: theme.colors.ink,
  },
});
