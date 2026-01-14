import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme, colors } = useTheme();
  const rotateAnim = useRef(new Animated.Value(mode === 'dark' ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: mode === 'dark' ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [mode]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.container, { borderColor: colors.border }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.iconWrapper, { transform: [{ rotate: spin }] }]}>
          {/* Sun icon */}
          <View style={[
            styles.sunMoon,
            { 
              opacity: mode === 'dark' ? 1 : 0.3,
            }
          ]}>
            <View style={[styles.sunCenter, { backgroundColor: colors.text }]} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <View
                key={angle}
                style={[
                  styles.sunRay,
                  { 
                    backgroundColor: colors.text,
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: -9 },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Moon overlay for light mode */}
        <View style={[
          styles.moonOverlay,
          { 
            opacity: mode === 'light' ? 1 : 0,
            backgroundColor: colors.text,
          }
        ]}>
          <View style={[styles.moonCrater, { backgroundColor: colors.cardBackground }]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunMoon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sunRay: {
    position: 'absolute',
    width: 2,
    height: 4,
    borderRadius: 1,
  },
  moonOverlay: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moonCrater: {
    position: 'absolute',
    top: 3,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
