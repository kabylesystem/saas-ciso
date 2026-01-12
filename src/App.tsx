import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';
import { ScheduleScreen } from './screens/ScheduleScreen';
import { PerformanceScreen } from './screens/PerformanceScreen';
import { Appointment, PerformanceMetrics } from './types';
import { initialAppointments, mockPerformanceMetrics } from './data/mockData';
import { useTheme } from './context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AppContent: React.FC = () => {
  const { colors, mode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [metrics] = useState<PerformanceMetrics>(mockPerformanceMetrics);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        bounces={false}
      >
        <View style={styles.screen}>
          <ScheduleScreen
            appointments={appointments}
            onAppointmentsChange={setAppointments}
          />
        </View>
        <View style={styles.screen}>
          <PerformanceScreen metrics={metrics} />
        </View>
      </ScrollView>

      {/* Page indicators */}
      <View style={styles.indicators}>
        <View
          style={[
            styles.indicator,
            {
              backgroundColor: colors.text,
              opacity: currentIndex === 0 ? 1 : 0.3,
            },
          ]}
        />
        <View
          style={[
            styles.indicator,
            {
              backgroundColor: colors.text,
              opacity: currentIndex === 1 ? 1 : 0.3,
            },
          ]}
        />
      </View>
    </View>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingBottom: 28,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default App;
