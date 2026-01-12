import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius } from '../theme/spacing';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme, colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(mode === 'dark' ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: mode === 'dark' ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [mode]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    toggleTheme();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.container, { borderColor: colors.border }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View 
          style={[
            styles.indicator,
            { 
              backgroundColor: colors.text,
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 30],
                }),
              }],
            }
          ]} 
        />
        <Text style={[styles.icon, { color: mode === 'dark' ? colors.text : colors.textSecondary }]}>
          ☀
        </Text>
        <Text style={[styles.icon, { color: mode === 'light' ? colors.text : colors.textSecondary }]}>
          ☾
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.full,
    padding: 2,
    width: 56,
    height: 28,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    opacity: 0.2,
  },
  icon: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
});
