import {screens, strings} from '../../constants';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../theme';
import RText from '../RText';
import ImageComponent from '../ImageComponent/ImageComponent';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {navigationRef} from '../../utils/navigationUtils';

const CircularIcon = forwardRef(({
  style,
  type = 'image',
  onPress,
  imageSource,
  imageStyle,
  SVGComponent,
  countIndicator,
  withShadow = true,
  emailIcon = false,
  accessible,
  accessibilityHint,
    accessibilityLabel,
  ...rest
}, ref) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (typeof onPress === 'function') {
      return onPress?.();
    }
    logFirebaseCustomEvent(strings.click, {
      click_label: navigationRef.current?.getCurrentRoute?.()?.name,
      click_destination: screens.CART,
    });
    return navigation.navigate(screens.CART);
  };

  const Image = type === 'svg' ? SVGComponent : ImageComponent;

  const ImageProps = {
    ...(type !== 'svg' && {source: imageSource, style: imageStyle}),
  };

  return (
    <TouchableOpacity
        ref={ref}
      accessible={accessible}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={'button'}
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.cartIconView, withShadow && styles.shadowStyle, style]}
      {...rest}>
      {countIndicator > 0 ? (
        <View accessibilityElementsHidden={!accessible} style={styles.basketCountIndicatorView}>
          <RText text={countIndicator} size={'xxs'} color={colors.white} />
        </View>
      ) : null}
      <Image {...ImageProps} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cartIconView: {
    width: 41,
    height: 41,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowStyle: {
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.0,
        shadowColor: colors.black,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cartIcon: {width: 25, height: 25},
  basketCountIndicatorView: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 25,
    minHeight: 25,
    borderRadius: 20,
    backgroundColor: '#E43E2B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 22,
  },
});
export default CircularIcon;
