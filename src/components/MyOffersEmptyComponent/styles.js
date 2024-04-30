import {Platform, StyleSheet} from 'react-native';
import {getMScale, getScale, getVerticalScale} from '../../theme/metrics';
import {colors} from '../../theme';

const styles = StyleSheet.create({
  parentStyle: {
    alignContent: 'center',
    backgroundColor: 'white',
  },
  container: {
    padding: getMScale(17),
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(162, 162, 162, 0.3)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.7,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  subTitleText: {
    marginTop: getVerticalScale(5),
    width: getScale(185),
    letterSpacing: 0.15,
  },
  line: {
    height: '100%',
    marginVertical: getVerticalScale(20),
    width: 1,
    backgroundColor: colors.dividerLine,
  },
  titleText: {
    textAlign: 'left',
    letterSpacing: 0.15,
    lineHeight: 16,
  },
  rightText: {
    textAlign: 'center',
  },
});

export default styles;
