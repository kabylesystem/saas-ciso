import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
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

const AnimatedButton: React.FC<{
  onPress: () => void;
  style: any;
  children: React.ReactNode;
}> = ({ onPress, style, children }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 50, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }),
    ]).start();
    onPress();
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const ActiveAppointmentCard: React.FC<ActiveAppointmentCardProps> = ({
  appointment,
  onDecreaseDuration,
  onIncreaseDuration,
  onFinish,
  onClientPress,
}) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const clientScale = useRef(new Animated.Value(1)).current;
  const [lastDuration, setLastDuration] = React.useState(appointment.duration);

  useEffect(() => {
    if (appointment.duration !== lastDuration) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.01, duration: 100, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      setLastDuration(appointment.duration);
    }
  }, [appointment.duration]);

  const client = appointment.client;
  const isVIP = client && client.visitCount >= 10;

  const handleClientPressIn = () => {
    Animated.spring(clientScale, { toValue: 0.98, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

  const handleClientPressOut = () => {
    Animated.spring(clientScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

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
          <TouchableWithoutFeedback 
            onPressIn={handleClientPressIn}
            onPressOut={handleClientPressOut}
            onPress={onClientPress}
          >
            <Animated.View style={{ transform: [{ scale: clientScale }] }}>
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
            </Animated.View>
          </TouchableWithoutFeedback>

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
            <AnimatedButton
              style={[styles.durationBtn, { backgroundColor: colors.buttonSecondary }]}
              onPress={onDecreaseDuration}
            >
              <Text style={[styles.durationText, { color: colors.text }]}>−15</Text>
            </AnimatedButton>
            <AnimatedButton
              style={[styles.durationBtn, { backgroundColor: colors.buttonSecondary }]}
              onPress={onIncreaseDuration}
            >
              <Text style={[styles.durationText, { color: colors.text }]}>+15</Text>
            </AnimatedButton>
          </View>

          {/* Finish button */}
          <AnimatedButton
            style={[styles.finishBtn, { backgroundColor: colors.buttonPrimary }]}
            onPress={onFinish}
          >
            <Text style={[styles.finishText, { color: colors.buttonPrimaryText }]}>
              Terminer
            </Text>
          </AnimatedButton>
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
