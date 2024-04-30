import {StyleSheet} from 'react-native';
import {appStyles} from '../../theme';
import { getMScale, getVerticalScale } from "../../theme/metrics";
import { isIos } from "../../utils/sharedUtils";

const styles = StyleSheet.create({
  screen: appStyles.screen,
  info: {
    marginBottom: getVerticalScale(10),
    marginTop: isIos ? getMScale(5) : getMScale(12),
  },
  input: {
    marginTop: getVerticalScale(18),
  },
  button: {
    width: '70%',
    alignSelf: 'center',
    marginTop: getVerticalScale(30),
  },
  openEmailTextStyle: {
    textDecorationLine: 'underline',
    marginTop: getVerticalScale(30),
    alignSelf: 'center',
  },
});

export default styles;
