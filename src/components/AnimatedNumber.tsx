import React, { useEffect, useRef, useState } from 'react';
import { Text, TextStyle, Animated, Easing } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  style?: TextStyle;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1500,
  suffix = '',
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    // Bounce when value changes significantly
    if (Math.abs(value - prevValue.current) > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 8 }),
      ]).start();
    }
    prevValue.current = value;

    animatedValue.setValue(0);
    
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value: v }) => {
      setDisplayValue(Math.round(v));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value]);

  return (
    <Animated.Text style={[style, { transform: [{ scale: scaleAnim }] }]}>
      {displayValue}{suffix}
    </Animated.Text>
  );
};


