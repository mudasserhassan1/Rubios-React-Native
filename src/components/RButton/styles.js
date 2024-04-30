import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import { getMScale, getScale, getVerticalScale } from "../../theme/metrics";

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
  },
  default: {
    backgroundColor: colors.secondary,
    width: getMScale(230),
    minHeight: getVerticalScale(44),
    // marginVertical: getMScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getScale(23),
  },
  outlined: {
    backgroundColor: 'transparent',
    width: getMScale(230),
    height: getVerticalScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:2,
    borderColor: colors.secondary,
    borderRadius: getScale(23),
  },
  loader: {
    height: getMScale(25),
    width: getMScale(25),
    alignSelf: 'center',
  },
});

export default styles;
