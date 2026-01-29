import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';

interface SwipeableModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60;

export const SwipeableModal: React.FC<SwipeableModalProps> = ({
  visible,
  onClose,
  children,
  maxHeight = SCREEN_HEIGHT * 0.85,
}) => {
  const { colors } = useTheme();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Global pan responder - works anywhere on screen
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => {
        // Capture any downward swipe from anywhere
        return gs.dy > 5 && Math.abs(gs.dy) > Math.abs(gs.dx);
      },
      onPanResponderGrant: () => {
        // Visual feedback when gesture starts
      },
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          translateY.setValue(gs.dy);
          // Fade overlay as user swipes
          fadeAnim.setValue(1 - Math.min(gs.dy / 300, 0.5));
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > SWIPE_THRESHOLD || gs.vy > 0.3) {
          closeModal();
        } else {
          // Snap back with spring
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              tension: 100,
              friction: 10,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_HEIGHT);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* Full screen gesture capture area */}
      <Animated.View 
        style={[styles.fullScreen, { opacity: fadeAnim }]}
        {...panResponder.panHandlers}
      >
        {/* Overlay background */}
        <View style={styles.overlay} />

        {/* Modal content */}
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.cardBackground,
              maxHeight,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Swipe handle indicator */}
          <View style={styles.handleArea}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  handleArea: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingBottom: spacing.xl,
  },
});


