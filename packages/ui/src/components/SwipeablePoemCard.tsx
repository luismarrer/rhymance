import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { DesignTokens } from '../tokens';
import { PoemCard, PoemCardAuthor, PoemCardPoem } from './PoemCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 110;

export interface SwipeableCardRef {
  swipeLeft: () => void;
  swipeRight: () => void;
}

export interface SwipeablePoemCardProps {
  poem: PoemCardPoem;
  author: PoemCardAuthor;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onPressProfile?: () => void;
}

export const SwipeablePoemCard = forwardRef<SwipeableCardRef, SwipeablePoemCardProps>(
  ({ poem, author, onSwipeLeft, onSwipeRight, onPressProfile }, ref) => {
    const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    // Reset position when card changes
    useEffect(() => {
      pan.setValue({ x: 0, y: 0 });
    }, [poem.id]);

    const flyOff = (direction: 'left' | 'right', callback: () => void) => {
      const targetX = direction === 'right' ? SCREEN_WIDTH * 1.4 : -SCREEN_WIDTH * 1.4;
      Animated.timing(pan, {
        toValue: { x: targetX, y: 0 },
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        pan.setValue({ x: 0, y: 0 });
        callback();
      });
    };

    useImperativeHandle(ref, () => ({
      swipeLeft: () => flyOff('left', onSwipeLeft),
      swipeRight: () => flyOff('right', onSwipeRight),
    }));

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only take over if horizontal move is distinct
          return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        },
        onPanResponderMove: Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > SWIPE_THRESHOLD) {
            flyOff('right', onSwipeRight);
          } else if (gestureState.dx < -SWIPE_THRESHOLD) {
            flyOff('left', onSwipeLeft);
          } else {
            // Spring back to center
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              tension: 40,
              useNativeDriver: false,
            }).start();
          }
        },
      })
    ).current;

    // Rotation based on horizontal pan
    const rotate = pan.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.8, 0, SCREEN_WIDTH * 0.8],
      outputRange: ['-12deg', '0deg', '12deg'],
      extrapolate: 'clamp',
    });

    // Stamp opacities
    const likeOpacity = pan.x.interpolate({
      inputRange: [15, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const nopeOpacity = pan.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, -15],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.wrapper}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.animatedContainer,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotate },
              ],
            },
          ]}
        >
          {/* LIKE Stamp */}
          <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>

          {/* NOPE Stamp */}
          <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeText}>NOPE</Text>
          </Animated.View>

          {/* Poem Card Body */}
          <PoemCard poem={poem} author={author} onPressProfile={onPressProfile} />
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedContainer: {
    width: '100%',
    position: 'relative',
  },
  stamp: {
    position: 'absolute',
    top: 24,
    zIndex: 100,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: 4,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 3,
  },
  likeStamp: {
    left: 24,
    borderColor: DesignTokens.colors.passion,
    backgroundColor: 'rgba(255, 107, 157, 0.12)',
    transform: [{ rotate: '-15deg' }],
  },
  nopeStamp: {
    right: 24,
    borderColor: DesignTokens.colors.red,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    transform: [{ rotate: '15deg' }],
  },
  likeText: {
    color: DesignTokens.colors.passion,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  nopeText: {
    color: DesignTokens.colors.red,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
