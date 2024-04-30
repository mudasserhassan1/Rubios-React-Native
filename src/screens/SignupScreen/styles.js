import {StyleSheet} from 'react-native';
import {appStyles, colors} from '../../theme';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import { isIos } from "../../utils/sharedUtils";

const styles = StyleSheet.create({
  screen: appStyles.screen,
  container: {
    flex: 1,
    padding: getMScale(20),
    backgroundColor: 'white',
  },
  title: {
    textTransform: 'uppercase',
    color: colors.green,
    fontWeight: '400',
    fontSize: 15,
  },
  subTitle: {
    marginTop: getVerticalScale(isIos ? 10 : 30),
    marginBottom: getVerticalScale(18),
  },

  text: {
    color: 'gray',
    marginStart: getMScale(5),
    marginEnd: getMScale(10),
    paddingEnd: getMScale(22),
    fontSize: getMScale(15),
  },

  link: {
    color: '#6178f7',
  },
  locationItemContainer: {
    padding: getMScale(10),
  },
  locationText: {
    color: colors.text,
  },
  listStyle: {backgroundColor: 'white'},
  checkBoxContainer: {
    marginVertical: getMScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});

export default styles;
