import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius } from '../theme/spacing';

interface GlowCardProps {
  children: React.ReactNode;
  style?: any;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  style,
  intensity = 'medium',
}) => {
  const { colors, mode } = useTheme();
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const intensityValues = {
    low: { min: 0.2, max: 0.4 },
    medium: { min: 0.3, max: 0.6 },
    high: { min: 0.4, max: 0.8 },
  };

  const { min, max } = intensityValues[intensity];

  useEffect(() => {
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: max,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowOpacity, {
          toValue: min,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.003,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    glowAnimation.start();
    scaleAnimation.start();
    
    return () => {
      glowAnimation.stop();
      scaleAnimation.stop();
    };
  }, []);

  const glowColor = mode === 'dark' 
    ? 'rgba(255, 255, 255, 1)' 
    : 'rgba(0, 0, 0, 1)';

  return (
    <Animated.View style={[styles.wrapper, style, { transform: [{ scale: scaleAnim }] }]}>
      {/* Outer glow layer */}
      <Animated.View
        style={[
          styles.glowOuter,
          {
            borderColor: glowColor,
            opacity: Animated.multiply(glowOpacity, 0.3),
          },
        ]}
        pointerEvents="none"
      />
      {/* Inner glow layer */}
      <Animated.View
        style={[
          styles.glowInner,
          {
            borderColor: glowColor,
            opacity: Animated.multiply(glowOpacity, 0.5),
          },
        ]}
        pointerEvents="none"
      />
      {/* Content */}
      <View style={[styles.content, { backgroundColor: colors.cardBackground }]}>
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: borderRadius.lg + 3,
    borderWidth: 1,
  },
  glowInner: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: borderRadius.lg + 1,
    borderWidth: 1,
  },
  content: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});



