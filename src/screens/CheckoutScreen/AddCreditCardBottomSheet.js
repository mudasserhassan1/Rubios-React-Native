import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Animated, TouchableOpacity, View} from 'react-native';

const AddCreditCardBottomSheet = ({isOpen, children, sheetContainerStyle}) => {
  const [sheetHeight, setSheetHeight] = useState(0);
  const bottomSheetAnimatedValue = useRef(new Animated.Value(0)).current;
  const opacityAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bottomSheetAnimatedValue, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimatedValue, {
        toValue: isOpen ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  const handleLayout = event => {
    const {height} = event.nativeEvent.layout;
    setSheetHeight(height);
  };

  const translateYInterpolate = bottomSheetAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetHeight, 0],
  });

  const opacityInterpolate = opacityAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View accessibilityElementsHidden={!isOpen} style={styles.container} pointerEvents={isOpen ? 'auto' : 'none'}>
      <TouchableOpacity
          accessible={false}
        style={[styles.overlay, isOpen && {backgroundColor: 'rgba(0, 0, 0, 0.3)'}]}
        activeOpacity={1}>
        <Animated.View
            accessible={false}
          style={[
            styles.sheet,
            sheetContainerStyle,
            {transform: [{translateY: translateYInterpolate}], opacity: opacityInterpolate},
          ]}
          onLayout={handleLayout}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddCreditCardBottomSheet;
