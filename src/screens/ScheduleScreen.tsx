import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Alert, Animated } from 'react-native';
import { Appointment } from '../types';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ActiveAppointmentCard } from '../components/ActiveAppointmentCard';
import { PlanningListItem } from '../components/PlanningListItem';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { ClientDetailModal } from '../components/ClientDetailModal';
import { RebookModal } from '../components/RebookModal';
import { ThemeToggle } from '../components/ThemeToggle';
import { recalculateAppointments } from '../utils/appointmentUtils';
import { addMinutes } from '../utils/timeUtils';

interface ScheduleScreenProps {
  appointments: Appointment[];
  onAppointmentsChange: (appointments: Appointment[]) => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  appointments,
  onAppointmentsChange,
}) => {
  const { colors } = useTheme();
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(
    appointments.find(apt => apt.isActive)?.id || null
  );

  // Separate state for each modal's appointment
  const [clientDetailAppointment, setClientDetailAppointment] = useState<Appointment | null>(null);
  const [whatsAppAppointment, setWhatsAppAppointment] = useState<Appointment | null>(null);
  const [rebookAppointment, setRebookAppointment] = useState<Appointment | null>(null);
  
  const [delayMinutes, setDelayMinutes] = useState(0);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(labelAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const active = appointments.find(apt => apt.isActive);
    if (active && active.id !== activeAppointmentId) {
      setActiveAppointmentId(active.id);
    } else if (!active && activeAppointmentId) {
      setActiveAppointmentId(null);
    }
  }, [appointments]);

  const activeAppointment = useMemo(() => {
    return appointments.find(apt => apt.id === activeAppointmentId) || null;
  }, [appointments, activeAppointmentId]);

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter(apt => !apt.isActive && apt.id !== activeAppointmentId && !apt.isNoShow)
      .sort((a, b) => {
        const timeA = a.recalculatedStartTime || a.scheduledStartTime;
        const timeB = b.recalculatedStartTime || b.scheduledStartTime;
        return timeA.localeCompare(timeB);
      });
  }, [appointments, activeAppointmentId]);

  const handleDecreaseDuration = () => {
    if (!activeAppointmentId || !activeAppointment) return;

    const newDuration = Math.max(15, activeAppointment.duration - 15);
    const updated = appointments.map(apt =>
      apt.id === activeAppointmentId ? { ...apt, duration: newDuration } : apt
    );

    const recalculated = recalculateAppointments(
      updated,
      activeAppointmentId,
      activeAppointment.recalculatedStartTime || activeAppointment.scheduledStartTime
    );

    onAppointmentsChange(recalculated);
    setDelayMinutes(prev => prev - 15);
  };

  const handleIncreaseDuration = () => {
    if (!activeAppointmentId || !activeAppointment) return;

    const newDuration = activeAppointment.duration + 15;
    const updated = appointments.map(apt =>
      apt.id === activeAppointmentId ? { ...apt, duration: newDuration } : apt
    );

    const recalculated = recalculateAppointments(
      updated,
      activeAppointmentId,
      activeAppointment.recalculatedStartTime || activeAppointment.scheduledStartTime
    );

    onAppointmentsChange(recalculated);
    setDelayMinutes(prev => prev + 15);

    // Suggest notifying next client
    const nextClient = upcomingAppointments[0];
    if (nextClient) {
      setWhatsAppAppointment(nextClient);
    }
  };

  const handleFinish = () => {
    if (!activeAppointmentId || !activeAppointment) return;

    const finishedAppointment = activeAppointment;
    const currentStartTime = activeAppointment.recalculatedStartTime || activeAppointment.scheduledStartTime;
    const endTime = addMinutes(currentStartTime, activeAppointment.duration);

    let updated = appointments.map(apt => {
      if (apt.id === activeAppointmentId) {
        return { ...apt, isActive: false, isCompleted: true };
      }
      return apt;
    });

    const sortedUpcoming = updated
      .filter(apt => !apt.isActive && !apt.isCompleted && !apt.isNoShow)
      .sort((a, b) => {
        const timeA = a.recalculatedStartTime || a.scheduledStartTime;
        const timeB = b.recalculatedStartTime || b.scheduledStartTime;
        return timeA.localeCompare(timeB);
      });
    const nextAppointment = sortedUpcoming[0];

    if (nextAppointment) {
      updated = updated.map(apt =>
        apt.id === nextAppointment.id ? { ...apt, isActive: true, recalculatedStartTime: endTime } : apt
      );

      const recalculated = recalculateAppointments(
        updated,
        nextAppointment.id,
        endTime
      );

      setActiveAppointmentId(nextAppointment.id);
      onAppointmentsChange(recalculated);

      // Show rebook for finished client
      setRebookAppointment(finishedAppointment);
    } else {
      setActiveAppointmentId(null);
      onAppointmentsChange(updated);
    }

    setDelayMinutes(0);
  };

  const handleClientPress = (appointment: Appointment) => {
    setClientDetailAppointment(appointment);
  };

  const handleWhatsAppFromDetail = () => {
    const apt = clientDetailAppointment;
    setClientDetailAppointment(null);
    setTimeout(() => {
      setWhatsAppAppointment(apt);
    }, 400);
  };

  const handleRebookFromDetail = () => {
    const apt = clientDetailAppointment;
    setClientDetailAppointment(null);
    setTimeout(() => {
      setRebookAppointment(apt);
    }, 400);
  };

  const handleNoShow = () => {
    if (!clientDetailAppointment) return;

    Alert.alert(
      'No-show',
      `Marquer ${clientDetailAppointment.clientName} comme absent ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: () => {
            const updated = appointments.map(apt =>
              apt.id === clientDetailAppointment.id
                ? { ...apt, isNoShow: true, isActive: false }
                : apt
            );
            onAppointmentsChange(updated);
            setClientDetailAppointment(null);
          },
        },
      ]
    );
  };

  const handleRebook = (weeks: number) => {
    Alert.alert(
      'RDV confirmé',
      `${rebookAppointment?.clientName} → dans ${weeks} semaine${weeks > 1 ? 's' : ''}`,
      [{ text: 'OK' }]
    );
  };

  const totalRevenue = appointments
    .filter(apt => !apt.isNoShow)
    .reduce((sum, apt) => sum + apt.price, 0);

  const clientCount = appointments.filter(a => !a.isNoShow).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            }],
          },
        ]}
      >
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Planning</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {clientCount} clients · {totalRevenue}€
          </Text>
        </View>
        <ThemeToggle />
      </Animated.View>

      {/* Active appointment */}
      {activeAppointment && (
        <ActiveAppointmentCard
          appointment={activeAppointment}
          onDecreaseDuration={handleDecreaseDuration}
          onIncreaseDuration={handleIncreaseDuration}
          onFinish={handleFinish}
          onClientPress={() => handleClientPress(activeAppointment)}
        />
      )}

      {/* Upcoming label */}
      {upcomingAppointments.length > 0 && (
        <Animated.Text 
          style={[
            styles.sectionLabel, 
            { color: colors.textSecondary },
            {
              opacity: labelAnim,
              transform: [{
                translateX: labelAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            },
          ]}
        >
          À VENIR
        </Animated.Text>
      )}

      {/* List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {upcomingAppointments.map((appointment, index) => (
          <PlanningListItem
            key={appointment.id}
            appointment={appointment}
            isActive={false}
            index={index}
            onPress={() => handleClientPress(appointment)}
          />
        ))}
        <View style={styles.scrollPadding} />
      </ScrollView>

      {/* Modals - each with its own appointment state */}
      <WhatsAppModal
        visible={whatsAppAppointment !== null}
        onClose={() => setWhatsAppAppointment(null)}
        appointment={whatsAppAppointment}
        delayMinutes={Math.abs(delayMinutes)}
      />

      <ClientDetailModal
        visible={clientDetailAppointment !== null}
        onClose={() => setClientDetailAppointment(null)}
        appointment={clientDetailAppointment}
        onWhatsApp={handleWhatsAppFromDetail}
        onNoShow={handleNoShow}
        onRebook={handleRebookFromDetail}
      />

      <RebookModal
        visible={rebookAppointment !== null}
        onClose={() => setRebookAppointment(null)}
        appointment={rebookAppointment}
        onConfirm={handleRebook}
      />
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
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    ...typography.label,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollPadding: {
    height: spacing.xxl,
  },
});
