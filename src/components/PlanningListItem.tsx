import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Easing } from 'react-native';
import { Appointment } from '../types';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface PlanningListItemProps {
  appointment: Appointment;
  isActive: boolean;
  index: number;
  onPress: () => void;
}

export const PlanningListItem: React.FC<PlanningListItemProps> = ({
  appointment,
  isActive,
  index,
  onPress,
}) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const prevTimeRef = useRef(appointment.recalculatedStartTime);

  const client = appointment.client;
  const isVIP = client && client.visitCount >= 10;
  const hasWarning = client && client.noShowCount >= 2;

  // Shimmer animation for VIP
  useEffect(() => {
    if (isVIP) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(shimmerAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }
  }, [isVIP]);

  useEffect(() => {
    if (prevTimeRef.current !== appointment.recalculatedStartTime) {
      // Pulse when time changes
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 150, useNativeDriver: true }),
        Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }),
      ]).start();
      prevTimeRef.current = appointment.recalculatedStartTime;
    }
  }, [appointment.recalculatedStartTime]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      delay: index * 40,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 10 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.94, duration: 50, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 400, friction: 8 }),
    ]).start();
    onPress();
  };

  const vipScale = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.cardBackground,
            opacity: slideAnim,
            transform: [
              { scale: Animated.multiply(pulseAnim, scaleAnim) },
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Time */}
        <View style={[styles.timeSection, { backgroundColor: colors.buttonSecondary }]}>
          <Text style={[styles.time, { color: colors.text }]}>
            {appointment.recalculatedStartTime || appointment.scheduledStartTime}
          </Text>
        </View>

        {/* Client info */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]}>
              {appointment.clientName}
            </Text>
            {isVIP && (
              <Animated.View style={[styles.badge, { backgroundColor: '#FFD700', transform: [{ scale: vipScale }] }]}>
                <Text style={styles.badgeText}>VIP</Text>
              </Animated.View>
            )}
            {hasWarning && (
              <Text style={[styles.warningIcon, { color: colors.danger }]}>⚠</Text>
            )}
          </View>
          <Text style={[styles.service, { color: colors.textSecondary }]}>
            {appointment.serviceName} · {appointment.duration} min
          </Text>
        </View>

        {/* Price */}
        <Text style={[styles.price, { color: colors.text }]}>
          {appointment.price}€
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  timeSection: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  time: {
    ...typography.bodyBold,
    fontSize: 13,
  },
  infoSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.bodyBold,
  },
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  badgeText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  warningIcon: {
    fontSize: 12,
  },
  service: {
    ...typography.caption,
    marginTop: 2,
  },
  price: {
    ...typography.price,
  },
});
