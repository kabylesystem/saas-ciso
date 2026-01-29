import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Easing,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const slideOutX = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const buttonScales = useRef<Animated.Value[]>([]).current;
  
  // Only show checkmark when confirming
  const [showCheck, setShowCheck] = useState(false);

  // Initialize button scales
  useEffect(() => {
    while (buttonScales.length < buttons.length) {
      buttonScales.push(new Animated.Value(1));
    }
  }, [buttons.length]);

  // Global swipe to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 10,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          translateY.setValue(gs.dy);
          opacityAnim.setValue(1 - gs.dy / 200);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 80 || gs.vy > 0.5) {
          closeAlert();
        } else {
          Animated.parallel([
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const closeAlert = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setShowCheck(false);
      onClose();
    });
  };

  const closeWithConfirm = (callback?: () => void) => {
    // Show checkmark first
    setShowCheck(true);
    checkScale.setValue(0);
    
    Animated.sequence([
      // Checkmark bounce in
      Animated.spring(checkScale, { 
        toValue: 1, 
        useNativeDriver: true, 
        tension: 200, 
        friction: 8 
      }),
      // Pause
      Animated.delay(300),
      // Slide out
      Animated.parallel([
        Animated.timing(slideOutX, { 
          toValue: 100, 
          duration: 200, 
          easing: Easing.in(Easing.ease),
          useNativeDriver: true 
        }),
        Animated.timing(opacityAnim, { 
          toValue: 0, 
          duration: 200, 
          useNativeDriver: true 
        }),
      ]),
    ]).start(() => {
      callback?.();
      setShowCheck(false);
      onClose();
    });
  };

  useEffect(() => {
    if (visible) {
      // Reset everything
      translateY.setValue(0);
      slideOutX.setValue(0);
      checkScale.setValue(0);
      setShowCheck(false);
      
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 10 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleButtonPressIn = (index: number) => {
    if (buttonScales[index]) {
      Animated.spring(buttonScales[index], { toValue: 0.92, useNativeDriver: true, tension: 300, friction: 10 }).start();
    }
  };

  const handleButtonPressOut = (index: number) => {
    if (buttonScales[index]) {
      Animated.spring(buttonScales[index], { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.style === 'destructive') {
      closeWithConfirm(button.onPress);
    } else {
      button.onPress?.();
      closeAlert();
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View 
        style={[styles.overlay, { opacity: opacityAnim }]}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            styles.alertBox,
            { 
              backgroundColor: colors.cardBackground,
              transform: [
                { scale: scaleAnim }, 
                { translateY }, 
                { translateX: slideOutX }
              ],
            },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleBar}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Checkmark overlay - only rendered when showCheck is true */}
          {showCheck && (
            <Animated.View 
              style={[
                styles.checkOverlay,
                { transform: [{ scale: checkScale }] }
              ]}
              pointerEvents="none"
            >
              <View style={[styles.checkCircle, { borderColor: colors.danger }]}>
                <Text style={[styles.checkText, { color: colors.danger }]}>✓</Text>
              </View>
            </Animated.View>
          )}

          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {message && (
            <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
          )}

          <View style={styles.buttons}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPressIn={() => handleButtonPressIn(index)}
                onPressOut={() => handleButtonPressOut(index)}
                onPress={() => handleButtonPress(button)}
                activeOpacity={1}
                style={[buttons.length > 1 && { flex: 1 }]}
              >
                <Animated.View
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        button.style === 'destructive'
                          ? colors.danger
                          : button.style === 'cancel'
                          ? colors.buttonSecondary
                          : colors.buttonPrimary,
                      transform: [{ scale: buttonScales[index] || 1 }],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          button.style === 'cancel'
                            ? colors.text
                            : button.style === 'destructive'
                            ? '#fff'
                            : colors.buttonPrimaryText,
                      },
                    ]}
                  >
                    {button.text}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  alertBox: {
    width: '100%',
    maxWidth: 320,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    paddingTop: spacing.sm,
    overflow: 'hidden',
  },
  handleBar: {
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  checkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: borderRadius.lg,
    zIndex: 10,
  },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 28,
    fontWeight: '300',
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.bodyBold,
  },
});

