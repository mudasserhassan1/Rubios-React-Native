import {Swipeable} from 'react-native-gesture-handler';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const SwipeAbleListItem = forwardRef(
  ({onSwipeOpen, onSwipeClose, children, renderLeftActions, containerStyle}, ref) => {
    let swipeRef = useRef(null);
    const shake = useSharedValue(0);

    const close = () => {
      swipeRef?.current?.close();
    };

    const openRight = () => {
      swipeRef.current?.openRight();
    };
    const openLeft = () => {
      swipeRef.current?.openLeft();
    };

    useImperativeHandle(ref, () => ({
      openRight,
      openLeft,
      close,
      animate,
    }));

    const animate = () => {
      shake.value = withRepeat(
        withSequence(
          withTiming(30, {duration: 200}),
          withTiming(-20, {duration: 200}),
          withTiming(20, {duration: 200}),
          withTiming(-10, {duration: 200}),
          withTiming(10, {duration: 200}),
          withTiming(0, {duration: 200}),
        ),
        1,
      );
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{translateX: shake.value}],
    }));

    return (
      <Swipeable
        ref={swipeRef}
        friction={2}
        onSwipeableLeftWillOpen={() => {
            onSwipeOpen();
            global.animateFirstSelection = false
        }
      }
        leftThreshold={50}
        containerStyle={containerStyle}
        renderLeftActions={renderLeftActions}
        onSwipeableWillClose={onSwipeClose}
        onSwipeableLeftOpen={onSwipeOpen}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </Swipeable>
    );
  },
);

export default SwipeAbleListItem;
