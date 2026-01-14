import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, ScrollView } from 'react-native';
import { PerformanceMetrics } from '../types';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ThemeToggle } from '../components/ThemeToggle';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface PerformanceScreenProps {
  metrics: PerformanceMetrics;
}

export const PerformanceScreen: React.FC<PerformanceScreenProps> = ({ metrics }) => {
  const { colors } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim3 = useRef(new Animated.Value(0)).current;

  const dailyGoal = 500;
  const progressPercent = Math.min((metrics.totalRevenue / dailyGoal) * 100, 100);
  const avgTicket = metrics.completedToday > 0 
    ? Math.round(metrics.totalRevenue / metrics.completedToday) 
    : 0;
  const conversionRate = metrics.completedToday > 0 
    ? Math.round((metrics.completedToday / (metrics.completedToday + metrics.noShowsToday)) * 100)
    : 0;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(fadeAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 8 }),
      Animated.spring(slideAnim1, { toValue: 1, useNativeDriver: true, tension: 50, friction: 8 }),
      Animated.spring(slideAnim2, { toValue: 1, useNativeDriver: true, tension: 50, friction: 8 }),
      Animated.spring(slideAnim3, { toValue: 1, useNativeDriver: true, tension: 50, friction: 8 }),
    ]).start();
  }, []);

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
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {getCurrentDate()}
          </Text>
        </View>
        <ThemeToggle />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main KPI - Revenue */}
        <Animated.View 
          style={[
            styles.mainCard,
            { backgroundColor: colors.cardBackground },
            {
              opacity: slideAnim1,
              transform: [{ translateY: slideAnim1.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          <View style={styles.mainCardHeader}>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
              CHIFFRE D'AFFAIRES
            </Text>
            <View style={[
              styles.trendBadge, 
              { backgroundColor: colors.success + '20' }
            ]}>
              <Text style={[styles.trendText, { color: colors.success }]}>+12%</Text>
            </View>
          </View>
          
          <AnimatedNumber
            value={metrics.totalRevenue}
            suffix="€"
            style={[styles.mainValue, { color: colors.text }]}
          />

          <View style={styles.goalContainer}>
            <View style={styles.goalHeader}>
              <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>
                Objectif journalier
              </Text>
              <Text style={[styles.goalValue, { color: colors.text }]}>
                {dailyGoal}€
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: progressPercent >= 100 ? colors.success : colors.text,
                    width: `${progressPercent}%`,
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {Math.round(progressPercent)}% atteint
            </Text>
          </View>
        </Animated.View>

        {/* KPI Grid */}
        <Animated.View 
          style={[
            styles.kpiGrid,
            {
              opacity: slideAnim2,
              transform: [{ translateY: slideAnim2.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          <View style={[styles.kpiCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>
              CLIENTS
            </Text>
            <AnimatedNumber
              value={metrics.completedToday}
              duration={1000}
              style={[styles.kpiCardValue, { color: colors.text }]}
            />
            <Text style={[styles.kpiCardSub, { color: colors.textSecondary }]}>
              aujourd'hui
            </Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>
              PANIER MOYEN
            </Text>
            <AnimatedNumber
              value={avgTicket}
              suffix="€"
              duration={1200}
              style={[styles.kpiCardValue, { color: colors.text }]}
            />
            <Text style={[styles.kpiCardSub, { color: colors.textSecondary }]}>
              par client
            </Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>
              TAUX PRÉSENCE
            </Text>
            <AnimatedNumber
              value={conversionRate}
              suffix="%"
              duration={1400}
              style={[styles.kpiCardValue, { color: conversionRate >= 90 ? colors.success : colors.text }]}
            />
            <Text style={[styles.kpiCardSub, { color: colors.textSecondary }]}>
              {metrics.noShowsToday} no-show{metrics.noShowsToday > 1 ? 's' : ''}
            </Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.kpiCardLabel, { color: colors.textSecondary }]}>
              NOTIFIÉS
            </Text>
            <AnimatedNumber
              value={metrics.clientsNotified}
              duration={1600}
              style={[styles.kpiCardValue, { color: colors.text }]}
            />
            <Text style={[styles.kpiCardSub, { color: colors.textSecondary }]}>
              via WhatsApp
            </Text>
          </View>
        </Animated.View>

        {/* Revenue breakdown */}
        <Animated.View 
          style={[
            styles.breakdownCard,
            { backgroundColor: colors.cardBackground },
            {
              opacity: slideAnim3,
              transform: [{ translateY: slideAnim3.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Répartition
          </Text>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.text }]} />
              <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                Réservations app
              </Text>
            </View>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>
              {metrics.appRevenue}€
            </Text>
          </View>

          <View style={[styles.breakdownBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.breakdownFill, 
                { 
                  backgroundColor: colors.text,
                  width: `${(metrics.appRevenue / metrics.totalRevenue) * 100}%`,
                }
              ]} 
            />
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.border }]} />
              <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                Walk-ins
              </Text>
            </View>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>
              {metrics.totalRevenue - metrics.appRevenue}€
            </Text>
          </View>

          <View style={styles.statsFooter}>
            <Text style={[styles.statsFooterText, { color: colors.textSecondary }]}>
              {Math.round((metrics.appRevenue / metrics.totalRevenue) * 100)}% des revenus via l'application
            </Text>
          </View>
        </Animated.View>

        {/* Weekly trend placeholder */}
        <Animated.View 
          style={[
            styles.trendCard,
            { backgroundColor: colors.cardBackground },
            {
              opacity: slideAnim3,
              transform: [{ translateY: slideAnim3.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Cette semaine
          </Text>

          <View style={styles.weekStats}>
            <View style={styles.weekStatItem}>
              <Text style={[styles.weekStatValue, { color: colors.text }]}>
                2,340€
              </Text>
              <Text style={[styles.weekStatLabel, { color: colors.textSecondary }]}>
                CA total
              </Text>
            </View>
            <View style={[styles.weekDivider, { backgroundColor: colors.border }]} />
            <View style={styles.weekStatItem}>
              <Text style={[styles.weekStatValue, { color: colors.text }]}>
                47
              </Text>
              <Text style={[styles.weekStatLabel, { color: colors.textSecondary }]}>
                clients
              </Text>
            </View>
            <View style={[styles.weekDivider, { backgroundColor: colors.border }]} />
            <View style={styles.weekStatItem}>
              <Text style={[styles.weekStatValue, { color: colors.success }]}>
                7j
              </Text>
              <Text style={[styles.weekStatLabel, { color: colors.textSecondary }]}>
                série
              </Text>
            </View>
          </View>
        </Animated.View>

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
  mainCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  kpiLabel: {
    ...typography.label,
  },
  trendBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mainValue: {
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: -1,
    marginBottom: spacing.lg,
  },
  goalContainer: {},
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  goalLabel: {
    ...typography.caption,
  },
  goalValue: {
    ...typography.caption,
    fontWeight: '600',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiCard: {
    width: '48%',
    flexGrow: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  kpiCardLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  kpiCardValue: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  kpiCardSub: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  breakdownCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyBold,
    marginBottom: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    ...typography.body,
  },
  breakdownValue: {
    ...typography.bodyBold,
  },
  breakdownBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  breakdownFill: {
    height: '100%',
  },
  statsFooter: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statsFooterText: {
    ...typography.caption,
  },
  trendCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  weekStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  weekStatValue: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: spacing.xs,
  },
  weekStatLabel: {
    ...typography.caption,
  },
  weekDivider: {
    width: 1,
    height: 40,
  },
  scrollPadding: {
    height: spacing.xl,
  },
});
