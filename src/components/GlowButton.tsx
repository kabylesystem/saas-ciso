import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface GlowButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
}) => {
  const { colors, mode } = useTheme();
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  const isPrimary = variant === 'primary';
  const glowColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: glowScale }],
          },
        ]}
      >
        {/* Outer glow layers */}
        <Animated.View
          style={[
            styles.glowOuter,
            {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              opacity: glowOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.glowMiddle,
            {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',
              opacity: glowOpacity,
            },
          ]}
        />
        
        {/* Main button */}
        <View
          style={[
            styles.button,
            {
              backgroundColor: isPrimary ? colors.buttonPrimary : 'transparent',
              borderColor: colors.border,
              borderWidth: isPrimary ? 0 : 1,
            },
          ]}
        >
          {/* Inner glow effect */}
          <Animated.View
            style={[
              styles.innerGlow,
              {
                backgroundColor: glowColor,
                opacity: glowAnim,
              },
            ]}
          />
          
          <Text
            style={[
              styles.text,
              {
                color: isPrimary ? colors.buttonPrimaryText : colors.text,
              },
            ]}
          >
            {title}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: borderRadius.lg + 6,
    borderWidth: 1,
  },
  glowMiddle: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: borderRadius.lg + 3,
    borderWidth: 1,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.md,
  },
  text: {
    ...typography.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});





