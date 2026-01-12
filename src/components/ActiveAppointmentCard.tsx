import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Appointment } from '../types';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { GlowCard } from './GlowCard';

interface ActiveAppointmentCardProps {
  appointment: Appointment;
  onDecreaseDuration: () => void;
  onIncreaseDuration: () => void;
  onFinish: () => void;
  onClientPress: () => void;
}

export const ActiveAppointmentCard: React.FC<ActiveAppointmentCardProps> = ({
  appointment,
  onDecreaseDuration,
  onIncreaseDuration,
  onFinish,
  onClientPress,
}) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [lastDuration, setLastDuration] = React.useState(appointment.duration);

  useEffect(() => {
    if (appointment.duration !== lastDuration) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.01,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      setLastDuration(appointment.duration);
    }
  }, [appointment.duration]);

  const client = appointment.client;
  const isVIP = client && client.visitCount >= 10;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: pulseAnim }] }]}>
      <GlowCard style={styles.cardWrapper} intensity="high">
        <View style={styles.content}>
          {/* Status indicator */}
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              EN COURS
            </Text>
          </View>

          {/* Client info - clickable */}
          <TouchableOpacity onPress={onClientPress} activeOpacity={0.7}>
            <View style={styles.clientRow}>
              <Text style={[styles.clientName, { color: colors.text }]}>
                {appointment.clientName}
              </Text>
              {isVIP && (
                <View style={[styles.vipBadge, { backgroundColor: '#FFD700' }]}>
                  <Text style={styles.vipText}>VIP</Text>
                </View>
              )}
            </View>
            <Text style={[styles.service, { color: colors.textSecondary }]}>
              {appointment.serviceName}
            </Text>
          </TouchableOpacity>

          {/* Time and price */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Heure</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {appointment.recalculatedStartTime || appointment.scheduledStartTime}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Durée</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {appointment.duration} min
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Prix</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {appointment.price}€
              </Text>
            </View>
          </View>

          {/* Duration controls */}
          <View style={styles.durationRow}>
            <TouchableOpacity
              style={[styles.durationBtn, { backgroundColor: colors.buttonSecondary }]}
              onPress={onDecreaseDuration}
              activeOpacity={0.6}
            >
              <Text style={[styles.durationText, { color: colors.text }]}>−15</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.durationBtn, { backgroundColor: colors.buttonSecondary }]}
              onPress={onIncreaseDuration}
              activeOpacity={0.6}
            >
              <Text style={[styles.durationText, { color: colors.text }]}>+15</Text>
            </TouchableOpacity>
          </View>

          {/* Finish button */}
          <TouchableOpacity
            style={[styles.finishBtn, { backgroundColor: colors.buttonPrimary }]}
            onPress={onFinish}
            activeOpacity={0.8}
          >
            <Text style={[styles.finishText, { color: colors.buttonPrimaryText }]}>
              Terminer
            </Text>
          </TouchableOpacity>
        </View>
      </GlowCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  cardWrapper: {},
  content: {
    padding: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.label,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  clientName: {
    ...typography.h2,
  },
  vipBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  vipText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  service: {
    ...typography.body,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.h3,
  },
  durationRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  durationBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  durationText: {
    ...typography.bodyBold,
    fontSize: 16,
  },
  finishBtn: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  finishText: {
    ...typography.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
