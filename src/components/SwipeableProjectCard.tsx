import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ProjectCar } from '../types';

interface SwipeableProjectCardProps {
  item: ProjectCar;
  onPress: () => void;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = 75;

export const SwipeableProjectCard: React.FC<SwipeableProjectCardProps> = ({
  item,
  onPress,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const isSwiping = useRef(false);

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start(() => {
      setTimeout(() => {
        isSwiping.current = false;
      }, 50);
    });
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: resetPosition,
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Animated.timing(translateX, {
              toValue: -Dimensions.get('window').width,
              duration: 180,
              useNativeDriver: true,
            }).start(() => {
              onDelete();
            });
          },
        },
      ]
    );
  };

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
          confirmDelete();
        } else {
          resetPosition();
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        resetPosition();
      },
    })
  ).current;

  const renderStatusBadge = (status: 'Planning' | 'In Progress' | 'Completed') => {
    if (status === 'Completed') {
      return (
        <View style={[styles.statusBadge, styles.statusBadgeCompleted]}>
          <View style={styles.completedIconRing}>
            <Feather name="check" size={11} color={theme.colors.green} />
          </View>
          <Text style={styles.statusTextCompleted}>Completed</Text>
        </View>
      );
    }

    if (status === 'In Progress') {
      return (
        <View style={[styles.statusBadge, styles.statusBadgeInProgress]}>
          <Feather name="clock" size={12} color={theme.colors.orange} />
          <Text style={styles.statusTextInProgress}>In Progress</Text>
        </View>
      );
    }

    // Planning (Blue with Map Icon)
    return (
      <View style={[styles.statusBadge, styles.statusBadgePlanning]}>
        <Feather name="map" size={12} color={theme.colors.cobalt} />
        <Text style={styles.statusTextPlanning}>Planning</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Red Trash Bin Background on the Right */}
      <TouchableOpacity
        style={styles.deleteBackground}
        activeOpacity={0.8}
        onPress={confirmDelete}
      >
        <View style={styles.deleteAction}>
          <Feather name="trash-2" size={22} color={theme.colors.paper} />
          <Text style={styles.deleteText}>Delete</Text>
        </View>
      </TouchableOpacity>

      {/* Foreground Swipeable Card */}
      <Animated.View
        style={[
          styles.rowForeground,
          item.status === 'Completed' && styles.cardCompleted,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.cardContent}
          activeOpacity={0.7}
          onPress={() => {
            if (!isSwiping.current) {
              onPress();
            }
          }}
        >
          {/* Car Thumbnail */}
          <View
            style={[
              styles.thumbnailContainer,
              item.status === 'Completed' && styles.thumbnailContainerCompleted,
            ]}
          >
            {item.image ? (
              <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Feather name="image" size={24} color={theme.colors.cobalt} />
              </View>
            )}
          </View>

          {/* Project Info */}
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>

            <View style={styles.statusRow}>
              {renderStatusBadge(item.status)}
              <Text style={styles.updatedText} numberOfLines={1}>
                {item.nextAction || item.lastUpdated}
              </Text>
            </View>

            {/* Total Spent Label & Amount Next to Each Other */}
            <View style={styles.spentRow}>
              <Text style={styles.spentLabel}>Total spent:</Text>
              <Text style={styles.spentValue}>${item.totalSpent.toLocaleString()}</Text>
            </View>
          </View>

          {/* Chevron */}
          <View style={styles.chevronContainer}>
            <Feather name="chevron-right" size={24} color={theme.colors.ink} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 92,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: theme.colors.warning,
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
    zIndex: 1,
  },
  deleteAction: {
    alignItems: 'center',
    gap: 4,
  },
  deleteText: {
    color: theme.colors.paper,
    fontWeight: '700',
    fontSize: 12,
  },
  rowForeground: {
    backgroundColor: theme.colors.paper,
    width: '100%',
    height: '100%',
    borderWidth: 1.75,
    borderColor: theme.colors.ink,
    borderRadius: 10,
    zIndex: 2,
  },
  cardCompleted: {
    borderColor: theme.colors.green,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 10,
  },
  thumbnailContainer: {
    width: 56,
    height: 56,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    overflow: 'hidden',
    backgroundColor: theme.colors.wash,
  },
  thumbnailContainerCompleted: {
    borderColor: theme.colors.green,
    borderWidth: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusBadgePlanning: {
    backgroundColor: theme.colors.blueWash,
    borderWidth: 1,
    borderColor: theme.colors.cobalt,
  },
  statusTextPlanning: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.cobaltDeep,
  },
  statusBadgeInProgress: {
    backgroundColor: theme.colors.orangeWash,
    borderWidth: 1,
    borderColor: theme.colors.orange,
  },
  statusTextInProgress: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.orange,
  },
  statusBadgeCompleted: {
    backgroundColor: theme.colors.greenWash,
    borderWidth: 1,
    borderColor: theme.colors.green,
  },
  statusTextCompleted: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.green,
  },
  completedIconRing: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: theme.colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.paper,
  },
  updatedText: {
    fontSize: 12,
    color: theme.colors.ink,
    opacity: 0.75,
    flex: 1,
  },
  spentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  spentLabel: {
    fontSize: 13,
    color: theme.colors.ink,
    opacity: 0.8,
  },
  spentValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  chevronContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
