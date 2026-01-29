import React, { useState, useRef } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ScheduleScreen } from './screens/ScheduleScreen';
import { PerformanceScreen } from './screens/PerformanceScreen';
import { BottomNav } from './components/BottomNav';
import { mockAppointments, mockPerformanceMetrics } from './data/mockData';
import { Appointment } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AppContent: React.FC = () => {
  const { colors, mode } = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'performance'>('schedule');
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleTabChange = (tab: 'schedule' | 'performance') => {
    setActiveTab(tab);
    scrollViewRef.current?.scrollTo({
      x: tab === 'schedule' ? 0 : SCREEN_WIDTH,
      animated: true,
    });
  };

  // Real-time scroll tracking for instant tab updates + synced indicator
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const progress = x / SCREEN_WIDTH;
        const newTab = progress > 0.5 ? 'performance' : 'schedule';
        if (newTab !== activeTab) {
          setActiveTab(newTab);
        }
      },
    }
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={8}
        bounces={false}
        decelerationRate="fast"
        style={styles.scrollView}
      >
        <View style={styles.screen}>
          <ScheduleScreen
            appointments={appointments}
            onAppointmentsChange={setAppointments}
          />
        </View>
        <View style={styles.screen}>
          <PerformanceScreen metrics={mockPerformanceMetrics} />
        </View>
      </Animated.ScrollView>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} scrollX={scrollX} />
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
  scrollView: {
    flex: 1,
  },
  screen: {
    width: SCREEN_WIDTH,
  },
});
