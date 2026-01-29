import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Appointment } from '../types';
import { SwipeableModal } from './SwipeableModal';

interface RebookModalProps {
  visible: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onConfirm: (weeks: number) => void;
}

const weekOptions = [1, 2, 3, 4, 6, 8];
const timeSlots = ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

const AnimatedOption: React.FC<{
  onPress: () => void;
  isSelected: boolean;
  selectedColor: string;
  defaultColor: string;
  children: React.ReactNode;
  style?: any;
}> = ({ onPress, isSelected, selectedColor, defaultColor, children, style }) => {
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
      <Animated.View 
        style={[
          style, 
          { 
            backgroundColor: isSelected ? selectedColor : defaultColor,
            transform: [{ scale }] 
          }
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const RebookModal: React.FC<RebookModalProps> = ({
  visible,
  onClose,
  appointment,
  onConfirm,
}) => {
  const { colors } = useTheme();
  const [selectedWeeks, setSelectedWeeks] = useState(3);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const confirmScale = useRef(new Animated.Value(1)).current;

  const getFutureDate = (weeks: number) => {
    const date = new Date();
    date.setDate(date.getDate() + weeks * 7);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const handleConfirmPressIn = () => {
    Animated.spring(confirmScale, { toValue: 0.95, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

  const handleConfirmPressOut = () => {
    Animated.spring(confirmScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

  const handleConfirm = () => {
    Animated.sequence([
      Animated.timing(confirmScale, { toValue: 0.9, duration: 50, useNativeDriver: true }),
      Animated.spring(confirmScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }),
    ]).start();
    onConfirm(selectedWeeks);
    onClose();
  };

  if (!appointment) return null;

  return (
    <SwipeableModal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Re-booker
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {appointment.clientName} · {appointment.serviceName}
          </Text>
        </View>

        {/* Week selector */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          DANS COMBIEN DE TEMPS
        </Text>
        <View style={styles.weeksGrid}>
          {weekOptions.map((weeks) => (
            <AnimatedOption
              key={weeks}
              onPress={() => setSelectedWeeks(weeks)}
              isSelected={selectedWeeks === weeks}
              selectedColor={colors.buttonPrimary}
              defaultColor={colors.buttonSecondary}
              style={styles.weekOption}
            >
              <Text
                style={[
                  styles.weekValue,
                  { color: selectedWeeks === weeks ? colors.buttonPrimaryText : colors.text },
                ]}
              >
                {weeks}
              </Text>
              <Text
                style={[
                  styles.weekLabel,
                  { color: selectedWeeks === weeks ? colors.buttonPrimaryText : colors.textSecondary },
                ]}
              >
                sem
              </Text>
            </AnimatedOption>
          ))}
        </View>

        {/* Time selector */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          HEURE
        </Text>
        <View style={styles.timesGrid}>
          {timeSlots.map((time) => (
            <AnimatedOption
              key={time}
              onPress={() => setSelectedTime(time)}
              isSelected={selectedTime === time}
              selectedColor={colors.buttonPrimary}
              defaultColor={colors.buttonSecondary}
              style={styles.timeOption}
            >
              <Text
                style={[
                  styles.timeText,
                  { color: selectedTime === time ? colors.buttonPrimaryText : colors.text },
                ]}
              >
                {time}
              </Text>
            </AnimatedOption>
          ))}
        </View>

        {/* Preview */}
        <View style={[styles.preview, { backgroundColor: colors.buttonSecondary }]}>
          <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
            PROCHAIN RDV
          </Text>
          <Text style={[styles.previewDate, { color: colors.text }]}>
            {getFutureDate(selectedWeeks)}
          </Text>
          <Text style={[styles.previewTime, { color: colors.text }]}>
            {selectedTime}
          </Text>
        </View>

        {/* Confirm */}
        <TouchableWithoutFeedback
          onPressIn={handleConfirmPressIn}
          onPressOut={handleConfirmPressOut}
          onPress={handleConfirm}
        >
          <Animated.View 
            style={[
              styles.confirmBtn, 
              { backgroundColor: colors.buttonPrimary, transform: [{ scale: confirmScale }] }
            ]}
          >
            <Text style={[styles.confirmText, { color: colors.buttonPrimaryText }]}>
              Confirmer
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </SwipeableModal>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  weeksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  weekOption: {
    width: '30%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  weekValue: {
    fontSize: 18,
    fontWeight: '400',
  },
  weekLabel: {
    ...typography.label,
    marginTop: 2,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  timeOption: {
    width: '30%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  timeText: {
    ...typography.body,
  },
  preview: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  previewLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  previewDate: {
    ...typography.h3,
    textTransform: 'capitalize',
  },
  previewTime: {
    ...typography.largeNumber,
    fontSize: 32,
    marginTop: spacing.xs,
  },
  confirmBtn: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  confirmText: {
    ...typography.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});


