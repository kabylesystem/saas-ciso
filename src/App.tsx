import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ScheduleScreen } from './screens/ScheduleScreen';
import { PerformanceScreen } from './screens/PerformanceScreen';
import { BottomNav } from './components/BottomNav';
import { mockAppointments, mockPerformanceMetrics } from './data/mockData';
import { Appointment } from './types';

const AppContent: React.FC = () => {
  const { colors, mode } = useTheme();
  const [activeTab, setActiveTab] = useState<'schedule' | 'performance'>('schedule');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      {activeTab === 'schedule' ? (
        <ScheduleScreen
          appointments={appointments}
          onAppointmentsChange={setAppointments}
        />
      ) : (
        <PerformanceScreen metrics={mockPerformanceMetrics} />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
