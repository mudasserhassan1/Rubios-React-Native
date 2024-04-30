import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../theme';

const PaginationDot = ({
  size,
  activeColor,
  inActiveColor,
  activeOpacity,
  inActiveOpacity,
  dotStyle,
  maxPage,
  curPage,
  containerStyle,
  onDotPress,
}) => {
  const mapper = useMemo(() => Array.from({length: maxPage}, (v, i) => i), [maxPage]);

  const Dot = props => {
    const {value} = props;
    return (
      <View
        key={String(value)}
        onPress={() => onDotPress(value)}
        activeOpacity={1}
        style={[
          styles.dot,
          dotStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: curPage === value ? activeColor : inActiveColor,
            opacity: curPage === value ? activeOpacity : inActiveOpacity,
          },
        ]}
      />
    );
  };

  return (
    <View style={[styles.dotsContainer, containerStyle]}>
      {mapper.map(value => (
        <Dot value={value} key={value} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

PaginationDot.defaultProps = {
  size: 8,
  curPage: 0,
  activeColor: colors.black,
  inActiveColor: colors.white,
  activeOpacity: 1,
  inActiveOpacity: 1,
  onDotPress: () => {},
};

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps.curPage === nextProps.curPage;
};
export default React.memo(PaginationDot, arePropsEqual);
