import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';

interface BottomNavProps {
  activeTab: 'schedule' | 'performance';
  onTabChange: (tab: 'schedule' | 'performance') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.nav, { backgroundColor: colors.cardBackground }]}>
        {/* Schedule tab */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onTabChange('schedule')}
          activeOpacity={0.7}
        >
          <View style={[
            styles.iconContainer,
            activeTab === 'schedule' && { backgroundColor: colors.text }
          ]}>
            <View style={[
              styles.calendarIcon,
              { borderColor: activeTab === 'schedule' ? colors.background : colors.text }
            ]}>
              <View style={[
                styles.calendarDot,
                { backgroundColor: activeTab === 'schedule' ? colors.background : colors.text }
              ]} />
              <View style={[
                styles.calendarDot,
                { backgroundColor: activeTab === 'schedule' ? colors.background : colors.text }
              ]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Performance tab */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onTabChange('performance')}
          activeOpacity={0.7}
        >
          <View style={[
            styles.iconContainer,
            activeTab === 'performance' && { backgroundColor: colors.text }
          ]}>
            <View style={styles.chartIcon}>
              <View style={[
                styles.chartBar,
                styles.chartBar1,
                { backgroundColor: activeTab === 'performance' ? colors.background : colors.text }
              ]} />
              <View style={[
                styles.chartBar,
                styles.chartBar2,
                { backgroundColor: activeTab === 'performance' ? colors.background : colors.text }
              ]} />
              <View style={[
                styles.chartBar,
                styles.chartBar3,
                { backgroundColor: activeTab === 'performance' ? colors.background : colors.text }
              ]} />
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
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 50,
    alignSelf: 'center',
  },
  tab: {
    padding: spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    width: 18,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    paddingTop: 2,
  },
  calendarDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  chartIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 16,
  },
  chartBar: {
    width: 4,
    borderRadius: 1,
  },
  chartBar1: {
    height: 8,
  },
  chartBar2: {
    height: 14,
  },
  chartBar3: {
    height: 10,
  },
});
