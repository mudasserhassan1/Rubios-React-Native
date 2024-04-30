import {StyleSheet} from 'react-native';
import {FONT_SIZE, FONT_WEIGHT, PRESETS} from './constants';
import {colors} from '../../theme';

const baseStyle = [FONT_SIZE.sm, {fontFamily: 'LibreFranklin-Regular', color: colors.text}];

export const styles = StyleSheet.create({
  [PRESETS.default]: baseStyle,

  [PRESETS.bold]: [baseStyle, FONT_WEIGHT.bold],

  [PRESETS.semiBold]: [baseStyle, FONT_WEIGHT.semiBold],

  [PRESETS.medium]: [baseStyle, FONT_WEIGHT.medium],

  [PRESETS.label]: [baseStyle, FONT_SIZE.sm, FONT_WEIGHT.medium],

  [PRESETS.heading]: [baseStyle, FONT_SIZE.xxl, FONT_WEIGHT.bold],

  [PRESETS.subheading]: [baseStyle, FONT_SIZE.lg, FONT_WEIGHT.medium],

  [PRESETS.formLabel]: [baseStyle, FONT_WEIGHT.medium],

  [PRESETS.formHelper]: [baseStyle, FONT_SIZE.sm, FONT_WEIGHT.regular],

  [PRESETS.header]: [baseStyle, FONT_SIZE.xl, FONT_WEIGHT.headerBold],
});
