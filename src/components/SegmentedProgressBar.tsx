import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface SegmentedProgressBarProps {
  total: number;
  completed: number;
}

export const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({ total, completed }) => {
  const cellCount = Math.max(total, 1);
  const cells = Array.from({ length: cellCount });

  return (
    <View style={styles.container}>
      {cells.map((_, index) => {
        const isFilled = index < completed;
        return (
          <View
            key={index}
            style={[
              styles.cell,
              isFilled ? styles.filledCell : styles.emptyCell,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 10,
    width: '100%',
  },
  cell: {
    flex: 1,
    height: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    borderRadius: 2,
  },
  filledCell: {
    backgroundColor: theme.colors.cobalt,
  },
  emptyCell: {
    backgroundColor: theme.colors.paper,
  },
});
