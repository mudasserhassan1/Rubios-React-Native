import {StyleSheet} from 'react-native';
import {appStyles, colors} from '../../theme';
import {getMScale} from '../../theme/metrics';

const styles = StyleSheet.create({
  screen: {
    ...appStyles.screen,
    flexGrow: 1,
    flex: 1,
    backgroundColor: colors.white,
  },
  list: {
    flexGrow: 1,
  },
  container: {
    flexDirection: 'row',
    paddingVertical: getMScale(15),
    paddingHorizontal: getMScale(10),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.textColorDark,
    fontSize: 15,
    fontWeight: '500',
  },
});
export default styles;
