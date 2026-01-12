import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
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
  const prevTimeRef = useRef(appointment.recalculatedStartTime);

  const client = appointment.client;
  const isVIP = client && client.visitCount >= 10;
  const hasWarning = client && client.noShowCount >= 2;

  useEffect(() => {
    if (prevTimeRef.current !== appointment.recalculatedStartTime) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      prevTimeRef.current = appointment.recalculatedStartTime;
    }
  }, [appointment.recalculatedStartTime]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      delay: index * 60,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
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
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
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
              <View style={[styles.badge, { backgroundColor: '#FFD700' }]}>
                <Text style={styles.badgeText}>VIP</Text>
              </View>
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
    </TouchableOpacity>
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
