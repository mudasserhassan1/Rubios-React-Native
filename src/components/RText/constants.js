import {isIos} from '../../utils/sharedUtils';

const getFontSize = val => (isIos ? val : val);
export const FONT_SIZE = {
  xxl: {fontSize: getFontSize(28), lineHeight: 30},
  xl: {fontSize: getFontSize(24), lineHeight: 26},
  lg: {fontSize: getFontSize(20), lineHeight: 22},
  md: {fontSize: getFontSize(18), lineHeight: 22},
  sm: {fontSize: getFontSize(16), lineHeight: 18},
  xs: {fontSize: 14, lineHeight: 16},
  xxs: {fontSize: 12, lineHeight: 14},
  xxxs: {fontSize: 10, lineHeight: 14},
};

export const FONT_WEIGHT = {
  regular: {fontFamily: 'LibreFranklin-Regular'},
  medium: {fontFamily: 'LibreFranklin-Medium'},
  semiBold: {fontFamily: 'LibreFranklin-SemiBold'},
  bold: {fontFamily: 'LibreFranklin-Bold'},
  headerBold: {fontFamily: 'GritSans-Bold'},
};

export const PRESETS = {
  default: 'default',
  label: 'label',
  bold: 'bold',
  semiBold: 'semiBold',
  medium: 'Medium',
  heading: 'heading',
  subheading: 'subheading',
  formLabel: 'formLabel',
  formHelper: 'formHelper',
  header: 'header',
};
