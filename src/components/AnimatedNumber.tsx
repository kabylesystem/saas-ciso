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
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
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
    <Text style={style}>
      {displayValue}{suffix}
    </Text>
  );
};
