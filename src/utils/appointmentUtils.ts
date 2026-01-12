import { Appointment } from '../types';
import { addMinutes } from './timeUtils';

export const recalculateAppointments = (
  appointments: Appointment[],
  activeAppointmentId: string,
  activeStartTime: string
): Appointment[] => {
  const activeIndex = appointments.findIndex(apt => apt.id === activeAppointmentId);
  if (activeIndex === -1) return appointments;

  const updated = [...appointments];
  let currentTime = activeStartTime;

  // Update active appointment
  updated[activeIndex] = {
    ...updated[activeIndex],
    recalculatedStartTime: currentTime,
  };

  // Recalculate all subsequent appointments
  for (let i = activeIndex + 1; i < updated.length; i++) {
    const prevDuration = updated[i - 1].duration;
    currentTime = addMinutes(currentTime, prevDuration);
    updated[i] = {
      ...updated[i],
      recalculatedStartTime: currentTime,
    };
  }

  return updated;
};
