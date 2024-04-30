import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import styles from './styles';
import RText from '../RText';
import {colors} from '../../theme';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {strings} from '../../constants';
import {logToConsole} from '../../configs';
import {isIos} from "../../utils/sharedUtils";

const RButton = (
    {
      buttonStyle,
      titleStyle,
      title,
      disabled,
      loading,
      onPress,
      disabledButtonStyle,
      disabledButtonTitleStyle,
      preset,
      titlePreset = 'label',
      LeftAccessories,
      isSelected,
      click_label,
      click_destination,
      accessibilityHint,
      accessible,
      allowFontScaling = isIos,
      maxFontSizeMultiplier=1.3,
      ...rest
    }) => {
  const styleOverride = [styles.button, styles[preset] || styles.default, buttonStyle];
  const titleStyleOverride = [titleStyle, titleStyles[preset]];

  const handleOnPress = () => {
    if (click_label || click_destination) {
      logFirebaseCustomEvent(strings.click, {
        click_label: click_label,
        click_destination: click_destination,
      });
    }
    onPress();
  };
  return (
      <TouchableOpacity
          disabled={disabled || loading || isSelected}
          activeOpacity={0.7}
          accessible={accessible}
          accessibilityState={isIos ? {disabled: disabled, busy: loading, selected: isSelected}: {}}
          accessibilityRole={'button'}
          accessibilityHint={accessibilityHint}
          accessibilityLabel={title}
          onPress={handleOnPress}
          style={[
            styleOverride,
            disabled && {backgroundColor: colors.secondaryLight, ...disabledButtonStyle},
          ]}
          {...rest}>
        {!loading ? (
            <>
              {LeftAccessories ? <LeftAccessories /> : null}
              <RText
                  color={colors.white}
                  allowFontScaling={allowFontScaling}
                  maxFontSizeMultiplier={ maxFontSizeMultiplier}
                  textStyle={[
                    titleStyleOverride,
                    disabled && disabledButtonTitleStyle,
                    {textTransform: 'uppercase'},
                  ]}
                  weight={'headerBold'}
                  text={title}
                  preset={titlePreset}
                  size={'md'}
                  accessible={accessible}
              />
            </>
        ) : null}

        {!!loading && <ActivityIndicator color={colors.white} style={styles.loader} />}
      </TouchableOpacity>
  );
};
const titleStyles = StyleSheet.create({
  default: {
    color: colors.white,
  },
  outlined: {
    color: colors.secondary,
  },
});
export default RButton;
