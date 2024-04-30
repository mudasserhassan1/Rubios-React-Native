import {StyleSheet} from 'react-native';
import {appStyles, colors} from '../../theme';
import { getMScale, getVerticalScale } from "../../theme/metrics";
import { isIos } from "../../utils/sharedUtils";

const styles = StyleSheet.create({
  screen: appStyles.screen,
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    marginBottom: getVerticalScale(10),
    marginTop: isIos ? getMScale(5) : getMScale(12),
    color: colors.textGray,
  },
  button: {
    width: '70%',
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default styles;
