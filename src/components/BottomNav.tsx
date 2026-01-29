import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';

interface BottomNavProps {
  activeTab: 'schedule' | 'performance';
  onTabChange: (tab: 'schedule' | 'performance') => void;
  scrollX?: Animated.Value;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, scrollX }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.nav, { backgroundColor: colors.cardBackground }]}>
        {/* Indicator */}
        <Animated.View 
          style={[
            styles.indicator,
            { 
              backgroundColor: colors.text,
              ...(scrollX
                ? {
                    transform: [
                      {
                        translateX: scrollX.interpolate({
                          inputRange: [0, SCREEN_WIDTH],
                          outputRange: [0, 48],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  }
                : { left: activeTab === 'schedule' ? 8 : 56 }),
            }
          ]} 
        />

        {/* Schedule */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onTabChange('schedule')}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrap}>
            <View style={[styles.calendar, { borderColor: activeTab === 'schedule' ? colors.background : colors.text }]}>
              <View style={[styles.dot, { backgroundColor: activeTab === 'schedule' ? colors.background : colors.text }]} />
              <View style={[styles.dot, { backgroundColor: activeTab === 'schedule' ? colors.background : colors.text }]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Performance */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onTabChange('performance')}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrap}>
            <View style={styles.bars}>
              <View style={[styles.bar1, { backgroundColor: activeTab === 'performance' ? colors.background : colors.text }]} />
              <View style={[styles.bar2, { backgroundColor: activeTab === 'performance' ? colors.background : colors.text }]} />
              <View style={[styles.bar3, { backgroundColor: activeTab === 'performance' ? colors.background : colors.text }]} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  nav: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 30,
    padding: 4,
  },
  indicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tab: {
    width: 48,
    height: 48,
  },
  iconWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Calendar: 14x12 box with 2 dots
  calendar: {
    width: 14,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  // Bars: 3 vertical bars
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 12,
    gap: 2,
  },
  bar1: {
    width: 3,
    height: 5,
    borderRadius: 1,
  },
  bar2: {
    width: 3,
    height: 11,
    borderRadius: 1,
  },
  bar3: {
    width: 3,
    height: 7,
    borderRadius: 1,
  },
});


