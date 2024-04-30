import React from 'react';
import {Text} from 'react-native';
import {FONT_SIZE, FONT_WEIGHT} from './constants';
import {styles} from './styles';
import {colors} from '../../theme';
import {isIos} from "../../utils/sharedUtils";

const RText = React.forwardRef(
  (
    {
      weight,
      size,
      color = colors.primary,
      txOptions,
      text,
      children,
      textStyle,
      preset,
      numberOfLines,
      ellipsizeMode,
      onPress,
      accessibilityRole,
      accessibilityLabel,
      accessible,
      accessibilityHint,
      accessibilityComponentType,
        maxFontSizeMultiplier = 1.3,
        accessibilityValue,
        allowFontScaling = isIos,
      ...rest
    },
    ref,
  ) => {
    const styleOverride = [
      styles[preset] || styles.default,
      FONT_WEIGHT[weight],
      {...FONT_SIZE[size]} || {},
      {color},
      textStyle,
    ];

    return (
      <Text
        {...rest}
        ref={ref}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
        accessible={accessible}
        allowFontScaling={allowFontScaling}
        maxFontSizeMultiplier={isIos ? maxFontSizeMultiplier : 1.1}
        accessibilityRole={accessibilityRole}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={accessibilityValue}
        style={styleOverride}>
        {text || children}
      </Text>
    );
  },
);

export default RText;

// const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
//   return {...acc, [weight]: {fontFamily}};
// }, {});
