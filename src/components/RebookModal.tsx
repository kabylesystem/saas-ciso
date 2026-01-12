import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

export const RebookModal: React.FC<RebookModalProps> = ({
  visible,
  onClose,
  appointment,
  onConfirm,
}) => {
  const { colors } = useTheme();
  const [selectedWeeks, setSelectedWeeks] = useState(3);
  const [selectedTime, setSelectedTime] = useState('14:00');

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

  if (!appointment) return null;

  return (
    <SwipeableModal visible={visible} onClose={onClose}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
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
            <TouchableOpacity
              key={weeks}
              style={[
                styles.weekOption,
                {
                  backgroundColor: selectedWeeks === weeks ? colors.buttonPrimary : colors.buttonSecondary,
                },
              ]}
              onPress={() => setSelectedWeeks(weeks)}
              activeOpacity={0.7}
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
            </TouchableOpacity>
          ))}
        </View>

        {/* Time selector */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          HEURE
        </Text>
        <View style={styles.timesGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeOption,
                {
                  backgroundColor: selectedTime === time ? colors.buttonPrimary : colors.buttonSecondary,
                },
              ]}
              onPress={() => setSelectedTime(time)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timeText,
                  { color: selectedTime === time ? colors.buttonPrimaryText : colors.text },
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
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
        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: colors.buttonPrimary }]}
          onPress={() => {
            onConfirm(selectedWeeks);
            onClose();
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.confirmText, { color: colors.buttonPrimaryText }]}>
            Confirmer
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SwipeableModal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
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

