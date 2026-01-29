import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius } from '../theme/spacing';

interface GlowCardProps {
  children: React.ReactNode;
  style?: any;
}

export const GlowCard: React.FC<GlowCardProps> = ({ children, style }) => {
  const { colors, mode } = useTheme();
  const glowOpacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.5, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(glowOpacity, { toValue: 0.2, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const glowColor = mode === 'dark' ? 'rgba(255, 255, 255, ' : 'rgba(0, 0, 0, ';

  return (
    <View style={[styles.wrapper, style]}>
      <Animated.View
        style={[
          styles.glow,
          {
            borderColor: glowOpacity.interpolate({
              inputRange: [0.2, 0.5],
              outputRange: [`${glowColor}0.2)`, `${glowColor}0.5)`],
            }),
          },
        ]}
        pointerEvents="none"
      />
      <View style={[styles.content, { backgroundColor: colors.cardBackground }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: borderRadius.lg + 2,
    borderWidth: 1,
  },
  content: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});


