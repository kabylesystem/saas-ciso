import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
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
const SWIPE_THRESHOLD = 80;

export const SwipeableModal: React.FC<SwipeableModalProps> = ({
  visible,
  onClose,
  children,
  maxHeight = SCREEN_HEIGHT * 0.85,
}) => {
  const { colors } = useTheme();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollOffset = useRef(0);
  const isScrolling = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Allow swipe down if at top of scroll or scrolling down
        const isSwipingDown = gestureState.dy > 10;
        const isAtTop = scrollOffset.current <= 0;
        return isSwipingDown && (isAtTop || !isScrolling.current);
      },
      onPanResponderGrant: () => {
        // Started gesture
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > 0.5) {
          closeModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }).start();
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
      scrollOffset.current = 0;
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 65,
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
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.overlayTouch} onPress={closeModal} />
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.container,
          {
            backgroundColor: colors.cardBackground,
            maxHeight,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Swipe handle */}
        <View style={styles.handleArea}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          onScroll={(e) => {
            scrollOffset.current = e.nativeEvent.contentOffset.y;
          }}
          onScrollBeginDrag={() => {
            isScrolling.current = true;
          }}
          onScrollEndDrag={() => {
            isScrolling.current = false;
          }}
          scrollEventThrottle={16}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayTouch: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
});
