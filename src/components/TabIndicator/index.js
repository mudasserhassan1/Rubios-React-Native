import React, {useRef, useEffect} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {colors} from '../../theme';

const TabBarIndicator = ({activeTab, totalTabs = 0, tabWidth, containerStyle}) => {
  const indicatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateIndicator(activeTab);
  }, [activeTab]);

  const animateIndicator = index => {
    Animated.timing(indicatorPosition, {
      toValue: index,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const renderIndicator = () => {
    const translateX = indicatorPosition.interpolate({
      inputRange: [0, totalTabs],
      outputRange: [0, tabWidth * totalTabs],
    });

    return (
      <Animated.View style={[styles.indicator, {width: tabWidth, transform: [{translateX}]}]} />
    );
  };

  return <View style={[styles.container, containerStyle]}>{renderIndicator()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 4,
    position: 'absolute',
    bottom: -5,
  },
  indicator: {
    position: 'absolute',
    height: 3,
    alignSelf: 'center',
    backgroundColor: colors.secondary, // Active tab indicator color
  },
});

export default TabBarIndicator;
