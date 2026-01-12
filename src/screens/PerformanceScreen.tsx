import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { PerformanceMetrics } from '../types';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ThemeToggle } from '../components/ThemeToggle';
import { GlowCard } from '../components/GlowCard';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { achievements } from '../data/mockData';

interface PerformanceScreenProps {
  metrics: PerformanceMetrics;
}

export const PerformanceScreen: React.FC<PerformanceScreenProps> = ({ metrics }) => {
  const { colors, mode } = useTheme();
  const [showAchievements, setShowAchievements] = useState(false);

  const revenueAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const badgesAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const breakdownAnim = useRef(new Animated.Value(0)).current;
  const achievementsListAnim = useRef(new Animated.Value(0)).current;

  const dailyGoal = 500;
  const progressPercent = Math.min((metrics.totalRevenue / dailyGoal) * 100, 100);
  const streak = 7;
  const level = Math.floor(metrics.totalRevenue / 200) + 1;
  const xpCurrent = metrics.totalRevenue % 200;
  const xpNeeded = 200;

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(revenueAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(badgesAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(statsAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(breakdownAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 1200,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    if (showAchievements) {
      Animated.spring(achievementsListAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      achievementsListAnim.setValue(0);
    }
  }, [showAchievements]);

  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Performance</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {getCurrentDate()}
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main revenue card with glow */}
        <GlowCard style={styles.revenueWrapper} intensity="medium">
          <View style={styles.revenueContent}>
            <Text style={[styles.revenueLabel, { color: colors.textSecondary }]}>
              REVENU DU JOUR
            </Text>
            <AnimatedNumber 
              value={metrics.totalRevenue} 
              suffix="€"
              style={[styles.revenueValue, { color: colors.text }]}
            />

            {/* Goal progress */}
            <View style={styles.goalSection}>
              <View style={styles.goalRow}>
                <Text style={[styles.goalText, { color: colors.textSecondary }]}>
                  Objectif {dailyGoal}€
                </Text>
                <Text style={[styles.goalPercent, { color: colors.text }]}>
                  {Math.round(progressPercent)}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: progressPercent >= 100 ? colors.success : colors.text,
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              {progressPercent >= 100 && (
                <Text style={[styles.goalReached, { color: colors.success }]}>
                  Objectif atteint
                </Text>
              )}
            </View>
          </View>
        </GlowCard>

        {/* Level & Streak badges */}
        <Animated.View 
          style={[
            styles.badgesSection,
            {
              opacity: badgesAnim,
              transform: [{
                translateY: badgesAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          <View style={[styles.levelBadge, { borderColor: colors.text }]}>
            <AnimatedNumber 
              value={level} 
              duration={800}
              style={[styles.levelNumber, { color: colors.text }]}
            />
            <Text style={[styles.levelLabel, { color: colors.textSecondary }]}>NIVEAU</Text>
            <View style={[styles.xpBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.xpFill,
                  {
                    backgroundColor: colors.text,
                    width: `${(xpCurrent / xpNeeded) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.xpText, { color: colors.textSecondary }]}>
              {xpCurrent}/{xpNeeded} XP
            </Text>
          </View>

          <View style={[styles.streakBadge, { borderColor: colors.border }]}>
            <AnimatedNumber 
              value={streak} 
              duration={1000}
              style={[styles.streakNumber, { color: colors.text }]}
            />
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>JOURS</Text>
            <Text style={[styles.streakSub, { color: colors.textSecondary }]}>consécutifs</Text>
          </View>
        </Animated.View>

        {/* Stats row */}
        <Animated.View 
          style={[
            styles.statsRow,
            {
              opacity: statsAnim,
              transform: [{
                translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <AnimatedNumber 
              value={metrics.completedToday}
              duration={1200}
              style={[styles.statValue, { color: colors.text }]}
            />
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              terminés
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <AnimatedNumber 
              value={metrics.clientsNotified}
              duration={1400}
              style={[styles.statValue, { color: colors.text }]}
            />
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              notifiés
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <AnimatedNumber 
              value={metrics.noShowsToday}
              duration={1600}
              style={[
                styles.statValue,
                { color: metrics.noShowsToday === 0 ? colors.success : colors.danger },
              ]}
            />
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              no-shows
            </Text>
          </View>
        </Animated.View>

        {/* Revenue breakdown */}
        <Animated.View 
          style={[
            styles.breakdownCard, 
            { backgroundColor: colors.cardBackground },
            {
              opacity: breakdownAnim,
              transform: [{
                translateY: breakdownAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
              Via l'app
            </Text>
            <AnimatedNumber 
              value={metrics.appRevenue}
              duration={1800}
              suffix="€"
              style={[styles.breakdownValue, { color: colors.text }]}
            />
          </View>
          <View style={[styles.breakdownBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.breakdownFill,
                {
                  backgroundColor: colors.text,
                  width: `${(metrics.appRevenue / metrics.totalRevenue) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.breakdownPercent, { color: colors.textSecondary }]}>
            {Math.round((metrics.appRevenue / metrics.totalRevenue) * 100)}% de tes revenus générés via l'app
          </Text>
        </Animated.View>

        {/* Achievements */}
        <TouchableOpacity
          style={[styles.achievementsCard, { backgroundColor: colors.cardBackground }]}
          onPress={() => setShowAchievements(!showAchievements)}
          activeOpacity={0.7}
        >
          <View style={styles.achievementsHeader}>
            <View>
              <Text style={[styles.achievementsTitle, { color: colors.text }]}>
                Succès
              </Text>
              <Text style={[styles.achievementsSubtitle, { color: colors.textSecondary }]}>
                {unlockedCount} sur {achievements.length} débloqués
              </Text>
            </View>
            <View style={[styles.achievementsBadge, { borderColor: colors.border }]}>
              <Text style={[styles.achievementsBadgeText, { color: colors.text }]}>
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </Text>
            </View>
          </View>

          <View style={[styles.achievementsBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.achievementsFill,
                {
                  backgroundColor: colors.text,
                  width: `${(unlockedCount / achievements.length) * 100}%`,
                },
              ]}
            />
          </View>
        </TouchableOpacity>

        {showAchievements && (
          <Animated.View 
            style={[
              styles.achievementsList,
              {
                opacity: achievementsListAnim,
                transform: [{
                  translateY: achievementsListAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                }],
              },
            ]}
          >
            {achievements.map((achievement, index) => (
              <Animated.View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  {
                    backgroundColor: colors.cardBackground,
                    opacity: achievement.unlocked ? 1 : 0.5,
                    transform: [{
                      translateX: achievementsListAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [index % 2 === 0 ? -20 : 20, 0],
                      }),
                    }],
                  },
                ]}
              >
                <View style={[styles.achievementIcon, { borderColor: colors.border }]}>
                  <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementName, { color: colors.text }]}>
                    {achievement.name}
                  </Text>
                  <Text style={[styles.achievementDesc, { color: colors.textSecondary }]}>
                    {achievement.description}
                  </Text>
                  {!achievement.unlocked && achievement.target && (
                    <View style={styles.achievementProgress}>
                      <View style={[styles.achievementBar, { backgroundColor: colors.border }]}>
                        <View
                          style={[
                            styles.achievementBarFill,
                            {
                              backgroundColor: colors.text,
                              width: `${((achievement.progress || 0) / achievement.target) * 100}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.achievementProgressText, { color: colors.textSecondary }]}>
                        {achievement.progress}/{achievement.target}
                      </Text>
                    </View>
                  )}
                </View>
                {achievement.unlocked && (
                  <View style={[styles.unlockedCheck, { backgroundColor: colors.success }]}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </Animated.View>
        )}

        <View style={styles.scrollPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
  },
  date: {
    ...typography.caption,
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.sm,
  },
  revenueWrapper: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  revenueContent: {
    padding: spacing.xl,
  },
  revenueLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  revenueValue: {
    ...typography.largeNumber,
    marginBottom: spacing.lg,
  },
  goalSection: {},
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  goalText: {
    ...typography.caption,
  },
  goalPercent: {
    ...typography.caption,
    fontWeight: '600',
  },
  progressBar: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  goalReached: {
    ...typography.caption,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  badgesSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  levelBadge: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 36,
    fontWeight: '200',
    lineHeight: 42,
  },
  levelLabel: {
    ...typography.label,
    marginTop: spacing.xs,
  },
  xpBar: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
  },
  xpText: {
    fontSize: 10,
    marginTop: spacing.xs,
  },
  streakBadge: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: '200',
    lineHeight: 42,
  },
  streakLabel: {
    ...typography.label,
    marginTop: spacing.xs,
  },
  streakSub: {
    fontSize: 10,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.label,
  },
  breakdownCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  breakdownLabel: {
    ...typography.body,
  },
  breakdownValue: {
    ...typography.h3,
  },
  breakdownBar: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  breakdownFill: {
    height: '100%',
  },
  breakdownPercent: {
    ...typography.caption,
  },
  achievementsCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  achievementsTitle: {
    ...typography.bodyBold,
  },
  achievementsSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  achievementsBadge: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  achievementsBadgeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  achievementsBar: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  achievementsFill: {
    height: '100%',
  },
  achievementsList: {
    paddingHorizontal: spacing.lg,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    ...typography.bodyBold,
  },
  achievementDesc: {
    ...typography.caption,
    marginTop: 2,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  achievementBar: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  achievementBarFill: {
    height: '100%',
  },
  achievementProgressText: {
    fontSize: 10,
  },
  unlockedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollPadding: {
    height: spacing.xxl,
  },
});
